import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./App.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGFuc3dpY2siLCJhIjoiY2l1dTUzcmgxMDJ0djJ0b2VhY2sxNXBiMyJ9.25Qs4HNEkHubd4_Awbd8Og";

function App() {
  const mapContainer: any = useRef(null);
  const map: any = useRef(null);
  const [lng, setLng] = useState(-7.613093);
  const [lat, setLat] = useState(33.591658);
  const [zoom, setZoom] = useState(15);
  const [marker, setMarker] = useState<any>(null);
  const [animation, setAnimation] = useState<any>(true);

  function animateMarker(timestamp: any) {
    // const radius = 0.0009;

    // set raduis based on zoom level
    const radius = 0.00001 * (100 - zoom);
    /* 
    Update the data to a new position 
    based on the animation timestamp. 
    The divisor in the expression `timestamp / 1000` 
    controls the animation speed.
    */
    marker.setLngLat([lng, lat + Math.sin(timestamp / 1000) * radius]);

    // Request the next frame of the animation.
    requestAnimationFrame(animateMarker);
  }
  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
    // add navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    setMarker(
      new mapboxgl.Marker({
        color: "red",
        draggable: true,
      })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups

            .setHTML("<p>Move me !</p>")
        )
        .addTo(map.current)
        .togglePopup()
    );
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
      // marker.setLngLat([lng, lat]);
    });
  });

  // when the marker is dragged, remove popup and update coordinates

  useEffect(() => {
    if (!marker) return;
    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      setLng(lngLat.lng.toFixed(4));
      setLat(lngLat.lat.toFixed(4));
    });

    marker.on("dragstart", () => {
      marker.setPopup(null);
      // enable the animation
      setAnimation(false);
    });
  });

  // Todo fix: animate marker on load
  // useEffect(() => {
  //   if (animation) {
  //     console.log("animation", animation);
  //     // Start the animation.
  //     requestAnimationFrame(animateMarker);
  //   }
  // }, [marker]);

  // console.log("animation", animation);
  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div id="map" ref={mapContainer} onClick={() => setAnimation(false)} />
    </div>
  );
}

export default App;
