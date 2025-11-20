import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

// This component handles finding and marking the current location
function LocationMarker({ onLocationFound }) {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    // This event fires when the map finds the user's location
    locationfound(e) {
      setPosition(e.latlng);
      onLocationFound(e.latlng);
      map.flyTo(e.latlng, 13);
    },
  });

 
  useEffect(() => {
    map.locate();
  }, [map]);


  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

const api_key=import.meta.env.VITE_MAP_API_KEY


export function HomeMap() {
  const defaultCenter = [20.5937, 78.9629]; 
  const [userLocation, setUserLocation] = useState(null);

  const tilesUrl = api_key
    ? `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${api_key}`
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const attribution = api_key
    ? '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
    : '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>';

  return (
    <MapContainer
      center={userLocation || defaultCenter}
      zoom={userLocation ? 13 : 5}
      scrollWheelZoom={true}
      dragging={true}
      touchZoom={true}
      style={{ height: "100%", width: "100%" }}
      doubleClickZoom={true}
    >
     <TileLayer
  url={tilesUrl}
  attribution={attribution}
/>
      <LocationMarker onLocationFound={setUserLocation} />
    </MapContainer>
  );
}
