# 📦 Inventory & Order Management System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

A full-stack, containerized web application built to streamline business operations by managing products, stock levels, customers, and orders in one modern, animated dashboard. 

---

## 🔗 Live Links
- **Frontend Live Demo:** [Vercel Deployment](https://inventory-order-management-system-bay.vercel.app/)
- **Backend Live API:** [Render Deployment](https://inventory-order-management-backend-h1hs.onrender.com/docs)
- **Docker Hub Image:** [Order Management Backend](https://hub.docker.com/repository/docker/payalporwal/order-management-backend)

---

## ✨ Features
* **Modern Dashboard**: Real-time overview of total products, customers, orders, and low-stock alerts.
* **Product Management**: Add, update, view, and delete products with automatic SKU tracking.
* **Inventory Control**: Dedicated inventory view to quickly edit stock levels and flag low-stock items.
* **Customer Management**: Maintain a directory of customer information.
* **Order Processing**: Create new orders by linking customers to products, automatically deducting inventory stock.
* **Fully Containerized**: Ready to run anywhere using Docker and Docker Compose.

---

## 🛠️ Technology Stack
### Frontend
* **Framework:** React (Vite)
* **Styling:** Custom Vanilla CSS (Dark Mode, Glassmorphism)
* **Routing:** React Router DOM
* **Alerts:** SweetAlert2
* **Icons:** Lucide React

### Backend
* **Framework:** Python / FastAPI
* **Database ORM:** SQLAlchemy
* **Database Engine:** PostgreSQL

### Infrastructure
* **Containerization:** Docker & Docker Compose
* **Hosting:** Vercel (Frontend), Render (Backend & DB)

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have [Docker](https://www.docker.com/products/docker-desktop) and **Docker Compose** installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/payal2529/Inventory-Order-Management-System.git
   cd Inventory-Order-Management-System
   ```

2. **Run the Application using Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the Services**
   - **Frontend UI:** `http://localhost`
   - **Backend API (Swagger Docs):** `http://localhost:8000/docs`

---

## 📂 Project Structure

```text
├── backend/
│   ├── app/                 # FastAPI application code
│   │   ├── main.py          # Entry point & Routes
│   │   ├── models.py        # SQLAlchemy Database Models
│   │   ├── schemas.py       # Pydantic validation schemas
│   │   └── crud.py          # Database operations
│   ├── Dockerfile           # Backend container instructions
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/                 # React application code
│   │   ├── components/      # UI components (Dashboard, Products, etc.)
│   │   ├── services/        # Axios API configurations
│   │   └── index.css        # Global design system
│   ├── index.html           # HTML template
│   └── Dockerfile           # Frontend container instructions
├── docker-compose.yml       # Multi-container orchestration
└── render.yaml              # Render deployment configuration
```

---

*Designed and developed as a comprehensive full-stack solution.*
