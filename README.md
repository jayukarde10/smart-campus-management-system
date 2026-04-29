# 🎓 Smart Campus Management System

The **Smart Campus Management System** is a comprehensive, full-stack web application designed to digitize and streamline the administrative, academic, and communication workflows of a modern educational institution. 

This platform replaces fragmented manual processes with a centralized digital hub, offering dedicated, role-based dashboards for **Administrators**, **Faculty**, and **Students**. 

---

## ✨ Key Features

### 🛡️ Role-Based Access Control (RBAC)
- **Administrator Panel:** Oversee the entire campus. Approve newly registered faculty accounts, manage all users, manage student fee statuses, and oversee global system settings.
- **Faculty Panel:** Manage core academic responsibilities. View and edit student profiles, upload and share daily Timetables, manage Marks/Results, track Attendance, and broadcast Notices (with PDF attachments).
- **Student Panel:** A personalized hub to view academic progress. Students can check their Marks, view Attendance reports, download Timetables, track personal tasks, and interact with Faculty events.

### 🔔 Dynamic Notifications & Real-Time Alerts
- A universal notification system visually alerts students and faculty (via red indicator badges) across all pages whenever a new Notice, Event, Marks Report, or Attendance PDF is uploaded.

### 📊 Advanced Analytics & Dashboards
- Interactive visual graphs (built with Recharts) to track student performance, attendance trends, and department analytics.

### 📁 Document & Media Sharing
- Support for uploading Profile Avatars and attaching PDF documents (like Defaulter Lists or Marks Reports) to notices, allowing seamless academic file sharing.

---

## 🛠️ Technology Stack

This project is built on the modern **MERN Stack**:

### Frontend
* **React.js (v19):** For building the dynamic, single-page application user interface.
* **React Router DOM:** For seamless, client-side routing between dashboards.
* **Bootstrap & CSS:** For responsive, mobile-friendly layouts and premium glassmorphic UI designs.
* **Lucide React:** For sleek, modern SVG iconography.
* **Recharts:** For rendering data visualization and analytics graphs.
* **Axios:** For handling HTTP requests to the backend API.
* **JWT-Decode:** For parsing secure tokens on the client side.

### Backend
* **Node.js & Express.js:** For the robust, scalable server architecture and RESTful API endpoints.
* **MongoDB & Mongoose:** NoSQL database for flexible data modeling of Users, Notices, Events, Marks, and Timetables.
* **JSON Web Tokens (JWT):** For stateless, highly secure user authentication and session management.
* **Bcrypt.js:** For cryptographic hashing of user passwords before database storage.
* **Multer:** For handling `multipart/form-data`, enabling seamless image and PDF file uploads to the server.
* **Cors & Dotenv:** For cross-origin resource sharing and secure environment variable management.

---

## 🚀 Deployment

The system is fully configured for cloud deployment:
* **Frontend Hosting:** [Vercel](https://vercel.com/) (Continuous Integration via GitHub)
* **Backend Hosting:** [Render](https://render.com/) (Web Service)
* **Database Hosting:** MongoDB Atlas (Cloud Cluster)

*(Note: File uploads on the free Render tier are ephemeral and reset upon server sleep. For persistent storage in production, integrating an S3 bucket or Cloudinary is recommended.)*

---

## 💻 Local Development Setup

To run this project on your local machine:

**1. Clone the repository:**
```bash
git clone https://github.com/jayukarde10/smart-campus-management-system.git
cd smart-campus-management-system
```

**2. Setup Backend:**
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://smart-campus-management-system-eosin.vercel.app
```
Run the backend:
```bash
node server.js
```

**3. Setup Frontend:**
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com
```
Run the frontend:
```bash
npm start
```

My app is now live at: [https://smart-campus-management-system-eosin.vercel.app](https://smart-campus-management-system-eosin.vercel.app)
