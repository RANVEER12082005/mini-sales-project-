# 🛒 Sales Manager — Shop & Coupon Management System

<div align="center">

![Sales Manager](https://img.shields.io/badge/Sales%20Manager-Shop%20Management-1e3a5f?style=for-the-badge&logo=shopify&logoColor=white)

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](LICENSE)

**A full-stack sales management web application to manage shops, track orders, generate scratch coupons, and monitor payments — accessible from anywhere in the world**

[Overview](#-project-overview) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Structure](#-project-structure) • [Setup](#️-installation--setup) • [API Docs](#-api-endpoints) • [Deployment](#-deployment)

</div>

---

## 📖 Project Overview

**Sales Manager** is a full-stack web application built for sales teams to manage their shop network efficiently. It allows sales representatives to maintain a complete database of shops across India, record orders, auto-generate scratch coupons as loyalty rewards, and track coupon payments — all from a single dashboard accessible on any device.

### 🎯 How It Works

```
Sales Rep adds Shop → Records Orders → System Auto-generates Coupons
                                              ↓
                              Shop Owner Scratches Coupon
                                              ↓
                         Prize Revealed (₹50 - ₹500 random)
                                              ↓
                         Sales Rep marks payment as Paid ✅
```

### 🔑 Key Idea — Scratch Coupon Reward System

Every ₹5000 worth of orders from a shop earns that shop **1 scratch coupon**. The coupon reveals a **random prize between ₹50 and ₹500** only when physically scratched on screen — keeping it a genuine surprise for the shop owner!

---

## ✨ Features

### 🏪 Shop Management
- Add shops with complete details — name, telephone, owner info, address
- State and city dropdowns with **all Indian states and 30+ cities per state**
- Search shops by name, city, owner, or beat number
- Edit shop details anytime
- Delete shops
- Phone number validation — numbers only, no alphabets allowed

### 📦 Order Management
- Add orders for any shop with amount and optional note
- View complete order history per shop with dates and totals
- Auto-calculates how many coupons a shop has earned based on total orders
- Every ₹5000 in orders = 1 new scratch coupon generated automatically

### 🎟️ Scratch Coupon System
- **Interactive scratch card** — shop owner physically scratches on screen using mouse or finger
- Prize amount hidden until 50%+ of the card is scratched
- Random prize between **₹50 and ₹500** (true random, not fixed values)
- Prize revealed with animation after scratching
- Earned amount updates **instantly** in stats without page reload
- Mark coupons as paid after distributing prize money
- Track total earned, total paid, and pending payment per shop

### 📊 Dashboard
- Overview of all shops at a glance
- Total shops, total coupons, total earned, total paid, pending payments
- Shop rankings by number of coupons earned
- Real-time stats

### 📈 Reports
- Filter shops by state and city
- View aggregated stats for any region
- Detailed table with all shop financials

### 🔐 Authentication
- Secure login and registration system
- JWT-based authentication
- Each user sees only their own shops
- Multiple sales reps can use the same app independently
- Passwords hashed with bcrypt

### 📱 Mobile Friendly
- Fully responsive design
- Works on phones and tablets
- Touch-friendly scratch card
- Collapsible mobile navbar

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18 | UI framework |
| Vite | 5.0 | Build tool and dev server |
| React Router DOM | 6 | Client-side routing |
| Tailwind CSS | 3.4 | Utility-first styling |
| Bootstrap | 5.3 | UI components |
| Axios | 1.x | HTTP requests to backend |
| Canvas API | Native | Interactive scratch card |

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| Express | 4.18 | Web framework and REST API |
| Mongoose | 7.x | MongoDB ODM |
| JSON Web Token | 9.x | Authentication tokens |
| bcryptjs | 2.x | Password hashing |
| CORS | 2.x | Cross-origin resource sharing |
| dotenv | 16.x | Environment variable management |
| nodemon | 3.x | Development auto-reload |

### Database & Deployment

| Service | Purpose |
|---------|---------|
| MongoDB Atlas | Cloud database (free tier) |
| Render | Backend hosting (free tier) |
| Vercel | Frontend hosting (free tier) |
| GitHub | Version control and CI/CD |

---

## 📁 Project Structure

```
sales-app/
│
├── README.md
├── .gitignore
│
├── backend/                          # Node.js + Express API
│   ├── server.js                     # Entry point — Express app, routes, CORS
│   ├── .env                          # Secrets (not in git)
│   ├── config/
│   │   └── db.js                     # MongoDB Atlas connection
│   ├── middleware/
│   │   └── auth.js                   # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                   # User schema — auth, hashed password
│   │   ├── Shop.js                   # Shop schema — details, stats, userId
│   │   ├── Order.js                  # Order schema — shopId, amount, note
│   │   └── Coupon.js                 # Coupon schema — amount, scratched, redeemed
│   ├── controllers/
│   │   ├── authController.js         # Register, login, getMe
│   │   ├── shopController.js         # CRUD operations for shops
│   │   ├── orderController.js        # Create orders, auto-generate coupons
│   │   └── couponController.js       # Scratch coupon, redeem coupon
│   └── routes/
│       ├── authRoutes.js             # POST /register, POST /login
│       ├── shopRoutes.js             # GET/POST/PUT/DELETE /shops
│       ├── orderRoutes.js            # GET/POST /orders
│       └── couponRoutes.js           # GET /coupons, PUT /scratch, PUT /redeem
│
└── frontend/                         # React + Vite app
    ├── index.html                    # HTML entry point
    ├── vite.config.js                # Vite configuration
    ├── tailwind.config.js            # Tailwind CSS configuration
    ├── postcss.config.js             # PostCSS configuration
    └── src/
        ├── main.jsx                  # React entry point, Bootstrap import
        ├── App.jsx                   # Router, auth state, protected routes
        ├── index.css                 # Global styles, Tailwind directives
        ├── context/
        │   └── AppContext.jsx        # Global state, all API calls
        ├── utils/
        │   └── helpers.js            # API URL, currency formatter, states/cities data
        ├── components/
        │   ├── Navbar.jsx            # Sticky navbar with mobile menu
        │   ├── AddShopModal.jsx      # Add/edit shop form with state-city dropdowns
        │   ├── AddOrderModal.jsx     # Add order form, shows generated coupons
        │   ├── CouponModal.jsx       # Scratch card UI, stats, redeem button
        │   └── ShopCard.jsx          # Individual shop card component
        └── pages/
            ├── Login.jsx             # Login and register page
            ├── Dashboard.jsx         # Stats overview and shop rankings
            ├── Shops.jsx             # Shop list with search and actions
            ├── Orders.jsx            # Order management and history
            ├── Coupons.jsx           # Coupon overview per shop
            └── Reports.jsx           # Filter and report by state/city
```

---

## ⚙️ Installation & Setup

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Bundled with Node.js |
| Git | Latest | [git-scm.com](https://git-scm.com) |
| MongoDB Atlas account | Free | [mongodb.com](https://mongodb.com) |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/RANVEER12082005/mini-sales-project-.git
cd mini-sales-project-
```

---

### Step 2 — Set Up Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/salesapp?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=8000
```

Start the backend:

```bash
npm run dev
```

You should see:
```
Server running on http://localhost:8000
MongoDB Connected!
```

---

### Step 3 — Set Up Frontend

```bash
cd ../frontend
npm install
```

Update `src/utils/helpers.js`:

```js
export const API_URL = 'http://127.0.0.1:8000/api';
```

Start the frontend:

```bash
npm run dev
```

Open in browser:
```
http://localhost:5173
```

---

### Step 4 — MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **M0** cluster
3. Create a database user with username and password
4. Go to **Network Access** → Add IP → **Allow Access From Anywhere** (`0.0.0.0/0`)
5. Click **Connect** → **Drivers** → copy connection string
6. Paste into `backend/.env` as `MONGO_URI`

---

## 🌐 Deployment

### Backend — Render

1. Go to [render.com](https://render.com) → sign up with GitHub
2. New → Web Service → connect `mini-sales-project-` repo
3. Settings:

```
Root Directory:  backend
Build Command:   npm install
Start Command:   node server.js
```

4. Add environment variables:

| Key | Value |
|-----|-------|
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Your secret key |
| `PORT` | `8000` |

5. Deploy — get URL like `https://sales-backend-xxxx.onrender.com`

---

### Frontend — Vercel

1. Update `src/utils/helpers.js`:
```js
export const API_URL = 'https://sales-backend-xxxx.onrender.com/api';
```

2. Push to GitHub:
```bash
git add .
git commit -m "update API URL"
git push
```

3. Go to [vercel.com](https://vercel.com) → sign up with GitHub
4. Import `mini-sales-project-` repo
5. Settings:

```
Framework:        Vite
Root Directory:   frontend
Build Command:    npm run build
Output Directory: dist
```

6. Deploy — get URL like `https://mini-sales-project.vercel.app`

---

## 🔌 API Endpoints

### Auth Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create new account | ❌ |
| POST | `/api/auth/login` | Login and get token | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

---

### Shop Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/shops` | Get all shops for logged-in user | ✅ |
| GET | `/api/shops/:id` | Get single shop | ✅ |
| POST | `/api/shops` | Create new shop | ✅ |
| PUT | `/api/shops/:id` | Update shop | ✅ |
| DELETE | `/api/shops/:id` | Delete shop | ✅ |

**Create Shop Request Body:**
```json
{
  "shopName": "Sharma General Store",
  "telephone": "0141234567",
  "ownerName": "Ramesh Sharma",
  "ownerPhone": "9876543210",
  "state": "Rajasthan",
  "city": "Jaipur",
  "town": "Malviya Nagar",
  "beatNo": "12",
  "address": "Shop No. 5, Main Market",
  "location": "Near Bus Stand"
}
```

---

### Order Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/orders/shop/:shopId` | Get all orders for a shop | ✅ |
| POST | `/api/orders` | Create order (auto-generates coupons) | ✅ |

**Create Order Request Body:**
```json
{
  "shopId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "amount": 10000,
  "note": "Monthly restock"
}
```

**Response (with coupon generation):**
```json
{
  "success": true,
  "data": { "shopId": "...", "amount": 10000 },
  "newCoupons": [
    { "_id": "...", "amount": 347, "isScratched": false },
    { "_id": "...", "amount": 189, "isScratched": false }
  ],
  "message": "2 coupon(s) generated!"
}
```

---

### Coupon Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/coupons/shop/:shopId` | Get all coupons for a shop | ✅ |
| PUT | `/api/coupons/scratch/:id` | Scratch a coupon — reveals prize | ✅ |
| PUT | `/api/coupons/redeem/:id` | Mark coupon as paid | ✅ |

> **Note:** Unscratched coupon amounts are hidden in GET response — `amount: null` until scratched. This ensures the prize is a genuine surprise!

---

## 🎟️ Coupon System Logic

```
Total Orders Amount for Shop
          ↓
Math.floor(totalAmount / 5000) = Coupons Earned
          ↓
New Coupons = Coupons Earned - Already Existing Coupons
          ↓
For each new coupon:
  amount = Math.floor(Math.random() * 451) + 50
  (random number between ₹50 and ₹500)
          ↓
Amount hidden until shop owner scratches card
          ↓
On scratch: amount revealed, shop.totalEarned updated
          ↓
On redeem: shop.totalPaid updated
```

---

## 🔐 Authentication Flow

```
Register → Password hashed with bcrypt → Saved to MongoDB
Login → Password compared → JWT token generated (30 day expiry)
All protected routes → Bearer token in Authorization header
Each shop linked to userId → Users only see their own shops
```

---

## 🐛 Common Issues & Solutions

**MongoDB connection timeout**
```
Operation users.findOne() buffering timed out after 10000ms
```
Go to MongoDB Atlas → Network Access → Add `0.0.0.0/0` to allow all IPs.

---

**Port already in use**
```bash
lsof -ti:8000 | xargs kill -9
```

---

**Tailwind not working**
```bash
npm uninstall tailwindcss
npm install -D tailwindcss@3.4.1 postcss autoprefixer
npx tailwindcss init -p
```

---

**Frontend can't reach backend on phone**
- Make sure phone and laptop are on same WiFi
- Run frontend with `npm run dev -- --host`
- Use laptop's local IP (e.g. `192.168.1.5`) not `127.0.0.1`

---

**JWT not authorized error**
- Check token is being sent in `Authorization: Bearer <token>` header
- Token may have expired — log out and log back in

---

## 🔮 Future Scope

- Export reports to PDF or Excel
- WhatsApp notification when coupon is generated
- GPS location tagging for each shop visit
- Sales target tracking per beat
- Offline mode with sync when back online
- Admin dashboard to manage multiple sales reps
- Coupon QR code scanning
- Monthly/weekly sales analytics with charts
- Push notifications for pending payments
- React Native mobile app

---

## 📁 Key Files Reference

| File | Purpose |
|------|---------|
| `backend/server.js` | Express app entry point |
| `backend/.env` | API keys and secrets (not in git) |
| `backend/models/Shop.js` | Shop data schema |
| `backend/models/Coupon.js` | Coupon data schema |
| `backend/controllers/orderController.js` | Coupon generation logic |
| `backend/controllers/couponController.js` | Scratch and redeem logic |
| `frontend/src/context/AppContext.jsx` | Global state and all API calls |
| `frontend/src/utils/helpers.js` | API URL and India states/cities data |
| `frontend/src/components/CouponModal.jsx` | Interactive scratch card component |
| `frontend/src/pages/Login.jsx` | Authentication page |

---

## 👨‍💻 Author

**Ranveer Singh**
B.Tech Computer Science Engineering

---

## 🙏 Acknowledgements

| Library / Service | Purpose |
|-------------------|---------|
| [React](https://reactjs.org) | Frontend UI framework |
| [Express.js](https://expressjs.com) | Backend web framework |
| [MongoDB Atlas](https://mongodb.com) | Cloud database |
| [Mongoose](https://mongoosejs.com) | MongoDB object modeling |
| [JSON Web Token](https://jwt.io) | Secure authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first CSS framework |
| [Bootstrap](https://getbootstrap.com) | UI components |
| [Axios](https://axios-http.com) | HTTP client |
| [Render](https://render.com) | Backend cloud hosting |
| [Vercel](https://vercel.com) | Frontend cloud hosting |

---

<div align="center">

**⭐ If this project helped you, please give it a star on GitHub! ⭐**

> Built for real-world sales management — track shops, orders, and coupon rewards all in one place.

Made with ❤️ by Ranveer Singh

</div>
