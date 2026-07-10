import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.js";
import "./DisasterMap.css";

const zones = [
  { name: "Belagavi GIT", coords: [15.8497, 74.4977], type: "safe" },
  { name: "Safe Zone 2", coords: [15.855, 74.495], type: "safe" },
  { name: "Safe Zone 3", coords: [15.84, 74.49], type: "safe" },
  { name: "Shelter Area", coords: [15.848, 74.485], type: "shelter" },
  { name: "Flood Risk Area", coords: [15.851, 74.5], type: "danger" },
];

export default function DisasterMap() {
  const navigate = useNavigate();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const routingRef = useRef(null);

  // refs for navigation/audio logic
  const navigationIntervalRef = useRef(null);
  const navigationStepsRef = useRef([]); // always keep latest steps here
  const currentStepIndexRef = useRef(0);
  const spokenStepsRef = useRef(new Set());
  const voiceEnabledRef = useRef(true);

  const [manualMode, setManualMode] = useState(false);
  const [travelMode, setTravelMode] = useState("driving");
  const [currentDestination, setCurrentDestination] = useState(null);
  const [navigationSteps, setNavigationSteps] = useState([]); // React state for UI if needed
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [infoText, setInfoText] = useState("📍 Detecting your location...");
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // keep voiceEnabledRef updated to avoid stale closures
  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
    // if voice disabled, stop any ongoing speech and stop interval checks
    if (!voiceEnabled) {
      window.speechSynthesis.cancel();
      if (navigationIntervalRef.current) {
        clearInterval(navigationIntervalRef.current);
        navigationIntervalRef.current = null;
      }
    } else {
      // If voice re-enabled and we have steps, start the interval (effect below will handle it)
    }
  }, [voiceEnabled]);

  // Centralized playAudio that checks ref
  const playAudio = (message) => {
    if (!voiceEnabledRef.current) return;
    try {
      window.speechSynthesis.cancel(); // stop any current utterance
    } catch (e) {
      /* ignore */
    }
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  // Initialize map once
  useEffect(() => {
    if (mapInstanceRef.current) return;
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current).setView([15.8497, 74.4977], 14);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // draw zones
    zones.forEach((zone) => {
      const color = zone.type === "safe" ? "green" : zone.type === "shelter" ? "yellow" : "red";
      L.circleMarker(zone.coords, { radius: 10, color, fillColor: color, fillOpacity: 0.8 })
        .addTo(map)
        .bindPopup(zone.name)
        .on("click", () => {
          if (userMarkerRef.current) {
            setCurrentDestination(zone);
            calculateRoute(userMarkerRef.current.getLatLng(), zone.coords, zone.name);
          }
        });
    });

    // location handlers: we only set user location here.
    const onLocationFound = (e) => {
      setUserLocation(e.latlng);
      // DO NOT start navigation checks here — the interval driven by navigationSteps handles audio
    };
    const onLocationError = () => {
      setInfoText("Unable to get GPS. Click manual button.");
      playAudio("Unable to get GPS. Please select your location manually.");
    };

    map.on("locationfound", onLocationFound);
    map.on("locationerror", onLocationError);

    // start watching location
    map.locate({ setView: true, maxZoom: 16, watch: true, enableHighAccuracy: true });

    // manual-map-click to set location
    const onMapClick = (e) => {
      if (manualMode) {
        setUserLocation(e.latlng);
        setManualMode(false);
      }
    };
    map.on("click", onMapClick);

    // cleanup when unmount / route change
    return () => {
      // stop any speech
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
      // clear interval
      if (navigationIntervalRef.current) {
        clearInterval(navigationIntervalRef.current);
        navigationIntervalRef.current = null;
      }
      // stop location watch
      try {
        map.stopLocate();
      } catch (e) {}
      map.off("locationfound", onLocationFound);
      map.off("locationerror", onLocationError);
      map.off("click", onMapClick);

      // remove routing control
      if (routingRef.current) {
        try {
          map.removeControl(routingRef.current);
        } catch (e) {}
        routingRef.current = null;
      }

      // remove map
      try {
        map.remove();
      } catch (e) {}
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualMode]);

  // Set or move the user marker
  const setUserLocation = (latlng) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(latlng);
    } else {
      userMarkerRef.current = L.marker(latlng).addTo(map).bindPopup("You are here").openPopup();
    }

    // If no destination chosen, pick nearest safe and route to it
    if (!currentDestination) {
      let nearest = zones.filter((z) => z.type === "safe")[0];
      let minDist = map.distance(latlng, L.latLng(nearest.coords));
      zones.filter((z) => z.type === "safe").forEach((zone) => {
        const dist = map.distance(latlng, L.latLng(zone.coords));
        if (dist < minDist) {
          nearest = zone;
          minDist = dist;
        }
      });
      setCurrentDestination(nearest);
      calculateRoute(latlng, nearest.coords, nearest.name);
    } else {
      // if destination exists, recalc route from new location
      calculateRoute(latlng, currentDestination.coords, currentDestination.name);
    }
  };

  // Calculate route and populate navigation steps
  const calculateRoute = (userLatLng, destCoords, destName) => {
    const map = mapInstanceRef.current;
    if (!map || !L.Routing) return;

    // remove old routing control
    if (routingRef.current) {
      try {
        map.removeControl(routingRef.current);
      } catch (e) {}
      routingRef.current = null;
    }

    // reset navigation bookkeeping
    spokenStepsRef.current.clear();
    navigationStepsRef.current = [];
    currentStepIndexRef.current = 0;
    setCurrentStepIndex(0);
    setNavigationSteps([]);

    // create new route
    routingRef.current = L.Routing.control({
      waypoints: [L.latLng(userLatLng.lat, userLatLng.lng), L.latLng(destCoords[0], destCoords[1])],
      lineOptions: { styles: [{ color: "blue", opacity: 0.6, weight: 5 }] },
      router: L.Routing.osrmv1({ profile: travelMode }),
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null,
    }).addTo(map);

    routingRef.current.on("routesfound", (e) => {
      const route = e.routes[0];
      if (!route) {
        setInfoText("⚠ No route found.");
        return;
      }
      const distanceKm = (route.summary?.totalDistance / 1000).toFixed(2);
      const timeMin = Math.ceil((route.summary?.totalTime || 0) / 60);

      setInfoText(
        `🟢 Destination: ${destName} | Distance: ${distanceKm} km | ETA: ${timeMin} min | Mode: ${travelMode}`
      );

      // play summary (if voice enabled)
      playAudio(`Route to ${destName} ready. Distance ${distanceKm} kilometers. ETA ${timeMin} minutes.`);

      // prepare step list (give each step a stable id)
      if (route.legs && route.legs[0]?.steps) {
        const steps = route.legs[0].steps.map((step, idx) => ({
          id: idx,
          text: step.maneuver.instruction,
          latlng: L.latLng(step.maneuver.location[1], step.maneuver.location[0]),
        }));
        // keep in both state and ref
        navigationStepsRef.current = steps;
        setNavigationSteps(steps);
        spokenStepsRef.current.clear();
        currentStepIndexRef.current = 0;
        setCurrentStepIndex(0);
      }
    });
  };

  // Interval-managed navigation check:
  // Starts automatically whenever navigationSteps or voiceEnabled changes.
  useEffect(() => {
    // clear previous interval if any
    if (navigationIntervalRef.current) {
      clearInterval(navigationIntervalRef.current);
      navigationIntervalRef.current = null;
    }

    // start interval only when we have steps AND voice is enabled
    if (navigationSteps.length > 0 && voiceEnabledRef.current) {
      navigationIntervalRef.current = setInterval(() => {
        const map = mapInstanceRef.current;
        if (!map || navigationStepsRef.current.length === 0 || !userMarkerRef.current) return;

        const userLatLng = userMarkerRef.current.getLatLng();

        // find first unspoken step (lowest index) that is within the threshold
        for (let i = 0; i < navigationStepsRef.current.length; i++) {
          const step = navigationStepsRef.current[i];
          if (spokenStepsRef.current.has(step.id)) continue;
          const dist = map.distance(userLatLng, step.latlng);
          // threshold 20 meters — adjust if you want (e.g., 10 or 30)
          if (dist < 20) {
            // mark as spoken and speak once
            spokenStepsRef.current.add(step.id);
            currentStepIndexRef.current = i + 1;
            setCurrentStepIndex(currentStepIndexRef.current);
            playAudio(step.text);
            break; // speak only one instruction per interval
          }
        }

        // if all steps spoken, clear the interval
        if (spokenStepsRef.current.size === navigationStepsRef.current.length) {
          if (navigationIntervalRef.current) {
            clearInterval(navigationIntervalRef.current);
            navigationIntervalRef.current = null;
          }
        }
      }, 1500); // check every 1.5s
    }

    // cleanup for this effect
    return () => {
      if (navigationIntervalRef.current) {
        clearInterval(navigationIntervalRef.current);
        navigationIntervalRef.current = null;
      }
    };
  }, [navigationSteps, voiceEnabled]); // re-run when steps change or user toggles voice

  // Voice toggle handler — ensure interval cleared & speech canceled when turning off
  const toggleVoice = () => {
    setVoiceEnabled((prev) => {
      const newVal = !prev;
      if (!newVal) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
        if (navigationIntervalRef.current) {
          clearInterval(navigationIntervalRef.current);
          navigationIntervalRef.current = null;
        }
      } else {
        // when re-enabled, play an acknowledgement
        playAudio("Voice guidance enabled.");
        // the effect above will restart interval if there are steps
      }
      return newVal;
    });
  };

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 20,
          left: 100,
          zIndex: 1000,
          padding: "8px 12px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        ⬅ Back
      </button>

      {/* Voice Toggle Button */}
      <button
        onClick={toggleVoice}
        style={{
          position: "absolute",
          bottom: 250,
          right: 30,
          zIndex: 1000,
          padding: "8px 12px",
          background: voiceEnabled ? "#28a745" : "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        {voiceEnabled ? "🔊" : "🔇"}
      </button>

      <div id="info">{infoText}</div>
      <div ref={mapContainerRef} id="map" style={{ height: "100vh", width: "100%" }}></div>

      <div
        id="controls"
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          background: "white",
          padding: 10,
          borderRadius: 5,
          boxShadow: "0 0 5px #999",
        }}
      >
        <button
          onClick={() => {
            alert("Click on map to set your location.");
            setManualMode(true);
          }}
        >
          Set Location Manually
        </button>
        <button
          onClick={() => {
            setTravelMode("foot");
            alert("Walking mode");
          }}
        >
          Walking Mode
        </button>
        <button
          onClick={() => {
            setTravelMode("driving");
            alert("Driving mode");
          }}
        >
          Driving Mode
        </button>
      </div>
    </div>
  );
}