export default function FilterSelector({ filterType, setFilterType, startDate, setStartDate, endDate, setEndDate }) {
    return (
        <section className="filter-section">
            <div className="filter-title">בחר טווח זמן להצגה וניתוח נקודות קיצון:</div>
            <div className="filter-controls">
                <div className="preset-buttons">
                    <button
                        className={`filter-btn ${filterType === 'day' ? 'active' : ''}`}
                        onClick={() => setFilterType('day')}
                    >24 שעות</button>
                    <button
                        className={`filter-btn ${filterType === 'week' ? 'active' : ''}`}
                        onClick={() => setFilterType('week')}
                    >שבוע אחרון</button>
                    <button
                        className={`filter-btn ${filterType === 'month' ? 'active' : ''}`}
                        onClick={() => setFilterType('month')}
                    >חודש אחרון</button>
                    <button
                        className={`filter-btn ${filterType === 'custom' ? 'active' : ''}`}
                        onClick={() => setFilterType('custom')}
                    >מותאם אישית 📅</button>
                </div>

                {/* הצגת תיבות בחירת התאריך רק אם נבחר "מותאם אישית" */}
                {filterType === 'custom' && (
                    <div className="custom-range">
                        <label>מאת:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <label>עד:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}