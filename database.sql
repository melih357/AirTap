-- AirTap 1.0.0 temiz kurulum veritabanı
-- phpMyAdmin > İçe Aktar ekranından bu dosyayı seçebilirsiniz.

CREATE DATABASE IF NOT EXISTS `airtap`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `airtap`;

CREATE TABLE IF NOT EXISTS `app_meta` (
    `meta_key` VARCHAR(100) NOT NULL,
    `meta_value` VARCHAR(255) NOT NULL,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`meta_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `feedback` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `category` ENUM('experience', 'idea', 'bug') NOT NULL DEFAULT 'experience',
    `rating` TINYINT UNSIGNED NOT NULL,
    `message` TEXT NOT NULL,
    `browser` VARCHAR(255) DEFAULT NULL,
    `status` ENUM('new', 'reviewing', 'resolved', 'archived') NOT NULL DEFAULT 'new',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_feedback_status_created` (`status`, `created_at`),
    CONSTRAINT `chk_feedback_rating` CHECK (`rating` BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `app_meta` (`meta_key`, `meta_value`) VALUES
    ('schema_version', '1.0.0'),
    ('app_name', 'AirTap'),
    ('camera_processing', 'browser_only')
ON DUPLICATE KEY UPDATE `meta_value` = VALUES(`meta_value`);

