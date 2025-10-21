// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import StatsPage from "./pages/StatsPage";
import HelpPage from "./pages/HelpPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./styles.css"; // 👈 import styles

function App() {
  return (
    <Router>
      <header className="link-div">
        <Link to="/" className="font-bold hover:text-green-600">Home</Link>
        <Link to="/play" className="hover:text-green-600">Play</Link>
        <Link to="/stats" className="hover:text-green-600">Stats</Link>
        <Link to="/help" className="hover:text-green-600">Help</Link>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/play" element={<GamePage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
