import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Details from "./pages/Details";
import WatchList from "./components/WatchList";
import "./App.css";

function App() {
  const [currency, setCurrency] = useState("USD");
  const [isWatchListOpen, setIsWatchListOpen] = useState(false);
  const navigate = useNavigate();

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  function goHome() {
    navigate("/");
  }

  return (
    <div>
      <header className="header">
        <nav className="navbar">
          <h1 onClick={goHome} className="header-title">
            CRYPTOFOLIO
          </h1>
          <div className="watch">
            <select
              className="select"
              onChange={handleCurrencyChange}
              value={currency}
            >
              <option value="USD">USD</option>
              <option value="EUR">EURO</option>
              <option value="INR">INR</option>
            </select>
            <button
              className="watch-list"
              onClick={() => setIsWatchListOpen(true)}
            >
              WATCH LIST
            </button>
          </div>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home selectedCurrency={currency} />} />
        <Route
          path="/crypto/:id"
          element={<Details selectedCurrency={currency} />}
        />
      </Routes>

      {isWatchListOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsWatchListOpen(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => setIsWatchListOpen(false)}
            >
              X
            </button>
            <WatchList />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
