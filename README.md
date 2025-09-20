#  School Payments - Backend

This is the backend for the **School Payments System**.  
It handles **user login/registration, payment creation, and transaction history** using Node.js, Express, and MongoDB.

---

##  Tech Used
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Razorpay / Mock Payment Gateway



## How to Run (Step by Step)

1. Clone this repo  
   ```bash
   git clone https://github.com/<username>/schoolpayments-backend.git
   cd schoolpayments-backend

   
2.Install dependencies

npm install

3. Create a .env file in the root folder and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

4. Start the server

npm run dev


# API Endpoints
Auth

POST /api/auth/register → Register new user

POST /api/auth/login → Login & get token

Payments

POST /api/create-payment → Create a payment (user must be logged in)

Transactions

GET /api/transactions → Get logged-in user’s transactions

GET /api/transaction-status/:id → Check status of a transaction
