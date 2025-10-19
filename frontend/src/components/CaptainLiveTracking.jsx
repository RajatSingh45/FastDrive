import React, { useEffect, memo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import gpsIcon from "../images/gps.png";
import polyline from "@mapbox/polyline";

// Memoized Map Controller for robust map boundary fitting
const MapController = memo(({ currLocation, destination, route }) => {
    const map = useMap();

    useEffect(() => {
        const points = [];

        // 1. Add current live location (captain)
        if (currLocation && typeof currLocation.lat === 'number' && typeof currLocation.lng === 'number') {
            points.push(L.latLng(currLocation.lat, currLocation.lng));
            // Optional: Pan the map to follow the live location
            map.panTo(currLocation);
        }

        // 2. Add fixed destination point
        if (destination && typeof destination.lat === 'number' && typeof destination.lng === 'number') {
            points.push(L.latLng(destination.lat, destination.lng));
        }

        // 3. Include decoded route points for initial fit
        if (route && route.length > 0) {
            points.push(...route.map(p => L.latLng(p[0], p[1])));
        }

        // Fit bounds only if we have at least two points or if the route is defined
        if (points.length > 1) {
            try {
                const bounds = L.latLngBounds(points);
                map.fitBounds(bounds, { padding: [50, 50] });
            } catch (e) {
                console.error("Error setting map bounds with normalized data:", e);
            }
        } else if (points.length === 1) {
             map.setView(points[0], 15);
        }

    }, [map, currLocation, destination, route]);
    
    return null;
});

export default function CaptainLiveTracking(props) {
    const customIcon = new L.Icon({
        iconUrl: gpsIcon,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]
    });
    
    // Destructure props, including the new 'geometry' prop
    const { currLocation, destination, geometry } = props;

    // Decode the geometry string into an array of coordinates
    let decodedRoute = [];
    if (geometry) {
        try {
            decodedRoute = polyline.decode(geometry);
        } catch (error) {
            console.error("Error decoding route geometry:", error);
        }
    }
    
    const api_key = import.meta.env.VITE_MAP_API_KEY;

    return (
        <MapContainer
            center={currLocation || destination || [20.5937, 78.9629]}
            zoom={12}
            scrollWheelZoom={true}
            dragging={true}
            touchZoom={true}
            doubleClickZoom={true}
            style={{ height: "100%", width: "100%" }}
        >
            <TileLayer
                url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${api_key}`}
                attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <MapController 
                currLocation={currLocation}
                destination={destination}
                route={decodedRoute} // Pass the decoded route to the controller
            />

            {/* Marker for the Captain's Current Location */}
            {currLocation && (
                <Marker position={currLocation} icon={customIcon}>
                    <Popup>Your Current Location</Popup>
                </Marker>
            )}

            {/* Marker for Destination Location */}
            {destination && (
                <Marker position={destination} icon={customIcon}>
                    <Popup>Destination</Popup>
                </Marker>
            )}

            {/* Polyline for the full route geometry */}
            {decodedRoute.length > 0 && (
                <Polyline 
                    positions={decodedRoute} // Draw the detailed route here
                    color="#3B82F6" 
                    weight={5} 
                    opacity={0.7} 
                />
            )}
        </MapContainer>
    );
}