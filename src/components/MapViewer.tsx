"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Navigation, Loader2 } from "lucide-react";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Routing Component that dynamically loads Leaflet Routing Machine
function RoutingMachine({ startPos, endPos }: { startPos: [number, number]; endPos: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    let routingControl: any = null;

    const initRouting = () => {
      if (!(L as any).Routing) return;
      
      // Customize the route line to match theme
      routingControl = (L as any).Routing.control({
        waypoints: [
          L.latLng(startPos[0], startPos[1]),
          L.latLng(endPos[0], endPos[1])
        ],
        lineOptions: {
          styles: [{ color: '#0d631b', weight: 6, opacity: 0.8 }]
        },
        createMarker: function() { return null; }, // We use our own markers if needed
        routeWhileDragging: false,
        addWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        language: 'id' // Indonesian instructions if available
      }).addTo(map);
    };

    // Load dependencies dynamically if not present
    if (!(L as any).Routing) {
      const cssId = 'leaflet-routing-css';
      if (!document.getElementById(cssId)) {
        const link = document.createElement("link");
        link.id = cssId;
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css";
        document.head.appendChild(link);
      }

      const scriptId = 'leaflet-routing-js';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js";
        script.onload = () => initRouting();
        document.head.appendChild(script);
      } else {
        // Script is loading but not finished, wait a bit
        setTimeout(initRouting, 1000);
      }
    } else {
      initRouting();
    }

    return () => {
      if (routingControl && map) {
        try {
          map.removeControl(routingControl);
        } catch(e) {}
      }
    };
  }, [map, startPos, endPos]);

  return null;
}

interface MapViewerProps {
  position: [number, number];
  locationName: string;
}

export default function MapViewer({ position, locationName }: MapViewerProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Browser Anda tidak mendukung deteksi lokasi.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setIsLocating(false);
      },
      (err) => {
        setLocationError("Gagal mendapatkan lokasi. Pastikan izin GPS diberikan.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Route Action Button */}
      <div className="flex flex-col gap-2">
        {!userLocation ? (
          <button 
            onClick={handleGetLocation}
            disabled={isLocating}
            className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold py-2.5 px-4 rounded-md transition-colors border border-primary/20 disabled:opacity-50"
          >
            {isLocating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Melacak Lokasi Anda...</>
            ) : (
              <><Navigation className="w-4 h-4" /> Cek Jarak & Rute dari Lokasi Saya</>
            )}
          </button>
        ) : (
          <div className="w-full flex items-center justify-center gap-2 bg-green-100 text-green-800 font-bold py-2.5 px-4 rounded-md border border-green-200">
            ✓ Rute ditemukan! Lihat instruksi di dalam peta.
          </div>
        )}
        
        {locationError && (
          <p className="text-xs text-error font-medium text-center">{locationError}</p>
        )}
      </div>

      {/* Map Container */}
      <div className={`w-full ${userLocation ? 'h-[500px]' : 'h-48'} bg-surface-container rounded-lg overflow-hidden border border-outline-variant relative z-0 transition-all duration-500 ease-in-out`}>
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={position} icon={customIcon}>
            <Popup>
              <strong>{locationName}</strong><br/>
              Lokasi Acara
            </Popup>
          </Marker>

          {userLocation && (
            <>
              <Marker position={userLocation} icon={customIcon}>
                <Popup>Lokasi Anda Saat Ini</Popup>
              </Marker>
              <RoutingMachine startPos={userLocation} endPos={position} />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
