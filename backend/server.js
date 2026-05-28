require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');

const app = express();
const port = process.env.PORT || 3000;

// Middleware מאובטחים (בלי mongoSanitize שגרם לשגיאה)
app.use(helmet());
app.use(xss());
app.use(cors());
app.use(express.json());

// 1. חיבור ל-MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas! 🎉'))
    .catch((err) => console.error('MongoDB connection error: ❌', err));

const sensorReadingSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    timestamp: { type: Date, default: Date.now }
});

const Reading = mongoose.model('Reading', sensorReadingSchema);

// פונקציית ניקוי פנימית ומאובטחת למניעת NoSQL Injection
const sanitizeInput = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    for (let key in obj) {
        if (typeof obj[key] === 'string' && obj[key].includes('$')) {
            obj[key] = obj[key].replace(/\$/g, '');
        }
    }
    return obj;
};

// 2. ה-Endpoint ל-POST
app.post('/update-sensor', async (req, res) => {
    try {
        const clientApiKey = req.header('X-API-KEY');
        const SERVER_SECRET_KEY = process.env.SECRET_API_KEY || "MySuperSecretKey123";

        if (!clientApiKey || clientApiKey !== SERVER_SECRET_KEY) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // ניקוי הקלט באופן ידני ומאובטח
        const cleanBody = sanitizeInput(req.body);

        const newReading = new Reading({
            temperature: parseFloat(cleanBody.temperature),
            humidity: parseFloat(cleanBody.humidity)
        });

        await newReading.save();
        res.status(201).json({ message: "Data saved successfully!" });

    } catch (error) {
        console.error("Save error:", error);
        res.status(500).json({ error: "Failed to save data" });
    }
});

// 3. ה-Endpoint לשליפת נתונים
app.get('/sensor-history', async (req, res) => {
    try {
        const history = await Reading.find()
            .sort({ timestamp: -1 })
            .limit(20);
        res.json(history.reverse());
    } catch (error) {
        console.error("Fetch error:", error);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

app.listen(port, () => {
    console.log(`=================================`);
    console.log(` Secure Sensor API Gateway ACTIVE`);
    console.log(` Listening on port: ${port}`);
    console.log(`=================================`);
});