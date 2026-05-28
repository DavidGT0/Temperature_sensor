require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.MONGO_URI) {
    console.error('FATAL: MONGO_URI is not defined. Exiting.');
    process.exit(1);
}
if (!process.env.SECRET_API_KEY) {
    console.error('FATAL: SECRET_API_KEY is not defined. Exiting.');
    process.exit(1);
}

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [];

app.use(helmet());
app.use(cors({
    origin: ALLOWED_ORIGINS.length > 0 ? ALLOWED_ORIGINS : false,
    methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '10kb' }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas! 🎉'))
    .catch((err) => {
        console.error('MongoDB connection error: ❌', err);
        process.exit(1);
    });

const sensorReadingSchema = new mongoose.Schema({
    temperature: { type: Number, required: true, min: -100, max: 150 },
    humidity:    { type: Number, required: true, min: 0, max: 100 },
    timestamp:   { type: Date, default: Date.now }
});

const Reading = mongoose.model('Reading', sensorReadingSchema);

const sanitizeInput = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    const clean = {};
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const safeKey = key.replace(/[$<>]/g, '');
            const val = obj[key];
            clean[safeKey] = typeof val === 'string'
                ? val.replace(/[$<>"'`]/g, '')
                : val;
        }
    }
    return clean;
};

app.post('/update-sensor', async (req, res) => {
    try {
        const clientApiKey = req.header('X-API-KEY');
        if (!clientApiKey || clientApiKey !== process.env.SECRET_API_KEY) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const cleanBody = sanitizeInput(req.body);
        const temperature = parseFloat(cleanBody.temperature);
        const humidity    = parseFloat(cleanBody.humidity);

        if (isNaN(temperature) || isNaN(humidity)) {
            return res.status(400).json({ error: "Invalid sensor values" });
        }

        const newReading = new Reading({ temperature, humidity });
        await newReading.save();
        res.status(201).json({ message: "Data saved successfully!" });

    } catch (error) {
        console.error("Save error:", error);
        res.status(500).json({ error: "Failed to save data" });
    }
});

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