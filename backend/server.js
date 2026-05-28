require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet'); // <-- חדש: הגנת כותרות HTTP
const mongoSanitize = require('express-mongo-sanitize'); // <-- חדש: מניעת NoSQL Injection
const xss = require('xss-clean'); // <-- חדש: הגנת XSS בקלט משתמש

const app = express();
const port = process.env.PORT || 3000;

// השחלת שכבות האבטחה (Middlewares) - רצות על כל בקשה שנכנסת לשרת
app.use(helmet()); // מקשיח את ה-Headers של השרת
app.use(xss()); // מנקה תגיות HTML/JS זדוניות שנשלחות בטקסט
app.use(cors());
app.use(express.json());

// 1. חיבור ל-MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas! 🎉'))
    .catch((err) => console.error('MongoDB connection error: ❌', err));

// 2. הגדרת ה-Schema והמודל
const sensorReadingSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    timestamp: { type: Date, default: Date.now }
});

const Reading = mongoose.model('Reading', sensorReadingSchema);

const mongoSanitize = require('express-mongo-sanitize'); // השאר את הייבוא למעלה

app.post('/update-sensor', async (req, res) => {
    try {
        const clientApiKey = req.header('X-API-KEY');
        const SERVER_SECRET_KEY = process.env.SECRET_API_KEY || "MySuperSecretKey123";

        if (!clientApiKey || clientApiKey !== SERVER_SECRET_KEY) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // --- הנה הניקוי הנכון ---
        // מנקה רק את ה-body של הבקשה הנוכחית
        const cleanBody = mongoSanitize.sanitize(req.body);
        const { temperature, humidity } = cleanBody;

        const newReading = new Reading({
            temperature: temperature,
            humidity: humidity
        });

        await newReading.save();
        res.status(201).json({ message: "Data saved successfully!" });

    } catch (error) {
        res.status(500).json({ error: "Failed to save data" });
    }
});

//  ה-Endpoint לשליפת הנתונים בשביל הריאקט (נשאר פתוח כדי שהאתר יוכל לקרוא בחופשיות)
app.get('/sensor-history', async (req, res) => {
    try {
        const history = await Reading.find()
            .sort({ timestamp: -1 })
            .limit(20);

        res.json(history.reverse());
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: "Failed to fetch sensor history" });
    }
});

app.listen(port, () => {
    console.log(`=================================`);
    console.log(` Secure Sensor API Gateway ACTIVE`);
    console.log(` Listening on port: ${port}`);
    console.log(`=================================`);
});