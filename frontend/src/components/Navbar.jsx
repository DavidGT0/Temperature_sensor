export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">📟 IoT Monitor</div>
                <ul className="navbar-links">
                    <li><a href="#status">מצב נוכחי</a></li>
                    <li><a href="#filters">סינון נתונים</a></li>
                    <li><a href="#chart">גרף מגמות</a></li>
                    <li><a href="#extremes">נקודות קיצון</a></li>
                </ul>
            </div>
        </nav>
    );
}