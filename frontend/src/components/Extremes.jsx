export default function Extremes({ data, filterType }) {
    if (!data || data.length === 0) return null;

    const maxTemp = Math.max(...data.map(d => d.temperature));
    const minTemp = Math.min(...data.map(d => d.temperature));
    const maxHum = Math.max(...data.map(d => d.humidity));
    const minHum = Math.min(...data.map(d => d.humidity));

    const getPeriodText = () => {
        switch (filterType) {
            case 'day': return 'ב-24 השעות האחרונות';
            case 'week': return 'בשבוע האחרון';
            case 'month': return 'בחודש האחרון';
            case 'custom': return 'בטווח המותאם אישית';
            default: return '';
        }
    };

    return (
        <section className="extremes-section">
            <h3 style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--primary)' }}>
                נקודות קיצון שנמדדו ({getPeriodText()})
            </h3>
            <div className="extremes-grid-2x2">
                {/* שורה 1: מקסימום */}
                <div className="card card-temp-hot">
                    <h4>טמפרטורה מקסימלית</h4>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f87171' }}>{maxTemp}°C</p>
                </div>
                <div className="card card-hum-wet">
                    <h4>לחות מקסימלית</h4>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#38bdf8' }}>{maxHum}%</p>
                </div>

                {/* שורה 2: מינימום */}
                <div className="card card-temp-cold">
                    <h4>טמפרטורה מינימלית</h4>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2dd4bf' }}>{minTemp}°C</p>
                </div>
                <div className="card card-hum-dry">
                    <h4>לחות מינימלית</h4>
                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#a78bfa' }}>{minHum}%</p>
                </div>
            </div>
        </section>
    );
}