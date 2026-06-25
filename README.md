# 🚗 QENT — Car Rental Mobile App

QENT is a full-stack car rental application that lets customers browse and book cars, pay securely with Stripe, chat with car owners, and manage their bookings — while owners list their vehicles and admins oversee the whole platform.

Built as a cross-platform mobile app (React Native + Expo) backed by a Node.js / Express / MySQL REST API using the **MVVM** architecture.

> The user interface is in **Albanian**.

---

## ✨ Features

### Authentication
- Email login & sign-up with **bcrypt** password hashing
- **JWT access token (15 min) + refresh token (7 days)** with rotation, stored in the database and on the device via SecureStore (auto-refresh on expiry)
- **Email verification** (6-digit code)
- **Forgot / reset password** via email

### Customer
- Browse, search and filter cars by brand
- Car details, favorites, and reviews
- Booking with transparent **price breakdown** (base price + 10% service commission + 18% VAT)
- **Date-availability conflict check** (a car can't be double-booked)
- **Stripe payments** with in-app card entry (test mode) + **saved cards**
- **Cancellation & refund** (full refund if cancelled ≥ 48h before pickup)
- **PDF invoice** generation
- **Real-time-style chat** with the car owner (messages persist; owner auto-messages on booking)
- **Notifications** for bookings, messages and status changes — both in-app and as **local device notifications**

### Owner (QENT Partner)
- Become a partner and list a vehicle

### Admin
- Dashboard with statistics & revenue
- Manage cars, bookings (status changes) and users
- Approve / revoke driver licenses, activate / deactivate / delete users

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Mobile** | React Native, Expo SDK 54, React Navigation, Axios, Expo SecureStore, `@stripe/stripe-react-native`, `expo-notifications` |
| **Backend** | Node.js, Express, MySQL (`mysql2`), JWT (`jsonwebtoken`), `bcryptjs`, Stripe, `pdfkit`, `nodemailer` |
| **Testing** | Jest (unit tests) |
| **Architecture** | MVVM (Model–View–ViewModel) |
| **Tools** | VS Code, Git + GitHub |

---

## 📁 Project Structure

```
MobileApp/
├── car-rental-backend/         # Node.js + Express + MySQL (MVVM)
│   ├── src/
│   │   ├── config/             # app & database configuration
│   │   ├── models/             # data layer (Model)
│   │   ├── viewmodels/         # business logic (ViewModel)
│   │   ├── routes/             # Express routes
│   │   ├── middleware/         # auth middleware
│   │   ├── utils/              # mailer, pricing helpers
│   │   └── server.js
│   └── __tests__/              # Jest tests
│
└── car-rental-mobile/          # React Native + Expo
    └── src/
        ├── screens/            # UI (View)
        ├── viewmodels/         # hooks / business logic (ViewModel)
        ├── services/           # API layer
        ├── navigation/         # React Navigation
        ├── components/         # reusable components
        └── utils/              # notifications, helpers
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- MySQL
- Android Studio (for the dev build) / a physical device
- A Stripe test account

### 1. Backend

```bash
cd car-rental-backend
npm install
```

Create a MySQL database named `car_rental_app`, then run the schema and seed scripts:

```bash
npm run db:migrate
npm run db:seed
# plus the extra SQL files:
#   refresh_tokens.sql, email_codes.sql, seed_cars.sql
```

Create a `.env` file in `car-rental-backend/`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=car_rental_app

JWT_SECRET=your_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret

STRIPE_SECRET_KEY=sk_test_xxx

# Email (optional — for forgot password / verification)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> **Email:** use a Gmail **App Password** (requires 2-Step Verification), not your normal password. If `EMAIL_USER`/`EMAIL_PASS` are not set, codes are printed to the backend console instead.

Start the server:

```bash
npm run dev
```

### 2. Mobile App

```bash
cd car-rental-mobile
npm install
```

Add your Stripe **publishable** key in `App.js` (`StripeProvider`).

Because the app uses native modules (Stripe, notifications), run a **development build** (not Expo Go):

```bash
npx expo run:android
```

The API base URL is derived automatically from your machine's LAN IP via Expo.

---

## 🧪 Testing

Unit tests cover the core business logic (price breakdown, refund eligibility, date-availability conflict):

```bash
cd car-rental-backend
npm test
```

---

## 🔑 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@test.com` | `admin123` |

(Register a normal account to test the customer flow.)

---

## 📡 Main API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` · `/login` | Sign up / sign in |
| POST | `/api/auth/refresh` · `/logout` | Token refresh / logout |
| POST | `/api/auth/forgot-password` · `/reset-password` | Password reset |
| POST | `/api/auth/send-verification` · `/verify-email` | Email verification |
| GET/POST | `/api/cars` | List / create cars |
| GET/POST | `/api/bookings` | List / create bookings |
| POST | `/api/payments/intent` · `/intent/confirm` | Stripe payment |
| GET | `/api/payments/invoice/:id` | PDF invoice |
| GET/POST/DELETE | `/api/payments/methods` | Saved cards |
| GET/POST | `/api/chat/conversations` | Chat |
| GET | `/api/notifications` | Notifications |

---

## 💳 Stripe Test Cards

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined |
| `4000 0025 0000 3155` | 3D Secure |

Use any future expiry date and any CVC.

---

## 🏗 Architecture (MVVM)

- **Model** — database models (`models/`) and API services (`services/`)
- **ViewModel** — business logic in backend `viewmodels/` and React hooks `viewmodels/`
- **View** — React Native screens (`screens/`)

This separation keeps UI, logic and data access independent and testable.

---

## 📄 License

Academic project — developed for the Mobile Development course.