import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/Details.css";

function CoinDetailsPage({ selectedCurrency }) {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "USD":
        return "$";
      case "INR":
        return "₹";
      case "EUR":
        return "€";
      default:
        return "";
    }
  };
  const getPriceInCurrency = (currency) => {
    switch (currency) {
      case "USD":
        return data.market_data.current_price.usd.toLocaleString();
      case "INR":
        return data.market_data.current_price.inr.toLocaleString();
      case "EUR":
        return data.market_data.current_price.eur.toLocaleString();
      default:
        return "";
    }
  };
  const marketCap = (currency) => {
    switch (currency) {
      case "USD":
        return data.market_data.market_cap.usd.toLocaleString();
      case "INR":
        return data.market_data.market_cap.inr.toLocaleString();
      case "EUR":
        return data.market_data.market_cap.eur.toLocaleString();
      default:
        return "";
    }
  };

  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/coins/${id}`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="coin-details__container">
      <div className="coin-details__info">
        <div className="coin-details__image">
          <img
            src={data.image.large}
            alt="rasm karoce"
            width={200}
            height={200}
          />
        </div>
        <h1 className="coin-details__title">{data.name}</h1>
        <p className="coin-details__description">
          {data.description.en.split(".")[0]}
        </p>
        <p className="coin-details__item">
          <strong>Rank:</strong> <span>{data.market_cap_rank}</span>
        </p>
        <p className="coin-details__item">
          <strong>Current Price:</strong>
          <span>
            {getCurrencySymbol(selectedCurrency)}
            {getPriceInCurrency(selectedCurrency)}
          </span>
        </p>
        <p className="coin-details__item">
          <strong>Market Cap:</strong>
          <span>
            {getCurrencySymbol(selectedCurrency)}
            {marketCap(selectedCurrency)}
          </span>
        </p>
      </div>

      <div className="coin-details__chart"></div>
    </div>
  );
}

export default CoinDetailsPage;
