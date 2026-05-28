export default function StatusCards({ latest }) {
    return (
        <section className="status-cards-container">
            <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>מצב נוכחי</h2>
            <div className="status-cards">
                <div className="card card-temp-hot">
                    <h3>טמפרטורה</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f87171' }}>
                        {latest.temperature}°C
                    </p>
                </div>
                <div className="card card-hum-wet">
                    <h3>לחות</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#38bdf8' }}>
                        {latest.humidity}%
                    </p>
                </div>
            </div>
        </section>
    );
}