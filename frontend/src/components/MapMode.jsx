import React, { useEffect, useState, useRef } from 'react';

// Distance Calculator using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2); // returns distance in km
}

export default function MapMode() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [routingInfo, setRoutingInfo] = useState(null);
  
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayerRef = useRef(null);
  const markersRef = useRef({});

  const initializeLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      // Fallback location: Ernakulam, Kerala, India (9.9816, 76.2999)
      const fallback = { latitude: 9.9816, longitude: 76.2999, isFallback: true };
      setUserLoc(fallback);
      loadMapAndHospitals(fallback.latitude, fallback.longitude);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          isFallback: false
        };
        setUserLoc(coords);
        loadMapAndHospitals(coords.latitude, coords.longitude);
      },
      (err) => {
        console.warn("Geolocation permission denied/failed. Using fallback location.", err);
        const fallback = { latitude: 9.9816, longitude: 76.2999, isFallback: true };
        setUserLoc(fallback);
        loadMapAndHospitals(fallback.latitude, fallback.longitude);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const loadMapAndHospitals = async (lat, lon) => {
    setLoading(true);
    setError("");

    try {
      // 1. Initialize Map
      if (!mapInstanceRef.current && mapContainerRef.current) {
        const L = window.L;
        const map = L.map(mapContainerRef.current).setView([lat, lon], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add user location marker
        const userIcon = L.divIcon({
          className: 'user-marker-icon',
          html: `<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59,130,246,0.8);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        L.marker([lat, lon], { icon: userIcon })
          .addTo(map)
          .bindPopup("Your Location")
          .openPopup();

        mapInstanceRef.current = map;
      }

      // 2. Fetch nearby hospitals from Overpass API (OSM) within 5000m
      const query = `[out:json];node["amenity"="hospital"](around:5000,${lat},${lon});out;`;
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error("Failed to search nearby hospitals from OpenStreetMap server.");
      }
      
      const data = await response.json();

      const L = window.L;
      const parsedHospitals = (data.elements || []).map((element) => {
        const hLat = element.lat;
        const hLon = element.lon;
        const name = element.tags.name || "Unnamed Hospital";
        const address = element.tags["addr:street"] 
          ? `${element.tags["addr:street"]}${element.tags["addr:housenumber"] ? ' ' + element.tags["addr:housenumber"] : ''}`
          : "Nearby Hospital";

        const dist = calculateDistance(lat, lon, hLat, hLon);

        return {
          id: element.id,
          name,
          address,
          lat: hLat,
          lon: hLon,
          distance: parseFloat(dist)
        };
      }).sort((a, b) => a.distance - b.distance);

      setHospitals(parsedHospitals);

      // Add Hospital markers to map
      parsedHospitals.forEach((hosp) => {
        const hospIcon = L.divIcon({
          className: 'hospital-marker-icon',
          html: `<div style="background-color: #ef4444; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); font-size: 14px;">🏥</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker([hosp.lat, hosp.lon], { icon: hospIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup(`<b>${hosp.name}</b><br/>Distance: ${hosp.distance} km`);

        marker.on('click', () => {
          setSelectedHospital(hosp);
          drawRoute(hosp);
        });

        markersRef.current[hosp.id] = marker;
      });

    } catch (err) {
      console.error(err);
      setError("Error loading nearby hospitals. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const drawRoute = async (hosp) => {
    if (!userLoc || !mapInstanceRef.current) return;
    
    // Clear previous route
    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    try {
      const L = window.L;
      const startLat = userLoc.latitude;
      const startLon = userLoc.longitude;

      // OSRM Driving Route API
      const routeUrl = `https://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${hosp.lon},${hosp.lat}?overview=full&geometries=geojson`;
      const response = await fetch(routeUrl);
      
      if (!response.ok) throw new Error("Could not calculate driving directions.");
      
      const routeData = await response.json();
      
      if (routeData.routes && routeData.routes.length > 0) {
        const route = routeData.routes[0];
        const geojson = route.geometry;
        const durationMin = Math.round(route.duration / 60);

        setRoutingInfo({
          duration: durationMin,
          distance: (route.distance / 1000).toFixed(1)
        });

        // Draw path on Leaflet map
        const pathLayer = L.geoJSON(geojson, {
          style: {
            color: '#2563eb',
            weight: 5,
            opacity: 0.75
          }
        }).addTo(mapInstanceRef.current);

        routeLayerRef.current = pathLayer;

        // Auto pan map to fit the entire route
        const bounds = pathLayer.getBounds();
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (err) {
      console.error("Routing error:", err);
      setError("Routing calculation failed.");
    }
  };

  const selectHospitalFromList = (hosp) => {
    setSelectedHospital(hosp);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([hosp.lat, hosp.lon], 15);
      if (markersRef.current[hosp.id]) {
        markersRef.current[hosp.id].openPopup();
      }
      drawRoute(hosp);
    }
  };

  useEffect(() => {
    // 1. Inject Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    // 2. Inject Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => {
      initializeLocation();
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup CSS, script, and map on unmount
      if (link.parentNode) link.parentNode.removeChild(link);
      if (script.parentNode) script.parentNode.removeChild(script);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0A2463', marginBottom: '0.5rem' }}>
          🏥 Hospital Finder
        </h2>
        <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
          Find nearest medical centers and get live routing directions.
        </p>

        {userLoc && userLoc.isFallback && (
          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', color: '#b45309', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
            ⚠️ Location permission not granted. Showing default hospital listing for Ernakulam region.
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', lg: '350px 1fr', gap: '1.5rem', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          
          {/* Hospital List Sidebar */}
          <div style={{ flex: '1', minWidth: '300px', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0A2463', marginBottom: '1rem' }}>
              Nearby Hospitals ({hospitals.length})
            </h3>
            
            {loading && <p style={{ color: '#4b5563' }}>Locating nearest hospitals...</p>}
            {!loading && hospitals.length === 0 && <p style={{ color: '#4b5563' }}>No hospitals found within 5km.</p>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {hospitals.map((hosp) => (
                <div
                  key={hosp.id}
                  onClick={() => selectHospitalFromList(hosp)}
                  style={{
                    padding: '1rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: selectedHospital?.id === hosp.id ? '#f0f7ff' : 'white',
                    borderColor: selectedHospital?.id === hosp.id ? '#2563eb' : '#e5e7eb',
                    transition: 'all 0.2s'
                  }}
                >
                  <h4 style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '0.975rem' }}>{hosp.name}</h4>
                  <p style={{ fontSize: '0.825rem', color: '#6b7280', margin: '0.25rem 0' }}>{hosp.address}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.825rem', fontWeight: '500', color: '#2563eb' }}>
                      📍 {hosp.distance} km away
                    </span>
                    <button
                      style={{
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                    >
                      Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Leaflet Map Panel */}
          <div style={{ flex: '2', minWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {routingInfo && selectedHospital && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem 1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#166534' }}>
                <span>Route to: <b>{selectedHospital.name}</b></span>
                <span>⏱️ <b>{routingInfo.duration} mins</b> ({routingInfo.distance} km)</span>
              </div>
            )}
            
            <div
              ref={mapContainerRef}
              style={{
                width: '100%',
                height: '450px',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                zIndex: 1
              }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
