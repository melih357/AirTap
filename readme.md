# AirTap — WAMP Kurulum ve Kullanım Rehberi

AirTap, kameradaki el hareketlerini cihaz üzerinde algılayan ve seçilen efekti avuçtan fırlatıyormuş gibi gösteren tarayıcı tabanlı bir uygulamadır. Bu paket **AirTap Pro V3.1.0** sürümüdür. Efekt seçimi fareden tamamen ayrılmıştır; parmak derinliği ve parmağın kameraya yaklaşırken kısalan görüntüsü birlikte ölçülür.

> Doğru paketi açtığınızı ana ekrandaki `PRO V3.1` etiketinden anlayabilirsiniz. Kamera stüdyosunda efekt çarkı açıldığında sağ üstte canlı `PARMAK SENSÖRÜ / PRO V3.1` paneli görünür.

## Pakette neler var?

- `frontend/`: Ana sayfa, kamera stüdyosu, ayarlar, eğitim, kayıt ve bütün görsel dosyalar
- `backend/`: PHP geri bildirim API'si ve MySQL bağlantısı
- `uploads/`: Gelecekteki yüklemeler için güvenli boş klasör (MVP kamera kaydı buraya yüklenmez)
- `.env`: WAMP ve MySQL bağlantı ayarları
- `database.sql`: Temiz veritabanı kurulumu
- `migration.sql`: Mevcut kurulumu aynı şemaya yükseltmek için güvenli/idempotent SQL
- `.htaccess`: Hassas dosyaları ve yükleme klasörünü koruyan Apache kuralları

El takip modeli ve WebAssembly dosyaları `frontend/assets/vendor/mediapipe/` içinde yerel olarak bulunur. Site çalışırken CDN bağlantısı gerekmez.

## 1. WAMP ile kurulum

1. WAMP kapalıyken eski `C:\wamp64\www\AirTap` klasörünü `AirTap-eski` olarak yeniden adlandırın.
2. Yeni ZIP dosyasını çıkartın.
3. Çıkan `AirTap` klasörünü WAMP'ın `www` klasörüne kopyalayın. Varsayılan konum genellikle:

   ```text
   C:\wamp64\www\AirTap
   ```

4. WAMP Server'ı açın.
5. WAMP simgesi yeşil olana kadar bekleyin. Apache ve MySQL servislerinin çalıştığını kontrol edin.
6. Tarayıcıdan `http://localhost/phpmyadmin/` adresini açın.
7. Üst menüden **İçe Aktar** seçeneğine basın.
8. Proje içindeki `database.sql` dosyasını seçip **Git** düğmesine basın.
9. Chrome'da şu adresi açın:

   ```text
   http://localhost/AirTap/frontend/
   ```

10. **Kamerayı Başlat** düğmesine basın ve tarayıcının kamera iznine **İzin ver** seçeneğini seçin.

V3.1 dosyaları sürüm parametresi ve Apache `no-cache` başlıkları kullanır. Bu nedenle normal kullanımda eski JavaScript'in açılması engellenir.

## 2. `.env` ayarı

