import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "../css/Home.css";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/minimal.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoEyeSharp } from "react-icons/io5";


function Home({ selectedCurrency }) {
  const [cryptoData, setCryptoData] = useState([]);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [viewedCoins, setViewedCoins] = useState(() => {
    const storedViewedCoins = localStorage.getItem("viewedCoins");
    return storedViewedCoins ? JSON.parse(storedViewedCoins) : {};
  });
  const navigate = useNavigate();

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

  useEffect(() => {
    let pageParams = Number(params.get("page")) || 1;
    setPage(pageParams);
  }, [params]);

  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${selectedCurrency}&order=gecko_desc&per_page=10&page=${page}&sparkline=false&price_change_percentage=24h`
      )
      .then((response) => {
        setData(response.data);
        setParams({ page: page });
      })
      .catch((error) => console.error(error));
  }, [selectedCurrency, page, params]);

  useEffect(() => {
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${selectedCurrency}&order=gecko_desc&per_page=15&page=1&sparkline=false&price_change_percentage=24h`
      )
      .then((response) => {
        setCryptoData(response.data);
      })
      .catch((error) => console.error(error));
  }, [selectedCurrency]);

  const settings = {
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  function handleChange(e) {
    setPage(e);
  }

  const filteredData = data.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  function handleRedirect(id) {
    const updatedViewedCoins = { ...viewedCoins, [id]: true };
    setViewedCoins(updatedViewedCoins);
    localStorage.setItem("viewedCoins", JSON.stringify(updatedViewedCoins));
    navigate(`/crypto/${id}`);
  }

  return (
    <>
      <div className="header1">
        <div className="title-p">
          <h1 className="title text-black">CRYPTOFOLIO WATCH LIST</h1>
          <p className="paragraf">
            Get all the Info regarding your favorite Crypto Currency
          </p>
        </div>

        <div className="crypto-carousel">
          <Slider {...settings}>
            {cryptoData.map((crypto, index) => (
              <div
                onClick={() => {
                  handleRedirect(crypto.id);
                }}
                key={index}
                className="crypto-card"
              >
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="crypto-image"
                />
                <div className="container-crypto">
                  <h3 className="crypto-h3">{crypto.symbol.toUpperCase()}</h3>
                  <p
                    className="crypto-paragraf1"
                    style={{
                      color:
                        crypto.price_change_percentage_24h > 0
                          ? "green"
                          : "red",
                    }}
                  >
                    {crypto.price_change_percentage_24h > 0
                      ? `+${crypto.price_change_percentage_24h.toFixed(2)}%`
                      : `${crypto.price_change_percentage_24h.toFixed(2)}%`}
                  </p>
                </div>
                <p className="crypto-paragraf">
                  {getCurrencySymbol(selectedCurrency)}
                  {crypto.current_price.toLocaleString()}
                </p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <main className="main">
        <div className="main-div">
          <h1 className="main-title">Cryptocurrency Prices by Market Cap</h1>
          <form className="form">
            <input
              className="input"
              type="text"
              placeholder="Search For a Crypto Currency.."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </form>
          <div className="table-header">
            <div className="header-coin">Coin</div>
            <div className="header-right">
              <div className="header-item">Price</div>
              <div className="header-item">24h Change</div>
              <div className="header-item">Market Cap</div>
            </div>
          </div>
          <div className="coin-list">
            {filteredData.map((coin) => (
              <div
                className="coin-row"
                onClick={() => {
                  handleRedirect(coin.id);
                }}
                key={coin.id}
              >
                <div className="coin-info">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    width={50}
                    height={50}
                  />
                  <div className="sub-name">
                    <div className="coin-name">{coin.symbol.toUpperCase()}</div>
                    <div className="coin-subname">{coin.name}</div>
                  </div>
                </div>
                <div className="coin-data">
                  <div className="coin-price">
                    {getCurrencySymbol(selectedCurrency)}
                    {coin.current_price.toLocaleString()}
                  </div>
                  <div className="coin-change">
                    <p>
                      <IoEyeSharp
                        className="eyes"
                        style={{
                          color: viewedCoins[coin.id] ? "green" : "inherit",
                        }}
                      />
                    </p>
                    <p
                      className="price-change"
                      style={{
                        color:
                          coin.price_change_percentage_24h > 0
                            ? "green"
                            : "red",
                      }}
                    >
                      {coin.price_change_percentage_24h > 0
                        ? `+${coin.price_change_percentage_24h.toFixed(2)}%`
                        : `${coin.price_change_percentage_24h.toFixed(2)}%`}
                    </p>
                  </div>

                  <div className="coin-marketcap">
                    {getCurrencySymbol(selectedCurrency)}
                    {coin.market_cap.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
            <div className="pagination-wrapper">
              <ResponsivePagination
                current={page}
                total={total}
                onPageChange={handleChange}
                className="pagination"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
