import { useState, useEffect } from "react";
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { SelectedPlace } from "./App";

const Directions = ({selectedPlaces}: {selectedPlaces: SelectedPlace[]}) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderer, setDirectionsRenderer] =
    useState<google.maps.DirectionsRenderer>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const selected = routes[routeIndex];
  const leg = selected?.legs[0];

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
  }, [routesLibrary, map]);

  const getDirections = () => {
    if (!directionsService || !directionsRenderer) return;

    directionsService
      .route({
        origin: selectedPlaces[0].address as string,
        destination: selectedPlaces[0].address as string,
        waypoints: selectedPlaces.slice(1).map(place => ({location: place.address})),
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true
      })
      .then(response => {
        directionsRenderer.setDirections(response);
        setRoutes(response.routes);
      });
  }

  // Update direction route
  useEffect(() => {
    if (!directionsRenderer) return;
    directionsRenderer.setRouteIndex(routeIndex);
  }, [routeIndex, directionsRenderer]);

  if (!leg) {
    return (
    <div className="directions">
      <button onClick={getDirections}>Get best route</button>
    </div>
    );
  }

  return (
    <div className="directions">
      <h2>Directions</h2>
      <ul>
        {selected.legs.map(leg => 
          <li className="mt-2" key={leg.start_address}>
            <p>
              {leg.start_address.split(',')[0]} to {leg.end_address.split(',')[0]}
            </p>
            <p>Distance: {leg.distance?.text}</p>
            <p>Duration: {leg.duration?.text}</p>
          </li>
        )}
      </ul>

    </div>
  );
}

export default Directions