WAMP'ın varsayılan MySQL kullanıcısı `root` ve parolası boşsa dosyayı değiştirmeniz gerekmez:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=airtap
DB_USERNAME=root
DB_PASSWORD=
```

MySQL kullanıcınıza parola koyduysanız `.env` içindeki `DB_PASSWORD` değerini değiştirin. Farklı kullanıcı kullanıyorsanız `DB_USERNAME` değerini de güncelleyin.

## 3. Hızlı sistem testi

Önce API ve MySQL bağlantısını kontrol etmek için şunu açın:

```text
http://localhost/AirTap/backend/api.php?action=health
```

Doğru kurulumda JSON içinde şu değerleri görürsünüz:

```json
{
  "ok": true,
  "app": "AirTap",
  "api": "ready",
  "database": "connected"
}
```

Ardından ana uygulamada sırayla şunları test edin:

1. Kamera izni verildiğinde görüntü açılıyor mu?
2. Elinizi gösterdiğinizde üstte **El algılandı** yazıyor mu?
3. Yalnızca işaret parmağını yaklaşık yarım saniye kaldırınca çark açılıyor mu?
4. Parmağı çarktaki bir efekte götürüp kameraya doğru iki kısa ve net ileri–geri hareket yapınca sırasıyla `1 / 2` göstergesi ve seçim onayı geliyor mu?
5. Açık avucunuzu kısa süre sabit tutup kameraya doğru hızlıca itince efekt çıkıyor mu?
6. Fotoğraf ve video düğmeleri indirme oluşturuyor mu?
7. Ana sayfadaki geri bildirim formu gönderiliyor mu?

Efekt çarkı fare tıklamasını kabul etmez. Seçim doğrudan kameradaki işaret parmağıyla yapılır. Çift dokunmak zor gelirse **Ayarlar > Seçim yöntemi > Parmakla üzerinde bekleme** seçeneğini kullanabilirsiniz.

## 4. Hareketler

### Efekt çarkını açma

- İşaret parmağı açık olmalı.
- Orta, yüzük ve serçe parmak kapalı olmalı.
- Pozu yaklaşık yarım saniye koruyun.

### Efekt seçme

- Parmağı çarktaki seçeneğe götürün.
- Seçenek çevresindeki halka dolunca işaret parmağınızı kameraya doğru kısa biçimde itin ve geri çekin.
- İlk hareket algılandığında parmak ucunda yeşil bir dalga ve çarkın ortasında `1 / 2 DOKUNUŞ` görünür.
- Aynı seçenek üzerinde ikinci ileri–geri hareketi yapınca efekt seçilir.
- Işık veya kamera derinliği yeterli değilse **Ayarlar > Seçim yöntemi** bölümünden `Parmakla üzerinde bekleme` seçilebilir.

### Efekt fırlatma

- Avucunuzu tamamen açık gösterin.
- Hazır halkasının yeşil olmasını bekleyin.
- Elinizi kameraya doğru hızlıca itin.
- Yeni atış için elinizi normal uzaklığına geri çekin.

## 5. Sinematik efekt motoru

- **Alev Topu:** Çok katmanlı sıcak çekirdek, alev dili, kıvılcım, duman ve patlama halkası
- **Buz Işını:** Saydam kristal mermi, soğuk sis, buz parçaları ve radyal kırılma
- **Elektrik:** Hareketli plazma çekirdeği, dallanan şimşekler ve elektrik çarpışması
- **Lazer:** Yoğun ışık izi, parlak mermi ucu, lens parlaması ve ışın çarpışması
- **Örümcek Ağı:** Uçuşta örülen lifler ve çarpışma noktasında organik olarak açılan ağ
- **Enerji Topu:** Dönen plazma katmanları, yörünge halkaları ve genişleyen enerji darbesi

Efektler avucun yönünden çıkar, sahnenin içinde hesaplanan hedefe ilerler ve hedefte ayrı bir çarpışma animasyonu üretir. Yüksek kalite modunda daha yoğun parçacık, parlama ve hareket izi kullanılır.

## 6. Kalibrasyon ve hassasiyet

Farklı kamera ve ışıklarda hareket eşikleri değişebilir. Kamera ekranında **Ayarlar > Kalibrasyon** yolunu kullanın:

1. Açık avucu normal uzaklıkta tutup değeri kaydedin.
2. Elinizi kameraya yaklaştırıp ileri itiş değerini kaydedin.
3. Tek parmakla çarkı test edip kalibrasyonu tamamlayın.

Çift dokunma veya atış zor algılanıyorsa ilgili hassasiyet kaydırıcısını yükseltin. Yanlışlıkla algılanıyorsa düşürün.

## 7. Gizlilik

- Kamera yalnızca kullanıcı düğmeye bastığında açılır.
- El algılama MediaPipe modeliyle tarayıcıda ve cihaz üzerinde yapılır.
- Kamera kareleri PHP'ye veya MySQL'e gönderilmez.
- Video yalnızca kullanıcı kayıt düğmesine bastığında tarayıcı içinde oluşturulur.
- Fotoğraf ve video doğrudan kullanıcının cihazına indirilir; `uploads/` klasörüne otomatik yükleme yapılmaz.
- MySQL yalnızca kullanıcının açıkça gönderdiği geri bildirim metnini, puanı, kategoriyi ve hata ayıklamak için tarayıcı tanımını saklar.

## 8. Sorun giderme

### Kamera izni gelmiyor

- Uygulamayı dosyaya çift tıklayarak (`file:///`) değil, mutlaka `http://localhost/AirTap/frontend/` adresinden açın.
- Chrome adres çubuğundaki kamera simgesine basıp izni etkinleştirin.
- Windows **Ayarlar > Gizlilik ve güvenlik > Kamera** bölümünde tarayıcı iznini kontrol edin.

### Kamera siyah veya başka uygulamada

Discord, Zoom, Teams veya Kamera uygulamasını kapatıp sayfayı yenileyin. WAMP'ta Apache'nin çalıştığını doğrulayın.

### El algılanmıyor

- Elinizin tamamını kadraja alın.
- Yüzünüze karşı değil, sade ve aydınlık bir arka plana doğru deneyin.
- **Ayarlar > Kamera kalitesi** bölümünden düşük kaliteyi deneyin.
- **El takip hassasiyeti** değerini biraz yükseltin.

### Geri bildirim gönderilemiyor

- `database.sql` dosyasını phpMyAdmin'e aktardığınızdan emin olun.
- `.env` kullanıcı/parola ayarlarını kontrol edin.
- WAMP menüsünden PHP'de `pdo_mysql` uzantısının açık olduğunu kontrol edin.
- `http://localhost/AirTap/backend/api.php?action=health` adresindeki hata ayrıntısını inceleyin.

### `.htaccess` nedeniyle 500 hatası

Eski bir Apache yapılandırması `Require all denied` kuralını tanımıyorsa WAMP'ın güncel sürümünü kullanın. Apache'nin `mod_headers` modülü zorunlu değildir; kapalıysa yalnızca ek güvenlik başlıkları uygulanmaz.

## 9. Teknik yapı

- HTML5, modern CSS ve modüler JavaScript
- PHP 8+ ve PDO MySQL
- MySQL / MariaDB (WAMP içindeki sürüm)
- MediaPipe Hands — cihaz içinde 21 el işaret noktası
- Canvas 2D — altı ayrı efekt ve parçacık sistemi
- Web Audio API — kurulum gerektirmeyen üretilmiş efekt sesleri
- MediaRecorder API — kamera, el katmanı ve efektlerin birlikte video kaydı
- `localStorage` — ayarlar, eğitim durumu ve son seçilen efekt

Önerilen tarayıcı güncel Google Chrome veya Microsoft Edge'dir. Safari ve Firefox'ta temel kamera/el takibi çalışsa da MediaRecorder çıktı biçimi tarayıcıya göre değişebilir.

## 10. Proje notları

- MVP'de üyelik, profil, bulut video kaydı ve çok oyunculu sistem yoktur.
- `migration.sql` temiz kurulum için zorunlu değildir; gelecekteki sürümlerde mevcut verileri koruyarak şemayı güncellemek için ayrılmıştır.
- Kamera açıldıktan sonra internet bağlantısına ihtiyaç duyulmaması için yaklaşık 24 MB MediaPipe model/wasm dosyası pakete eklenmiştir.
- Üretim ortamında `APP_DEBUG=false` yapın ve HTTPS kullanın.
