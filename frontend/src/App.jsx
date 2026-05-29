import {useState, useEffect} from 'react';
import Navbar from './components/Navbar';
import StatusCards from './components/StatusCards';
import FilterSelector from './components/FilterSelector';
import SensorChart from './components/SensorChart';
import Extremes from './components/Extremes';
import './App.css';

const RENDER_SERVER_URL = "https://temperature-sensor-rjj5.onrender.com";

function App() {
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('day');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // משיכת נתונים מחדש בכל פעם שהפילטר משתנה
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true); // מראה טעינה במעבר בין תצוגות
                let url = `${RENDER_SERVER_URL}/sensor-history`;

                // בניית ה-URL עם הפרמטרים שהשרת שלנו מצפה לקבל עכשיו
                if (filterType === 'week') {
                    url += '?range=7d';
                } else if (filterType === 'month') {
                    url += '?range=30d';
                } else if (filterType === 'custom' && startDate && endDate) {
                    // מוסיף שעות מדויקות להתחלה וסוף היום
                    url += `?start=${startDate}T00:00:00Z&end=${endDate}T23:59:59Z`;
                }

                const res = await fetch(url);
                const data = await res.json();
                setRawData(data);
                setLoading(false);
            } catch (err) {
                console.error("Error:", err);
                setLoading(false);
            }
        };

        fetchHistory();
        const interval = setInterval(fetchHistory, 300000);
        return () => clearInterval(interval);

        // עכשיו ה-useEffect רץ מחדש ברגע שאחד מהמשתנים האלה משתנה!
    }, [filterType, startDate, endDate]);

    if (loading && rawData.length === 0) return <div className="loading">מתחבר לשרת ושולף נתונים... ☁️</div>;

    // השרת כבר סינן את התאריכים! כל מה שנשאר לריאקט לעשות זה לעצב את הטקסט של השעה
    const formattedData = rawData.map(item => {
        const d = new Date(item.timestamp);
        const time = d.toLocaleTimeString('he-IL', {hour: '2-digit', minute: '2-digit'});
        return {
            ...item,
            time: filterType === 'day' ? time : `${d.toLocaleDateString('he-IL', {
                month: '2-digit',
                day: '2-digit'
            })} ${time}`
        };
    });

    const latestReading = rawData[rawData.length - 1] || {temperature: '--', humidity: '--'};

    return (
        <>
            <Navbar/>
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <h1>לוח בקרה חכם - IoT Temperature</h1>
                </header>

                <div id="status"><StatusCards latest={latestReading}/></div>

                <div id="filters">
                    <FilterSelector
                        filterType={filterType} setFilterType={setFilterType}
                        startDate={startDate} setStartDate={setStartDate}
                        endDate={endDate} setEndDate={setEndDate}
                    />
                </div>

                {/* שים לב שהעברנו את formattedData במקום filteredData (שנמחק) */}
                <div id="chart"><SensorChart data={formattedData}/></div>
                <div id="extremes"><Extremes data={formattedData} filterType={filterType}/></div>
            </div>
        </>
    );
}

export default App;