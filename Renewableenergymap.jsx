import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { db, ref, get } from "./firebase";
import { useEffect, useState } from "react";

export default function RenewableEnergyMap() {
  const [energyData, setEnergyData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const snapshot = await get(ref(db, "renewable_energy"));
      const data = snapshot.val();
      if (data) {
        const arr = Object.entries(data).map(([country, info]) => ({
          country,
          ...info,
        }));
        setEnergyData(arr);
      }
    }
    fetchData();
  }, []);

  const getColor = (total) =>
    total > 250 ? "darkblue" : total > 150 ? "green" : "orange";

  return (
    <div className="w-full h-screen">
      <h2 style={{ textAlign: "center", marginTop: 10 }}>
        🌎 Renewable Energy Map – SDG 7
      </h2>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
        />
        {energyData.map((d, i) => {
          const total = d.solar + d.wind;
          return (
            <CircleMarker
              key={i}
              center={[d.latitude, d.longitude]}
              radius={8 + total / 30}
              color={getColor(total)}
              fillOpacity={0.7}
            >
              <Popup>
                <b>{d.country}</b><br />
                ☀️ Solar Capacity: {d.solar} GW<br />
                🌬️ Wind Capacity: {d.wind} GW
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
