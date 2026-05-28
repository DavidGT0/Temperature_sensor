import { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${RENDER_SERVER_URL}/sensor-history`);
        setRawData(await res.json());
        setLoading(false);
      } catch (err) { console.error("Error:", err); }
    };
    fetchHistory();
    const interval = setInterval(fetchHistory, 300000); // רענון חסכוני כל 5 דקות
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading">מתחבר לשרת ושולף נתונים... ☁️</div>;

  // פילטור ועיבוד הנתונים דינמית בזמן הרינדור (Deriving State)
  const cutoffDate = new Date();
  if (filterType === 'day') cutoffDate.setHours(cutoffDate.getHours() - 24);
  else if (filterType === 'week') cutoffDate.setDate(cutoffDate.getDate() - 7);
  else if (filterType === 'month') cutoffDate.setDate(cutoffDate.getDate() - 30);

  const filteredData = rawData
      .filter(item => {
        const itemDate = new Date(item.timestamp);
        if (filterType === 'custom') {
          if (!startDate) return true;
          const start = new Date(startDate).setHours(0,0,0,0);
          const end = endDate ? new Date(endDate).setHours(23,59,59,999) : new Date();
          return itemDate >= start && itemDate <= end;
        }
        return itemDate >= cutoffDate;
      })
      .map(item => {
        const d = new Date(item.timestamp);
        const time = d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
        return { ...item, time: filterType === 'day' ? time : `${d.toLocaleDateString('he-IL', { month: '2-digit', day: '2-digit' })} ${time}` };
      });

  const latestReading = rawData[rawData.length - 1] || { temperature: '--', humidity: '--' };

  return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>לוח בקרה חכם - IoT Temperature</h1>
        </header>

        <StatusCards latest={latestReading} />
        <FilterSelector
            filterType={filterType} setFilterType={setFilterType}
            startDate={startDate} setStartDate={setStartDate}
            endDate={endDate} setEndDate={setEndDate}
        />
        <SensorChart data={filteredData} />
        <Extremes data={filteredData} />
      </div>
  );
}

export default App;