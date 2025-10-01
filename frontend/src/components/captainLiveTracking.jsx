
import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import gpsIcon from "../images/gps.png";
import polyline from "@mapbox/polyline";

const MapController = ({ destination,currLocation}) => {
    const map = useMap();
    useEffect(() => {
      const points=[]

      console.log("destination:",destination)
      console.log("currLocation:",currLocation)

      if(destination&& typeof destination.lat==='number' && typeof destination.lng==='number'){
        points.push(L.latLng(destination.lat, destination.lng))
      }
     
      if(currLocation && typeof currLocation.lat==='number' && typeof currLocation.lng==='number'){
        points.push(L.latLng(currLocation.lat, currLocation.lng))
      }

    if(points.length>=2){
        try {         
            const bounds = L.latLngBounds(points);
            map.fitBounds(bounds, { padding: [50, 50] });
        } catch (error) {
            console.log("Error setting map counds with normalized data:",e)
        }
    }

    else if(points.length===1){
        map.setView(points[0],15)
    }
    }, [map, destination,currLocation]);
     return null;
};

export default function CaptainLiveTracking(props) {
    const customIcon = new L.Icon({
        iconUrl: gpsIcon,
        iconSize: [38, 38],
        iconAnchor: [17, 46],
        popupAnchor: [1, -46]
    });

    const destination = props.destination;  
    const currLocation = props.currLocation;
    const api_key=import.meta.env.VITE_MAP_API_KEY

    const captianToDestination=[]

    if(currLocation&&destination){
        captianToDestination.push(currLocation)
        captianToDestination.push(destination) 
    }
    return (
        <MapContainer
            center={currLocation || [20.5937, 78.9629]}
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

            {captianToDestination && (
                <>
                    <MapController 
                        destination={destination} 
                        currLocation={currLocation} 
                    />

                    {(destination&& <Marker position={destination} icon={customIcon}>
                        <Popup>destination Location</Popup>
                    </Marker>)}

                    {(currLocation&& <Marker position={currLocation} icon={customIcon}>
                        <Popup>current Location</Popup>
                    </Marker>)}
                    
                    {captianToDestination.length > 0 && (
                        <Polyline
                            positions={captianToDestination} 
                            color="#3B82F6" 
                            weight={5}
                            opacity={0.7} 
                        />
                    )}
                </>
            )}
        </MapContainer>
    );
}