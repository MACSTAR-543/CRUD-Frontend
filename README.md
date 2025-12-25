# 📦 StockSync Pro - Inventory Management System

<div align="center">

![StockSync Pro](https://img.shields.io/badge/StockSync-Pro-4a6cf7?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![API](https://img.shields.io/badge/RESTful_API-FF6B6B?style=for-the-badge)
![Responsive](https://img.shields.io/badge/Responsive-Yes-4a7c59?style=for-the-badge)

A modern, intuitive inventory management system with real-time tracking and comprehensive CRUD operations for products, suppliers, and orders.

[Live Demo](#-live-demo) • [Features](#-features) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Screenshots](#-application-screens)

</div>

## 🌐 Live Demo

### **🔗 Live Frontend:** [https://crud-frontend-miya-delta.vercel.app/](https://crud-frontend-miya-delta.vercel.app/)
### **🔧 Live Backend API:** [https://crud-api-4-cncd.onrender.com](https://crud-api-4-cncd.onrender.com)

---
## ✨ Features

### 📊 **Dashboard**
- Real-time inventory statistics
- Visual cards for key metrics
- Quick action shortcuts
- Auto-refresh capabilities

### 📦 **Products Management**
- Complete CRUD operations
- Stock level indicators (In Stock, Low Stock, Out of Stock)
- Category organization
- Real-time search and filtering
- SKU-based inventory tracking

### 🤝 **Suppliers Management**
- Vendor database management
- Contact information storage
- Supplier performance tracking
- Easy supplier search

### 📋 **Orders Management**
- Purchase order creation
- Multi-item order processing
- Status tracking (Pending, Processing, Completed, Cancelled)
- Automatic total calculation
- Supplier-product integration

### 🎨 **UI/UX Features**
- Light/Dark theme toggle
- Collapsible sidebar
- Responsive design (mobile, tablet, desktop)
- Accessibility compliant (WCAG 2.1)
- Toast notifications
- Modal confirmations
- Form validation
- Loading states

---
## 🚀 Installation & Setup

### **Option 1: Use Live Deployment**
Simply visit: [https://crud-frontend-miya-delta.vercel.app/](https://crud-frontend-miya-delta.vercel.app/)

### **Option 2: Local Development**
```bash

# Clone the repository
git clone https://github.com/macstar-543/stocksync-pro.git

# Navigate to project directory
cd stocksync-pro

# Open the application
# You can use any of these methods:
# 1. Open index.html directly in browser
# 2. Use Live Server extension in VS Code
# 3. Use Python simple HTTP server:
python -m http.server 8000

```
-----
# 🔗 API Endpoints Used

## 📦 Products Endpointtrieve all products

+ POST /products - Create new product

+ PUT /products/:id - Update existing product
  
+ DELETE /products/:id - Delete product

## 🤝 Suppliers Endpoints
+ GET /suppliers - Retrieve all suppliers
  
+ POST /suppliers - Create new supplier
  
+ PUT /suppliers/:id - Update existing supplier
  
+ DELETE /suppliers/:id - Delete supplier

## 📋 Orders Endpoints
+ GET /orders - Retrieve all orders
+ POST /orders - Create new order
+ PUT /orders/:id - Update existing order
+ DELETE /orders/:id - Delete order


 ## Frontend Structure:
### HTML (index.html) - Main application structure with:
+ Responsive sidebar navigation
+ Four main sections: Dashboard, Products, Suppliers, Orders
+ Forms for CRUD operations
+ Data tables with search/filter functionality
+ Modal dialogs and toast notifications

### CSS (styles.css) - Comprehensive styling with:
+ Light/dark theme support using CSS variables
+ Responsive design for all screen sizes
+ Modern UI components with animations
+ Accessibility features

### JavaScript (script.js) - Full application logic:
+ State management
+ API communication
+ Form handling and validation
+ Event management
+ Data filtering and search

  ## 📱 Features Utilizing Backend API
1.Real-time Inventory Tracking - Live product stock updates

+ Supplier Management - Full vendor lifecycle

+ Order Processing - Complete purchase order workflow

+ Dashboard Analytics - Real-time statistics from API data

+ Search & Filter - Server-side data manipulation



# 🖼️ Screenshots of Code Using Deployed Backend
### Screenshot 1: API Base Configuration
simg nfigu=ation
 img wi=th=" 161= height="71" alt="Screenshot 2 25-=2-05 001030" src="https://github.com/user-attachments/assets/0477d86e-463a-4816-8 ae
This confirms the frontend is configured to use the deployed backend on Render.com

### Screenshot 2: 
#img eensh=t 2: 
 img wi=th="1 62"=height="283" alt="Screenshot 2 25-=2-05 003630" src="https://github.com/user-attachments/assets/1f7087e0-1204-482e-a 54

### Screenshot 3:
#img reens=ot 3:
 img wi=th="1 13"=height="280" alt="Screenshot 2 25-=2-05 004508" src="https://github.com/user-attachments/assets/7b182307-309a-43d2-b 74

### Screenshot 4:
#img reens=ot 4:
 img wi=th="1 36"=height="455" alt="Screenshot 2 25-=2-05 004639" src="https://github.com/user-attachments/assets/ef59c4da-3f34-4f76-8 14

### Screenshot 5:
#img reens=ot 5:
 img wi=th="1 80"=height="290" alt="Screenshot 2 25-=2-05 004740" src="https://github.com/user-attachments/assets/140403d3-b841-4ff1-8 a2

### Screenshot 6:
<img width="1055" height="261" alt="Screenshot 2025-12-05 004825" src="https://github.com/user-attachments/assets/bd0ba30f-a0d0-446c-84b9-1105a11c96ca" />

### Screenshot 7:
<img width="502" height="476" alt="Screenshot 2025-12-05 005351" src="https://github.com/user-attachments/assets/e042b170-41a9-479d-9721-501f35e82e8e" />

### Screenshot 8:
<img width="1166" height="215" alt="Screenshot 2025-12-05 005752" src="https://github.com/user-attachments/assets/a9c80897-7cf6-4609-9541-a9e9087ea025" />

## 🌐 Deployment Information
Frontend: Static hosting (GitHub Pages and vercel)
+ Backend: Deployed on Render.com (https://crud-api-4-cncd.onrender.com)

+ Database: MongoDB Atlas (via backend)

+ API Type: RESTful JSON API

  

## 🙏 Acknowledgments

+ Font Awesome for icons

+ Google Fonts for Inter font

+ Render for backend hosting

+ Vercel for frontend hosting



## 📞 Support
For support or questions:

📧 Email: cabanzamia@gmail.com

🐛 Report Issues

💬 Create Discussion

<div align="center">
Made with ❤️ by Mia A. Cabanza

⬆ Back to Top

</div> ```
