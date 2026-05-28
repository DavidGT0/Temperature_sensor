import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SensorChart({ data }) {
    return (
        <div className="chart-section">
            <h2>מגמה בשעות האחרונות 📊</h2>
            <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                    <LineChart data={data} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="temperature" stroke="#ff4757" strokeWidth={3} dot={{ r: 4 }} name="טמפרטורה (°C)" />
                        <Line type="monotone" dataKey="humidity" stroke="#2ed573" strokeWidth={3} dot={{ r: 4 }} name="לחות (%)" />
                        <CartesianGrid stroke="#333a4d" strokeDasharray="5 5" />
                        <XAxis dataKey="time" stroke="#a0aec0" />
                        <YAxis stroke="#a0aec0" />
                        <Tooltip contentStyle={{ backgroundColor: '#1a202c', borderColor: '#4a5568', color: '#fff' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}