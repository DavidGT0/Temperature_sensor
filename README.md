IoT Climate Monitoring System 🌡️🌐
A secure, end-to-end IoT solution that monitors environmental conditions in real-time. The system collects temperature and humidity data from a physical sensor and visualizes it through a responsive, secure web dashboard.

🚀 Key Features
Full-Stack Architecture: Built with a custom Node.js/Express backend and a modern React frontend.

IoT Connectivity: Real-time data transmission from an ESP32 microcontroller using HTTPS requests.

Security-First Design: Implemented multi-layered security measures:

API Authentication: Secure key-based protection for all incoming data updates.

NoSQL Injection Prevention: Custom sanitation logic to sanitize input and prevent database manipulation.

XSS & Header Protection: Integration of helmet and xss-clean for robust HTTP security.

Input Validation: Strict Schema validation (Mongoose) ensuring only valid data ranges are recorded.

DoS Protection: Rate limiting and payload size limits to ensure service stability.

Data Persistence: Integrated with MongoDB Atlas for scalable, cloud-based data storage.

Cloud Deployment: Fully deployed and managed on Render (Backend) and Vercel (Frontend).

🛠️ Tech Stack
Hardware: ESP32 Microcontroller, DHT/Sensor module.

Backend: Node.js, Express, Mongoose (MongoDB).

Frontend: React, Responsive CSS.

Security: Helmet.js, CORS, Custom Input Sanitation.

DevOps: GitHub, Render, Vercel.
