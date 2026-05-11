-- ============================================================
-- CAR RENTAL APP — MySQL Database Schema
-- Roles: Customer, Car Owner, Admin
-- ============================================================

CREATE DATABASE IF NOT EXISTS car_rental_app;
USE car_rental_app;

-- ============================================================
-- 1. RBAC — ROLES & PERMISSIONS
-- ============================================================

CREATE TABLE roles (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(50)     NOT NULL UNIQUE,
    display_name    VARCHAR(100)    NOT NULL,
    description     TEXT            NULL,
    is_default      BOOLEAN         NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE permissions (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL UNIQUE,
    display_name    VARCHAR(150)    NOT NULL,
    module          VARCHAR(50)     NOT NULL,
    description     TEXT            NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_module (module)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE role_permissions (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id         BIGINT UNSIGNED NOT NULL,
    permission_id   BIGINT UNSIGNED NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id)       REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE KEY uk_role_perm (role_id, permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 2. USERS & AUTHENTICATION
-- ============================================================

CREATE TABLE users (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(100)    NOT NULL,
    last_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    phone           VARCHAR(20)     NULL,
    password_hash   VARCHAR(255)    NOT NULL,
    avatar_url      VARCHAR(500)    NULL,
    date_of_birth   DATE            NULL,
    gender          ENUM('male','female','other') NULL,
    is_verified     BOOLEAN         NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    onboarding_done BOOLEAN         NOT NULL DEFAULT FALSE,
    last_login_at   TIMESTAMP       NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE user_roles (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    role_id         BIGINT UNSIGNED NOT NULL,
    assigned_by     BIGINT UNSIGNED NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id)     REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY uk_user_role (user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE verification_codes (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    code            VARCHAR(10)     NOT NULL,
    type            ENUM('email','phone','password_reset') NOT NULL DEFAULT 'email',
    expires_at      TIMESTAMP       NOT NULL,
    is_used         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_code (user_id, code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE user_sessions (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    token           VARCHAR(500)    NOT NULL UNIQUE,
    device_info     VARCHAR(255)    NULL,
    ip_address      VARCHAR(45)     NULL,
    expires_at      TIMESTAMP       NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE social_logins (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    provider        ENUM('google','apple','facebook') NOT NULL,
    provider_uid    VARCHAR(255)    NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_provider_uid (provider, provider_uid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 3. USER SETTINGS & PREFERENCES
-- ============================================================

CREATE TABLE user_settings (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT UNSIGNED NOT NULL UNIQUE,
    push_notifications  BOOLEAN         NOT NULL DEFAULT TRUE,
    email_notifications BOOLEAN         NOT NULL DEFAULT TRUE,
    sms_notifications   BOOLEAN         NOT NULL DEFAULT FALSE,
    language            VARCHAR(10)     NOT NULL DEFAULT 'en',
    currency            VARCHAR(5)      NOT NULL DEFAULT 'USD',
    dark_mode           BOOLEAN         NOT NULL DEFAULT FALSE,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE user_addresses (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    label           VARCHAR(50)     NULL,
    address_line_1  VARCHAR(255)    NOT NULL,
    address_line_2  VARCHAR(255)    NULL,
    city            VARCHAR(100)    NOT NULL,
    state           VARCHAR(100)    NULL,
    zip_code        VARCHAR(20)     NULL,
    country         VARCHAR(100)    NOT NULL,
    latitude        DECIMAL(10,7)   NULL,
    longitude       DECIMAL(10,7)   NULL,
    is_default      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 4. CAR OWNERS & PARTNERSHIPS
-- ============================================================

CREATE TABLE car_owners (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT UNSIGNED NOT NULL UNIQUE,
    business_name       VARCHAR(255)    NULL,
    business_license    VARCHAR(100)    NULL,
    tax_id              VARCHAR(50)     NULL,
    bank_account_number VARCHAR(100)    NULL,
    bank_name           VARCHAR(100)    NULL,
    verification_status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
    rating              DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
    total_rentals       INT UNSIGNED    NOT NULL DEFAULT 0,
    bio                 TEXT            NULL,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE partnerships (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    owner_id        BIGINT UNSIGNED NOT NULL,
    company_name    VARCHAR(255)    NOT NULL,
    contact_person  VARCHAR(200)    NULL,
    contact_email   VARCHAR(255)    NULL,
    contact_phone   VARCHAR(20)     NULL,
    status          ENUM('pending','active','suspended','terminated') NOT NULL DEFAULT 'pending',
    agreement_url   VARCHAR(500)    NULL,
    start_date      DATE            NULL,
    end_date        DATE            NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES car_owners(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 5. CARS & CATEGORIES
-- ============================================================

CREATE TABLE car_brands (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL UNIQUE,
    logo_url        VARCHAR(500)    NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE car_categories (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL UNIQUE,
    description     TEXT            NULL,
    icon_url        VARCHAR(500)    NULL,
    sort_order      INT             NOT NULL DEFAULT 0,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE cars (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    owner_id            BIGINT UNSIGNED NOT NULL,
    brand_id            BIGINT UNSIGNED NOT NULL,
    category_id         BIGINT UNSIGNED NOT NULL,
    model               VARCHAR(150)    NOT NULL,
    year                SMALLINT UNSIGNED NOT NULL,
    color               VARCHAR(50)     NULL,
    license_plate       VARCHAR(20)     NOT NULL UNIQUE,
    vin                 VARCHAR(20)     NULL UNIQUE,
    transmission        ENUM('automatic','manual')     NOT NULL DEFAULT 'automatic',
    fuel_type           ENUM('petrol','diesel','electric','hybrid') NOT NULL DEFAULT 'petrol',
    seats               TINYINT UNSIGNED NOT NULL DEFAULT 5,
    doors               TINYINT UNSIGNED NOT NULL DEFAULT 4,
    mileage             INT UNSIGNED    NULL,
    horsepower          SMALLINT UNSIGNED NULL,
    engine_capacity     DECIMAL(3,1)    NULL,
    has_ac              BOOLEAN         NOT NULL DEFAULT TRUE,
    has_bluetooth       BOOLEAN         NOT NULL DEFAULT TRUE,
    has_gps             BOOLEAN         NOT NULL DEFAULT FALSE,
    has_usb             BOOLEAN         NOT NULL DEFAULT TRUE,
    has_child_seat      BOOLEAN         NOT NULL DEFAULT FALSE,
    price_per_hour      DECIMAL(10,2)   NOT NULL,
    price_per_day       DECIMAL(10,2)   NOT NULL,
    currency            VARCHAR(5)      NOT NULL DEFAULT 'USD',
    description         TEXT            NULL,
    status              ENUM('available','rented','maintenance','inactive') NOT NULL DEFAULT 'available',
    average_rating      DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
    total_trips         INT UNSIGNED    NOT NULL DEFAULT 0,
    latitude            DECIMAL(10,7)   NULL,
    longitude           DECIMAL(10,7)   NULL,
    address             VARCHAR(255)    NULL,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id)    REFERENCES car_owners(id) ON DELETE CASCADE,
    FOREIGN KEY (brand_id)    REFERENCES car_brands(id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES car_categories(id) ON DELETE RESTRICT,
    INDEX idx_status (status),
    INDEX idx_category (category_id),
    INDEX idx_brand (brand_id),
    INDEX idx_price_day (price_per_day),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE car_images (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    car_id          BIGINT UNSIGNED NOT NULL,
    image_url       VARCHAR(500)    NOT NULL,
    is_primary      BOOLEAN         NOT NULL DEFAULT FALSE,
    sort_order      INT             NOT NULL DEFAULT 0,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE,
    INDEX idx_car (car_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 6. SEARCH & FILTERS
-- ============================================================

CREATE TABLE saved_searches (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    search_query    VARCHAR(255)    NULL,
    brand_id        BIGINT UNSIGNED NULL,
    category_id     BIGINT UNSIGNED NULL,
    min_price       DECIMAL(10,2)   NULL,
    max_price       DECIMAL(10,2)   NULL,
    transmission    ENUM('automatic','manual') NULL,
    fuel_type       ENUM('petrol','diesel','electric','hybrid') NULL,
    min_seats       TINYINT UNSIGNED NULL,
    pickup_lat      DECIMAL(10,7)   NULL,
    pickup_lng      DECIMAL(10,7)   NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (brand_id)    REFERENCES car_brands(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES car_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 7. LOCATIONS (PICK-UP & DROP-OFF)
-- ============================================================

CREATE TABLE locations (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255)    NOT NULL,
    address         VARCHAR(500)    NOT NULL,
    city            VARCHAR(100)    NOT NULL,
    state           VARCHAR(100)    NULL,
    country         VARCHAR(100)    NOT NULL,
    zip_code        VARCHAR(20)     NULL,
    latitude        DECIMAL(10,7)   NOT NULL,
    longitude       DECIMAL(10,7)   NOT NULL,
    location_type   ENUM('pickup','dropoff','both') NOT NULL DEFAULT 'both',
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    opening_time    TIME            NULL,
    closing_time    TIME            NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_coords (latitude, longitude),
    INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 8. BOOKINGS & RENTALS
-- ============================================================

CREATE TABLE bookings (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_ref         VARCHAR(20)     NOT NULL UNIQUE,
    user_id             BIGINT UNSIGNED NOT NULL,
    car_id              BIGINT UNSIGNED NOT NULL,
    pickup_location_id  BIGINT UNSIGNED NULL,
    dropoff_location_id BIGINT UNSIGNED NULL,
    pickup_address      VARCHAR(500)    NULL,
    dropoff_address     VARCHAR(500)    NULL,
    pickup_datetime     DATETIME        NOT NULL,
    dropoff_datetime    DATETIME        NOT NULL,
    actual_pickup_at    DATETIME        NULL,
    actual_dropoff_at   DATETIME        NULL,
    duration_hours      DECIMAL(8,2)    NOT NULL,
    base_price          DECIMAL(10,2)   NOT NULL,
    service_fee         DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    insurance_fee       DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    discount_amount     DECIMAL(10,2)   NOT NULL DEFAULT 0.00,
    total_price         DECIMAL(10,2)   NOT NULL,
    currency            VARCHAR(5)      NOT NULL DEFAULT 'USD',
    status              ENUM('pending','confirmed','active','completed','cancelled','expired') NOT NULL DEFAULT 'pending',
    cancellation_reason TEXT            NULL,
    notes               TEXT            NULL,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)             REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (car_id)              REFERENCES cars(id) ON DELETE RESTRICT,
    FOREIGN KEY (pickup_location_id)  REFERENCES locations(id) ON DELETE SET NULL,
    FOREIGN KEY (dropoff_location_id) REFERENCES locations(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_car (car_id),
    INDEX idx_status (status),
    INDEX idx_dates (pickup_datetime, dropoff_datetime),
    INDEX idx_ref (booking_ref)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 9. PAYMENTS
-- ============================================================

CREATE TABLE payment_methods (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    type            ENUM('credit_card','debit_card','paypal','apple_pay','google_pay','bank_transfer') NOT NULL,
    card_brand      VARCHAR(50)     NULL,
    last_four       VARCHAR(4)      NULL,
    expiry_month    TINYINT UNSIGNED NULL,
    expiry_year     SMALLINT UNSIGNED NULL,
    holder_name     VARCHAR(200)    NULL,
    is_default      BOOLEAN         NOT NULL DEFAULT FALSE,
    token           VARCHAR(500)    NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE payments (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id          BIGINT UNSIGNED NOT NULL,
    payment_method_id   BIGINT UNSIGNED NULL,
    amount              DECIMAL(10,2)   NOT NULL,
    currency            VARCHAR(5)      NOT NULL DEFAULT 'USD',
    status              ENUM('pending','processing','completed','failed','refunded','partially_refunded') NOT NULL DEFAULT 'pending',
    transaction_id      VARCHAR(255)    NULL,
    payment_date        TIMESTAMP       NULL,
    refund_amount       DECIMAL(10,2)   NULL,
    refund_date         TIMESTAMP       NULL,
    failure_reason      VARCHAR(500)    NULL,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id)        REFERENCES bookings(id) ON DELETE RESTRICT,
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL,
    INDEX idx_booking (booking_id),
    INDEX idx_status (status),
    INDEX idx_transaction (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 10. REVIEWS & RATINGS
-- ============================================================

CREATE TABLE reviews (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id      BIGINT UNSIGNED NOT NULL UNIQUE,
    reviewer_id     BIGINT UNSIGNED NOT NULL,
    car_id          BIGINT UNSIGNED NOT NULL,
    owner_id        BIGINT UNSIGNED NOT NULL,
    rating          TINYINT UNSIGNED NOT NULL,
    comment         TEXT            NULL,
    cleanliness     TINYINT UNSIGNED NULL,
    comfort         TINYINT UNSIGNED NULL,
    value_for_money TINYINT UNSIGNED NULL,
    is_visible      BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id)  REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id)      REFERENCES cars(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id)    REFERENCES car_owners(id) ON DELETE CASCADE,
    INDEX idx_car (car_id),
    INDEX idx_owner (owner_id),
    INDEX idx_rating (rating),
    CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 11. NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    title           VARCHAR(255)    NOT NULL,
    body            TEXT            NOT NULL,
    type            ENUM('booking','payment','promo','system','chat','reminder') NOT NULL DEFAULT 'system',
    reference_type  VARCHAR(50)     NULL,
    reference_id    BIGINT UNSIGNED NULL,
    is_read         BOOLEAN         NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMP       NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 12. INBOX / MESSAGES & CHAT
-- ============================================================

CREATE TABLE conversations (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    booking_id      BIGINT UNSIGNED NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE conversation_participants (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED NOT NULL,
    joined_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)         REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_conv_user (conversation_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE messages (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    conversation_id BIGINT UNSIGNED NOT NULL,
    sender_id       BIGINT UNSIGNED NOT NULL,
    content         TEXT            NOT NULL,
    message_type    ENUM('text','image','location','system') NOT NULL DEFAULT 'text',
    attachment_url  VARCHAR(500)    NULL,
    is_read         BOOLEAN         NOT NULL DEFAULT FALSE,
    read_at         TIMESTAMP       NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id)       REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation (conversation_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 13. FAVORITES / WISHLIST
-- ============================================================

CREATE TABLE favorites (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    car_id          BIGINT UNSIGNED NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id)  REFERENCES cars(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_car (user_id, car_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 14. PROMOTIONS & COUPONS
-- ============================================================

CREATE TABLE promotions (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code            VARCHAR(50)     NOT NULL UNIQUE,
    title           VARCHAR(255)    NOT NULL,
    description     TEXT            NULL,
    discount_type   ENUM('percentage','fixed') NOT NULL DEFAULT 'percentage',
    discount_value  DECIMAL(10,2)   NOT NULL,
    min_order_value DECIMAL(10,2)   NULL,
    max_discount    DECIMAL(10,2)   NULL,
    usage_limit     INT UNSIGNED    NULL,
    used_count      INT UNSIGNED    NOT NULL DEFAULT 0,
    start_date      DATETIME        NOT NULL,
    end_date        DATETIME        NOT NULL,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE user_promotions (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    promotion_id    BIGINT UNSIGNED NOT NULL,
    booking_id      BIGINT UNSIGNED NULL,
    used_at         TIMESTAMP       NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)      REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (promotion_id) REFERENCES promotions(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id)   REFERENCES bookings(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 15. CONTACT & SUPPORT
-- ============================================================

CREATE TABLE support_tickets (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    booking_id      BIGINT UNSIGNED NULL,
    subject         VARCHAR(255)    NOT NULL,
    description     TEXT            NOT NULL,
    status          ENUM('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
    priority        ENUM('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
    assigned_to     BIGINT UNSIGNED NULL,
    resolved_at     TIMESTAMP       NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)     REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id)  REFERENCES bookings(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 16. ACTIVITY / AUDIT LOG
-- ============================================================

CREATE TABLE activity_logs (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NULL,
    action          VARCHAR(100)    NOT NULL,
    entity_type     VARCHAR(50)     NULL,
    entity_id       BIGINT UNSIGNED NULL,
    old_values      JSON            NULL,
    new_values      JSON            NULL,
    ip_address      VARCHAR(45)     NULL,
    user_agent      VARCHAR(500)    NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 17. SEED DATA
-- ============================================================

-- ── 3 Roles ──
INSERT INTO roles (name, display_name, description, is_default) VALUES
    ('customer',  'Customer',      'Regular app user who rents cars',      TRUE),
    ('car_owner', 'Car Owner',     'User who lists cars for rent',         FALSE),
    ('admin',     'Administrator', 'Full system access and management',    FALSE);

-- ── Permissions ──
INSERT INTO permissions (name, display_name, module) VALUES
    -- Users
    ('users.view',              'View Users',               'users'),
    ('users.create',            'Create Users',             'users'),
    ('users.edit',              'Edit Users',               'users'),
    ('users.delete',            'Delete Users',             'users'),
    ('users.assign_roles',      'Assign Roles to Users',    'users'),
    -- Cars
    ('cars.view',               'View Cars',                'cars'),
    ('cars.create',             'Create Car Listings',      'cars'),
    ('cars.edit',               'Edit Car Listings',        'cars'),
    ('cars.delete',             'Delete Car Listings',      'cars'),
    ('cars.approve',            'Approve Car Listings',     'cars'),
    -- Bookings
    ('bookings.view_own',       'View Own Bookings',        'bookings'),
    ('bookings.view_all',       'View All Bookings',        'bookings'),
    ('bookings.create',         'Create Bookings',          'bookings'),
    ('bookings.cancel',         'Cancel Bookings',          'bookings'),
    ('bookings.manage',         'Manage All Bookings',      'bookings'),
    -- Payments
    ('payments.view_own',       'View Own Payments',        'payments'),
    ('payments.view_all',       'View All Payments',        'payments'),
    ('payments.refund',         'Issue Refunds',            'payments'),
    -- Reviews
    ('reviews.create',          'Write Reviews',            'reviews'),
    ('reviews.delete',          'Delete Reviews',           'reviews'),
    ('reviews.moderate',        'Moderate Reviews',         'reviews'),
    -- Notifications
    ('notifications.view_own',  'View Own Notifications',   'notifications'),
    ('notifications.send',      'Send Notifications',       'notifications'),
    ('notifications.broadcast', 'Broadcast Notifications',  'notifications'),
    -- Chat
    ('chat.use',                'Use Chat',                 'chat'),
    ('chat.view_all',           'View All Conversations',   'chat'),
    -- Promotions
    ('promotions.view',         'View Promotions',          'promotions'),
    ('promotions.create',       'Create Promotions',        'promotions'),
    ('promotions.edit',         'Edit Promotions',          'promotions'),
    ('promotions.delete',       'Delete Promotions',        'promotions'),
    -- Support
    ('support.create_ticket',   'Create Support Tickets',   'support'),
    ('support.view_own',        'View Own Tickets',         'support'),
    ('support.view_all',        'View All Tickets',         'support'),
    ('support.resolve',         'Resolve Tickets',          'support'),
    -- Partnerships
    ('partnerships.view',       'View Partnerships',        'partnerships'),
    ('partnerships.manage',     'Manage Partnerships',      'partnerships'),
    -- Car Owners
    ('owners.register',         'Register as Car Owner',    'owners'),
    ('owners.approve',          'Approve Car Owners',       'owners'),
    -- Reports & Logs
    ('reports.view',            'View Reports & Analytics', 'reports'),
    ('logs.view',               'View Activity Logs',       'logs'),
    -- Roles
    ('roles.manage',            'Manage Roles',             'roles'),
    ('permissions.manage',      'Manage Permissions',       'roles');


-- ── CUSTOMER permissions ──
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'customer' AND p.name IN (
    'cars.view',
    'bookings.view_own', 'bookings.create', 'bookings.cancel',
    'payments.view_own',
    'reviews.create',
    'notifications.view_own',
    'chat.use',
    'promotions.view',
    'support.create_ticket', 'support.view_own',
    'owners.register'
);

-- ── CAR OWNER permissions ──
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'car_owner' AND p.name IN (
    'cars.view', 'cars.create', 'cars.edit', 'cars.delete',
    'bookings.view_own', 'bookings.create', 'bookings.cancel',
    'payments.view_own',
    'reviews.create',
    'notifications.view_own',
    'chat.use',
    'promotions.view',
    'support.create_ticket', 'support.view_own',
    'partnerships.view'
);

-- ── ADMIN permissions (everything) ──
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'admin';


-- ── Car Categories ──
INSERT INTO car_categories (name, description, sort_order) VALUES
    ('All Cars',     'Browse all available cars',    1),
    ('Regular Cars', 'Affordable everyday vehicles', 2),
    ('Luxury Cars',  'Premium and luxury vehicles',  3);

-- ── Car Brands ──
INSERT INTO car_brands (name) VALUES
    ('Tesla'), ('BMW'), ('Mercedes-Benz'), ('Audi'), ('Toyota'),
    ('Honda'), ('Ford'), ('Chevrolet'), ('Porsche'), ('Range Rover');
