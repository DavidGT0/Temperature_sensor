
export default function StatusCards({ latest }) {
    return (
        <div className="cards-grid">
            <div className="card temp-card">
                <div className="card-icon">🌡️</div>
                <h3>טמפרטורה נוכחית</h3>
                <div className="value">{latest.temperature}°C</div>
            </div>
            <div className="card humidity-card">
                <div className="card-icon">💧</div>
                <h3>לחות נוכחית</h3>
                <div className="value">{latest.humidity}%</div>
            </div>
        </div>
    );
}