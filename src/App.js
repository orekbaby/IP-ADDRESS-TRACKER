import  { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Markerposition from "./Markerposition"
import arrow from "./images/icon-arrow.svg";
import background from "./images/pattern-bg-desktop.png";

function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState(""); // Add ipAddress state
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;
  useEffect(() => {
    const getInitialData = async () => {
      try {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=at_yPgnoOFHF1Gr5dP6E8hmphTWlK6N6&ipAddress=8.8.8.8`
          // 192.212.174.101
        );
        const data = await res.json();
        setAddress(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    getInitialData();
  }, []);
  async function getEnteredAddress() {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_yPgnoOFHF1Gr5dP6E8hmphTWlK6N6&ipAddress=8.8.8.8 &${
        checkIpAddress.test(ipAddress)
          ? `ipAddress=${ipAddress}`
          : checkDomain.test(ipAddress)
          ? `domain=${ipAddress}`
          : ""
      }`
      // 192.212.174.101
    );
    const data = await res.json();
    setAddress(data);
  }
  function handleSubmit(e) {
    e.preventDefault();
    getEnteredAddress();
    setIpAddress("")
  }
  return (
    <>
      <section>
        <div className="absolute">
          <img src={background} alt="" className="bgsize" />
        </div>
        <article>
          <h1 className="text">IP Address Tracker</h1>
          <form onSubmit={handleSubmit} autocomplete="off" className="my-form">
            <input
              className="ip-input"
              type="text"
              name="ipaddress"
              id="ipaddress"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="search for any IP Address or domain"
              required
            />
            <button type="submit">
              <img src={arrow} alt="" className="arrow" />
            </button>
          </form>
        </article>
        <article className="bg-white">
          {address ? (
            <>
              <div className="h1-styles grid-item">
                <h2>IP ADDRESS</h2>
                <p>{address?.ip}</p>
              </div>
              <div className="griditem">
                <h2>LOCATION</h2>
                <p>
                  {address?.location.city}, {address?.location.region}{" "}
                </p>
              </div>
              <div className="grid-item"> 
                <h2>TIMEZONE</h2>
                <p>UTC {address?.location.timezone}</p>
              </div>
              <div className="grid-item">
                <h2>ISP</h2>
                <p>{address?.isp}</p>
              </div>
            </>
          ) : (
            <p>Loading data...</p>
          )}
        </article>
        {address && (
          <MapContainer
            center={[address.location.lat, address.location.lng]}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "500px", width: "100vw" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Markerposition address={address} />
          </MapContainer>
        )}
      </section>
    </>
  );
}

export default App;
