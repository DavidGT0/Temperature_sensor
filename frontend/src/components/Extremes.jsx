
export default function Extremes({ data }) {
    if (!data || data.length === 0) return null;

    // חישוב ערכי קיצון מתוך המערך הקיים
    const temps = data.map(d => d.temperature);
    const humidities = data.map(d => d.humidity);

    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const maxHum = Math.max(...humidities);
    const minHum = Math.min(...humidities);

    return (
        <div className="extremes-section">
            <h2>נקודות קיצון שנמדדו (תקופה אחרונה) 📉</h2>
            <div className="extremes-grid">
                <div className="extreme-box">
                    <h4>טמפרטורה</h4>
                    <p>🔺 מקסימום: <span className="high">{maxTemp}°C</span></p>
                    <p>🔻 מינימום: <span className="low">{minTemp}°C</span></p>
                </div>
                <div className="extreme-box">
                    <h4>לחות</h4>
                    <p>🔺 מקסימום: <span className="high">{maxHum}%</span></p>
                    <p>🔻 מינימום: <span className="low">{minHum}%</span></p>
                </div>
            </div>
        </div>
    );
}