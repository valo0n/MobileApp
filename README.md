# Car Rental App

Full-stack car rental application using **MVVM architecture**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native (Expo) |
| Backend | Node.js + Express |
| Database | MySQL |
| Auth | JWT + bcrypt |
| Architecture | MVVM |

## Project Structure

```
car-rental-backend/                    car-rental-mobile/
├── src/                               ├── src/
│   ├── config/                        │   ├── components/
│   │   ├── app.js                     │   │   ├── common/
│   │   └── database.js        ←──────→│   │   ├── cars/
│   ├── models/          (Model)       │   │   └── bookings/
│   │   ├── Base.model.js             │   ├── screens/
│   │   ├── User.model.js             │   │   ├── auth/
│   │   ├── Car.model.js              │   │   ├── home/
│   │   ├── Booking.model.js          │   │   ├── cars/
│   │   └── index.js                  │   │   ├── bookings/
│   ├── viewmodels/      (ViewModel)  │   │   ├── chat/
│   │   ├── Auth.viewmodel.js         │   │   ├── profile/
│   │   ├── Car.viewmodel.js          │   │   └── notifications/
│   │   └── Booking.viewmodel.js      │   ├── viewmodels/      (ViewModel hooks)
│   ├── middleware/                    │   │   └── index.js
│   │   └── auth.middleware.js         │   ├── services/        (API calls)
│   ├── routes/          (View/API)   │   │   ├── api.js
│   │   ├── auth.routes.js            │   │   └── index.js
│   │   ├── user.routes.js            │   ├── navigation/
│   │   ├── car.routes.js             │   │   └── AppNavigator.js
│   │   ├── booking.routes.js         │   ├── utils/
│   │   └── ...                        │   └── constants/
│   ├── database/                      ├── assets/
│   │   ├── migrate.js                 ├── App.js
│   │   └── migrate.sql               └── package.json
│   └── server.js
├── .env.example
└── package.json
```

## Setup

### 1. Database (MySQL Workbench)

1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Open the file `car-rental-backend/src/database/migrate.sql`
4. Execute it (⚡ lightning bolt icon)
5. This creates: database, 31 tables, roles, permissions, and seed data

Or via terminal:
```bash
cd car-rental-backend
cp .env.example .env          # Edit with your MySQL credentials
npm install
npm run db:migrate
```

### 2. Backend

```bash
cd car-rental-backend
cp .env.example .env          # Edit DB_PASSWORD, JWT_SECRET
npm install
npm run dev                   # Starts on http://localhost:3000
```

### 3. Frontend

```bash
cd car-rental-mobile
npm install
npx expo start
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET  /api/auth/profile` — Get current user profile

### Cars
- `GET    /api/cars` — List cars (with filters)
- `GET    /api/cars/:id` — Car details
- `GET    /api/cars/categories` — Categories
- `GET    /api/cars/brands` — Brands
- `POST   /api/cars` — Create car (car_owner)
- `PUT    /api/cars/:id` — Update car (car_owner)
- `DELETE /api/cars/:id` — Delete car (car_owner)

### Bookings
- `GET  /api/bookings` — User's bookings
- `POST /api/bookings` — Create booking
- `PUT  /api/bookings/:id/cancel` — Cancel booking
- `PUT  /api/bookings/:id/status` — Update status (admin)

### Payments
- `GET  /api/payments/booking/:id` — Payments for booking
- `POST /api/payments` — Create payment

### Reviews
- `GET  /api/reviews/car/:id` — Reviews for car
- `POST /api/reviews` — Write review

### Chat
- `GET  /api/chat/conversations` — User's conversations
- `GET  /api/chat/conversations/:id/messages` — Messages
- `POST /api/chat/conversations/:id/messages` — Send message

### Notifications
- `GET /api/notifications` — User's notifications
- `PUT /api/notifications/read-all` — Mark all read

### Favorites
- `GET  /api/favorites` — User's favorites
- `POST /api/favorites/toggle` — Add/remove favorite

### Promotions
- `GET  /api/promotions` — Active promotions
- `POST /api/promotions/validate` — Validate code

## Roles

| Role | Access |
|------|--------|
| Customer | Browse, book, pay, review, chat, favorites |
| Car Owner | + Create/manage car listings |
| Admin | Full access to everything |

## MVVM Pattern

```
┌─────────────────────────────────────────────┐
│  VIEW (Screens / Routes)                    │
│  - React Native screens                     │
│  - Express route handlers                   │
├─────────────────────────────────────────────┤
│  VIEWMODEL (Business Logic)                 │
│  - Frontend: Custom React hooks             │
│  - Backend: ViewModel classes               │
├─────────────────────────────────────────────┤
│  MODEL (Data Layer)                         │
│  - Frontend: API service calls              │
│  - Backend: MySQL model classes             │
└─────────────────────────────────────────────┘
```
