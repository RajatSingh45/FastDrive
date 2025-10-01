
import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import polyline from "@mapbox/polyline";
import gpsIcon from "../images/gps.png";

const MapController = ({liveLocation,pickup, drop, route }) => {
    const map = useMap()

    useEffect(() => {
        if(liveLocation){
            map.setView(liveLocation,15)
        }
       else if (route && route.length > 0) {
            const bounds = L.latLngBounds(route);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (pickup && drop) {
            const bounds = L.latLngBounds([pickup, drop]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, liveLocation, pickup, drop, route]);
    return null;
};

export default function LiveTracking(props) {
    const customIcon = new L.Icon({
        iconUrl: gpsIcon,
        iconSize: [38, 38],
        iconAnchor: [19,38],
        popupAnchor: [0, -38]
    });

    //const hasValidCoords = props.currLocation && props.dropCoords;

    // Correctly decode the geometry string into an array of coordinates
    let decodedRoute = [];
    if (props.geometry) {
        // console.log(props.geometry)
        try {
            decodedRoute = polyline.decode(props.geometry);
        } catch (error) {
            console.error("Error decoding route geometry:", error);
        }
    }
    
    const liveLocation=props.currLocation
    const pickup = props.pickupCoords
    const drop = props.dropCoords

    // console.log("pickupCoords in livetracking:",pickup)
    // console.log("dropCoords in livetracking:",drop)

    const api_key=import.meta.env.VITE_MAP_API_KEY

    return (
        <MapContainer
            center={pickup || [20.5937, 78.9629]}
            zoom={8}
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
                <>
                    <MapController 
                        liveLocation={liveLocation}
                        pickup={pickup} 
                        drop={drop} 
                        route={decodedRoute} 
                    />

                    {liveLocation && (
                        <Marker position={liveLocation} icon={customIcon}>
                            <Popup>You are here</Popup>
                        </Marker>
                    )}

                    {drop && (
                    <Marker position={drop} icon={customIcon}>
                        <Popup>Destination</Popup>
                    </Marker>
                    )}

                    {decodedRoute.length > 0 && (
                        <Polyline 
                            positions={decodedRoute} 
                            color="#3B82F6" 
                            weight={5} 
                            opacity={0.7} 
                        />
                    )}
                </>
        </MapContainer>
    );
}