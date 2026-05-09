# ExploreMyCountry – Travel & Tourism Platform 🌍

ExploreMyCountry is a full-stack travel and tourism platform built using Node.js, Express, MongoDB, and EJS. The platform allows users to discover, book, and review travel experiences, while agencies can manage travel packages and administrators can oversee the system through role-based dashboards.

## 🌟 Features

### User Features
- User authentication and profile management
- Browse and search trips by country, category, and price
- Book trips and attractions
- Leave reviews and ratings
- Secure payment integration

### Agency Features
- Create and manage travel packages
- Manage destinations and attractions
- Submit trips for admin approval
- Manage agency business profiles

### Admin Features
- User and role management
- Trip and content moderation
- Booking and platform oversight
- Analytics and activity monitoring

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- JWT Authentication
- Multer
- Bcrypt

### Frontend
- EJS
- Bootstrap
- JavaScript
- HTML
- CSS

### Development Tools
- Nodemon
- Morgan
- dotenv

---

## 📁 Project Structure

```text
travel-app/
├── controllers/
├── models/
├── routes/
├── views/
├── middleware/
├── public/
├── config/
├── app.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/linaaelkhateeb/Website.git
cd Website/travel-app
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure environment variables

Create a `.env` file in the root directory and add:

```env
API_URL=/api/v1
CONNECTION_STRING=your-mongodb-connection-string
SESSION_SECRET=your-secret-key
```

#### 4. Run the application

```bash
npm start
```

#### 5. Open in browser

```text
http://localhost:3000
```

---

## 🔐 Authentication & Authorization

The platform implements role-based access control with three user roles:

- **Client** – Browse trips, book experiences, and leave reviews
- **Agency** – Create and manage travel packages and destinations
- **Admin** – Full platform management and moderation access

Authentication includes:
- Password hashing with bcrypt
- Session-based authentication
- Protected routes and middleware authorization

---

## 🌐 Core Functionalities

### Trip Management
- Create and edit travel packages
- Search and filter trips
- View trip details and destinations

### Booking System
- Book travel experiences
- Manage reservations
- Payment workflow integration

### Reviews & Ratings
- User-generated attraction reviews
- Ratings for travel experiences

---

## 🔒 Security Features

- Password hashing using bcrypt
- Authentication middleware
- Role-based authorization
- File upload handling with multer
- Input validation and sanitization
- Environment variables secured using `.gitignore`

---

## 🚀 Deployment Notes

For production deployment:
- Configure environment variables securely
- Use a production MongoDB database
- Enable HTTPS and secure session storage
- Set `NODE_ENV=production`

---

## 👩‍💻 Team Project

Developed collaboratively as a full-stack travel and tourism platform project.

GitHub:
https://github.com/linaaelkhateeb
