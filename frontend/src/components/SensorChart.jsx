import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SensorChart({ data }) {

    // חישוב רוחב דינמי: כל דגימה צריכה קצת מרווח כדי שלא יידחסו.
    // אם יש מעט דגימות - הוא יהיה 100% (יתפוס את כל המסך). 
    // אם יש מאות דגימות - הוא יתרחב בהתאם וייצור גלילה.
    const dynamicWidth = data.length > 30 ? data.length * 40 : '100%';

    return (
        <div className="chart-section">
            <h2>מגמה בשעות האחרונות 📊</h2>

            {/* דיב מעטפת עם הגדרת גלילה אופקית (overflowX) */}
            <div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden', direction: 'ltr' }}>

                {/* דיב פנימי שמקבל את הרוחב הדינמי */}
                <div style={{ width: dynamicWidth, height: 350, minWidth: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                            <Line type="monotone" dataKey="temperature" stroke="#ff4757" strokeWidth={3} dot={{ r: 4 }} name="טמפרטורה (°C)" />
                            <Line type="monotone" dataKey="humidity" stroke="#2ed573" strokeWidth={3} dot={{ r: 4 }} name="לחות (%)" />
                            <CartesianGrid stroke="#333a4d" strokeDasharray="5 5" />
                            <XAxis dataKey="time" stroke="#a0aec0" />

                            {/* הוספתי domain כדי שהגרף יתאים את עצמו יפה לגובה הנתונים */}
                            <YAxis stroke="#a0aec0" domain={['dataMin - 2', 'dataMax + 2']} />

                            <Tooltip contentStyle={{ backgroundColor: '#1a202c', borderColor: '#4a5568', color: '#fff' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}