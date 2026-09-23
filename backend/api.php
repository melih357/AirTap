<?php
declare(strict_types=1);

require_once __DIR__ . DIRECTORY_SEPARATOR . 'config.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: same-origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function jsonResponse(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function requestBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        jsonResponse(['ok' => false, 'message' => 'Geçersiz JSON verisi.'], 400);
    }
    return $decoded;
}

function textLength(string $text): int
{
    return function_exists('mb_strlen') ? mb_strlen($text, 'UTF-8') : strlen($text);
}

$action = (string) ($_GET['action'] ?? 'health');
$method = (string) ($_SERVER['REQUEST_METHOD'] ?? 'GET');

try {
    if ($action === 'health' && $method === 'GET') {
        $database = database();
        $database->query('SELECT 1');
        $statement = $database->prepare('SELECT meta_value FROM app_meta WHERE meta_key = :key LIMIT 1');
        $statement->execute(['key' => 'schema_version']);
        $version = $statement->fetchColumn() ?: 'unknown';
        jsonResponse([
            'ok' => true,
            'app' => 'AirTap',
            'api' => 'ready',
            'database' => 'connected',
            'schemaVersion' => $version,
            'privacy' => 'Camera frames are processed only in the browser.',
        ]);
    }

    if ($action === 'feedback' && $method === 'POST') {
        $body = requestBody();
        if (!empty($body['website'])) {
            jsonResponse(['ok' => true, 'message' => 'Teşekkürler.']);
        }

        $category = strtolower(trim((string) ($body['category'] ?? 'experience')));
        $rating = (int) ($body['rating'] ?? 0);
        $message = trim((string) ($body['message'] ?? ''));
        $allowedCategories = ['experience', 'idea', 'bug'];

        if (!in_array($category, $allowedCategories, true)) {
            jsonResponse(['ok' => false, 'message' => 'Geçersiz geri bildirim konusu.'], 422);
        }
        if ($rating < 1 || $rating > 5) {
            jsonResponse(['ok' => false, 'message' => 'Puan 1 ile 5 arasında olmalıdır.'], 422);
        }
        if (textLength($message) < 10 || textLength($message) > 1000) {
            jsonResponse(['ok' => false, 'message' => 'Mesaj 10–1000 karakter arasında olmalıdır.'], 422);
        }

        session_name('airtap_feedback');
        session_start([
            'cookie_httponly' => true,
            'cookie_samesite' => 'Strict',
            'use_strict_mode' => true,
        ]);
        $lastFeedback = (int) ($_SESSION['last_feedback_at'] ?? 0);
        if (time() - $lastFeedback < 8) {
            jsonResponse(['ok' => false, 'message' => 'Yeni bir mesaj göndermeden önce birkaç saniye bekle.'], 429);
        }

        $browser = substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255);
        $statement = database()->prepare(
            'INSERT INTO feedback (category, rating, message, browser) VALUES (:category, :rating, :message, :browser)'
        );
        $statement->execute([
            'category' => $category,
            'rating' => $rating,
            'message' => $message,
            'browser' => $browser,
        ]);
        $_SESSION['last_feedback_at'] = time();

        jsonResponse(['ok' => true, 'message' => 'Geri bildirimin ulaştı. Teşekkürler!'], 201);
    }

    jsonResponse(['ok' => false, 'message' => 'API işlemi bulunamadı.'], 404);
} catch (PDOException $exception) {
    $debug = filter_var(envValue('APP_DEBUG', 'false'), FILTER_VALIDATE_BOOLEAN);
    jsonResponse([
        'ok' => false,
        'message' => 'Veritabanına bağlanılamadı. database.sql dosyasını içe aktardığını ve .env ayarlarını kontrol et.',
        'detail' => $debug ? $exception->getMessage() : null,
    ], 503);
} catch (Throwable $exception) {
    $debug = filter_var(envValue('APP_DEBUG', 'false'), FILTER_VALIDATE_BOOLEAN);
    jsonResponse([
        'ok' => false,
        'message' => 'Beklenmeyen bir sunucu hatası oluştu.',
        'detail' => $debug ? $exception->getMessage() : null,
    ], 500);
}
