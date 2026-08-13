"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapPickerProps {
  initialPosition?: [number, number] | null;
  onPositionChange: (lat: number, lng: number) => void;
}

function LocationMarker({ position, setPosition, onPositionChange }: any) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onPositionChange(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon}></Marker>
  );
}

export default function MapPicker({ initialPosition, onPositionChange }: MapPickerProps) {
  // Default to Praya, Lombok Tengah if no initial position
  const defaultPosition: [number, number] = [-8.7077, 116.2769];
  const [position, setPosition] = useState<L.LatLng | null>(
    initialPosition ? L.latLng(initialPosition[0], initialPosition[1]) : null
  );

  useEffect(() => {
    if (initialPosition) {
      setPosition(L.latLng(initialPosition[0], initialPosition[1]));
    } else {
      setPosition(null);
    }
  }, [initialPosition]);

  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden border border-border relative z-0">
      <MapContainer
        center={initialPosition || defaultPosition}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} onPositionChange={onPositionChange} />
      </MapContainer>
    </div>
  );
}
