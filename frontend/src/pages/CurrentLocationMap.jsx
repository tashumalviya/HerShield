import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "350px",
};

export default function CurrentLocationMap() {
  const [position, setPosition] = useState(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.log(err)
    );
  }, []);

  if (!isLoaded) return <p>Loading Map...</p>;
  if (!position) return <p>Getting Location...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={position}
      zoom={15}
    >
      <Marker position={position} />
    </GoogleMap>
  );
}