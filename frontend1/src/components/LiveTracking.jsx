import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

const center = {
    lat: -3.745,
    lng: -38.523
};

// Ye helper component map ko recenter karega jab position update ho
const RecenterMap = ({ position }) => {
    const map = useMap()
    useEffect(() => {
        map.setView(position, map.getZoom())
    }, [ position ])
    return null
}

const LiveTracking = () => {
    const [ currentPosition, setCurrentPosition ] = useState(center);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude
            });
        });

        const watchId = navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                lat: latitude,
                lng: longitude
            });
        });

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    useEffect(() => {
        const updatePosition = () => {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                console.log('Position updated:', latitude, longitude);
                setCurrentPosition({
                    lat: latitude,
                    lng: longitude
                });
            });
        };

        updatePosition();
        const intervalId = setInterval(updatePosition, 1000);

        return () => clearInterval(intervalId); // cleanup (video ke code mein ye missing tha)
    }, []);

    return (
        <MapContainer
            center={[ currentPosition.lat, currentPosition.lng ]}
            zoom={15}
            style={{ width: '100%', height: '100%' }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[ currentPosition.lat, currentPosition.lng ]}>
                <Popup>You are here</Popup>
            </Marker>
            <RecenterMap position={[ currentPosition.lat, currentPosition.lng ]} />
        </MapContainer>
    )
}

export default LiveTracking