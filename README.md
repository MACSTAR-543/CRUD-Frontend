# StockSync Pro - Frontend Documentation
## 📋 Overview
StockSync Pro is a modern inventory management system frontend that connects to a deployed RESTful API backend for performing full CRUD operations on products, suppliers, and orders.

## 🔗 API Endpoints Used
### 🔧 Live Backend API: https://crud-api-4-cncd.onrender.com/api
### 🌐 Live Frontend: https://macstar-543.github.io/CRUD-Frontend/

## Testing API Connection:
1. Open browser DevTools (F12)

2. Go to Network tab

3. Refresh the frontend page

4. See real API calls to:

* https://crud-api-4-cncd.onrender.com/api/products

* https://crud-api-4-cncd.onrender.com/api/suppliers

* https://crud-api-4-cncd.onrender.com/api/orders



## ✅ Products Endpoints
+ GET /products - Retrieve all products

+ POST /products - Create new product

+ PUT /products/:id - Update existing product
  
+DELETE /products/:id - Delete product

## Suppliers
+ GET /suppliers - Retrieve all suppliers
  
+ POST /suppliers - Create new supplier
  
+ PUT /suppliers/:id - Update existing supplier
  
+ DELETE /suppliers/:id - Delete supplier

# Orders
+ GET /orders - Retrieve all orders
+ POST /orders - Create new order

+ PUT /orders/:id - Update existing order

+ DELETE /orders/:id - Delete order

# 🖼️ Screenshots of Code Using Deployed Backend
### Screenshot 1: API Base Configuration
<img width="1161" height="71" alt="Screenshot 2025-12-05 001030" src="https://github.com/user-attachments/assets/0477d86e-463a-4816-84ae-257cf26670df" />
This confirms the frontend is configured to use the deployed backend on Render.com

Screenshot 2: 
<img width="1062" height="283" alt="Screenshot 2025-12-05 003630" src="https://github.com/user-attachments/assets/1f7087e0-1204-482e-ad54-f4ef9ad4cc23" />

Screenshot 3:
<img width="1113" height="280" alt="Screenshot 2025-12-05 004508" src="https://github.com/user-attachments/assets/7b182307-309a-43d2-b474-4a64b9c2e5d0" />

Screenshot 4:
<img width="1036" height="455" alt="Screenshot 2025-12-05 004639" src="https://github.com/user-attachments/assets/ef59c4da-3f34-4f76-8c14-20dbe96de63e" />

Screenshot 5:
<img width="1280" height="290" alt="Screenshot 2025-12-05 004740" src="https://github.com/user-attachments/assets/140403d3-b841-4ff1-87a2-26a460d2a0a9" />

Screenshot 6:
<img width="1055" height="261" alt="Screenshot 2025-12-05 004825" src="https://github.com/user-attachments/assets/bd0ba30f-a0d0-446c-84b9-1105a11c96ca" />

Screenshot 7:
<img width="502" height="476" alt="Screenshot 2025-12-05 005351" src="https://github.com/user-attachments/assets/e042b170-41a9-479d-9721-501f35e82e8e" />

Screenshot 8:
<img width="1166" height="215" alt="Screenshot 2025-12-05 005752" src="https://github.com/user-attachments/assets/a9c80897-7cf6-4609-9541-a9e9087ea025" />

## 🌐 Deployment Information
Frontend: Static hosting (GitHub Pages, Netlify, Vercel, etc.)
+ Backend: Deployed on Render.com (https://crud-api-4-cncd.onrender.com)

+ Database: MongoDB Atlas (via backend)

+ API Type: RESTful JSON API

## 📱 Features Utilizing Backend API
1.Real-time Inventory Tracking - Live product stock updates

+ Supplier Management - Full vendor lifecycle

+ Order Processing - Complete purchase order workflow

+ Dashboard Analytics - Real-time statistics from API data

+ Search & Filter - Server-side data manipulation

 ### ✅ Suppliers Endpoints
