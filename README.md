# 🚗 RSA (Roadside Assistance) Platform

A full-stack, real-time Roadside Assistance web application built with the **MERN Stack** (MongoDB, Express.js, React, Node.js). This platform connects stranded drivers with nearby mechanics in real-time, offering services like towing, jump-starts, flat-tire fixes, and fuel delivery.

**🚀 Live Demo:** [https://rsa-frontend-git-main-namanwagadres-projects.vercel.app](https://rsa-frontend-git-main-namanwagadres-projects.vercel.app)
**⚙️ Backend API:** [https://rsa-backend-ze8f.onrender.com](https://rsa-backend-ze8f.onrender.com)

---

## ✨ Key Features

### 🛡️ Role-Based Access Control (RBAC)
Secure authentication flow that directs users to entirely separate dashboard experiences based on their registered role (`Customer` or `Mechanic`).

### 🚘 For Customers (Drivers)
* **Garage Management:** Add and manage multiple vehicle details (Make, Model, Year, License Plate).
* **One-Click SOS:** Request emergency assistance instantly using the browser's Geolocation API (HTML5) to fetch exact coordinates.
* **Dynamic Pricing:** View estimated service costs upfront based on the selected emergency (e.g., Towing, Flat Tire, Breakdown).
* **Live Status Tracking:** Track request status in real-time (Pending ➡️ Accepted ➡️ Completed).
* **Service History:** View a complete log of past emergency requests and services.

### 🛠️ For Mechanics
* **Real-time Job Board:** View a live feed of new/pending emergency requests in their area.
* **Instant Acceptance:** Accept SOS requests with a single click.
* **Smart Navigation:** Direct integration with **Google Maps** using the stranded driver's live GPS coordinates for quick navigation.
* **Workflow Management:** Mark jobs as completed to become available for new requests.

---

## 💻 Tech Stack

**Frontend:**
* React.js (Functional Components, Hooks)
* React Router DOM (Navigation & Protected Routes)
* Pure CSS (Responsive & Modern UI)
* Deployed on: **Vercel**

**Backend:**
* Node.js & Express.js (RESTful API architecture)
* MongoDB Atlas (Cloud Database)
* Mongoose (ODM & Schema Validation)
* JSON Web Tokens (JWT) for secure Authentication
* Deployed on: **Render**

---

## 🚀 Local Installation & Setup

Want to run this project locally? Follow these steps:

**1. Clone the repository**
```bash
git clone https://github.com/Namanwagadre/rsa-frontend.git
