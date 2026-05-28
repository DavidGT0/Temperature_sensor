require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json());

// 1. חיבור ל-MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas! 🎉'))
    .catch((err) => console.error('MongoDB connection error: ❌', err));

// 2. הגדרת ה-Schema (איך יראה מסמך של קריאת חיישן בבסיס הנתונים)
const sensorReadingSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    timestamp: { type: Date, default: Date.now } // שמירת הזמן הגולמי הבינלאומי (הכי מקצועי ל-DB)
});

// יצירת המודל מתוך הסכמה
const Reading = mongoose.model('Reading', sensorReadingSchema);

// 3. ה-Endpoint הקיים שמעודכן לשמור לתוך ה-DB
app.post('/update-sensor', async (req, res) => {
    try {
        const { temperature, humidity } = req.body;

        // יצירת מסמך חדש מנתוני החיישן
        const newReading = new Reading({
            temperature: temperature,
            humidity: humidity
        });

        // שמירה פיזית ב-Database בענן
        await newReading.save();

        // הדפסה מעוצבת ל-Logs של השרת
        console.log(`\n--- [New Reading Saved to DB] ---`);
        console.log(`Temp: ${temperature}°C | Humidity: ${humidity}%`);
        console.log(`Logged at: ${new Date().toLocaleTimeString('he-IL', { timeZone: 'Asia/Jerusalem', hour12: false })}`);

        // החזרת תשובת הצלחה לבקר ה-ESP32
        res.status(201).json({ message: "Data saved successfully!" });

    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ error: "Failed to save data to database" });
    }
});

// ה-Endpoint החדש ששולף נתונים מה-DB בשביל הריאקט
app.get('/sensor-history', async (req, res) => {
    try {
        // שולף את 20 הקריאות האחרונות, ומסדר אותן מהישן לחדש (כדי שהגרף יזרום משמאל לימין)
        const history = await Reading.find()
            .sort({ timestamp: -1 }) // קודם כל מביא את הכי חדשים
            .limit(20);              // מגביל ל-20 קריאות

        res.json(history.reverse()); // הופך את הסדר כדי שיוצג כרונולוגית בגרף
    } catch (error) {
        console.error("Error fetching history:", error);
        res.status(500).json({ error: "Failed to fetch sensor history" });
    }
});

app.listen(port, () => {
    console.log(`=================================`);
    console.log(` Sensor API Gateway is ACTIVE`);
    console.log(` Listening on port: ${port}`);
    console.log(`=================================`);
});