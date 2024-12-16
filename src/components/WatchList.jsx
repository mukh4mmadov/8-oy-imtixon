import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function WatchList() {
  const [viewedCoinData, setViewedCoinData] = useState(null);

  useEffect(() => {
    const viewedCoins = JSON.parse(localStorage.getItem("viewedCoins"));
    if (viewedCoins) {
      const ids = Object.keys(viewedCoins);
      ids.forEach((id) => {
        axios
          .get(`https://api.coingecko.com/api/v3/coins/${id}`)
          .then((response) => {
            setViewedCoinData((prevData) => ({
              ...prevData,
              [id]: response.data,
            }));
          })
          .catch((error) => console.error(error));
      });
    }
  }, []);

  const handleRemove = (id) => {
    const updatedCoins = { ...viewedCoinData };
    delete updatedCoins[id];
    setViewedCoinData(updatedCoins);

    const storedCoins = JSON.parse(localStorage.getItem("viewedCoins"));
    if (storedCoins) {
      delete storedCoins[id];
      localStorage.setItem("viewedCoins", JSON.stringify(storedCoins));
    }
  };

  return (
    <div>
      {viewedCoinData && Object.keys(viewedCoinData).length > 0 ? (
        <div className="crypto-grid">
          {Object.keys(viewedCoinData).map((id) => {
            const coin = viewedCoinData[id];
            return (
              <div className="crypto-sw" key={id}>
                <img
                  src={coin.image.large}
                  alt={coin.name}
                  width={118}
                  height={118}
                />
                <p>${coin.market_data.current_price.usd.toLocaleString()}</p>
                <button
                  className="remove-button"
                  onClick={() => handleRemove(id)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Watchlist bo‘sh.</p>
      )}
    </div>
  );
}

export default WatchList;
