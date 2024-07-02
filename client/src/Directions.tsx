import { useState, useEffect } from "react";
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { SelectedPlace } from "./App";

interface Props {
  selectedPlaces: SelectedPlace[];
};

const polylineOptions = [
  { strokeColor: "#8A2BE2", strokeWeight: 5, strokeOpacity: 0.65 },
  { strokeColor: "#FF1493", strokeWeight: 5, strokeOpacity: 0.65 },
  { strokeColor: "#FF4500", strokeWeight: 5, strokeOpacity: 0.65 },
  { strokeColor: "#40E0D0", strokeWeight: 5, strokeOpacity: 0.65 },
  { strokeColor: "#00FF00", strokeWeight: 5, strokeOpacity: 0.65 }
]

const markerOptions = { icon: '' }

const Directions = ({ selectedPlaces }: Props) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] =
    useState<google.maps.DirectionsService>();
  const [directionsRenderers, setDirectionsRenderers] = useState<Array<google.maps.DirectionsRenderer>>();
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
  const [legs, setLegs] = useState<google.maps.DirectionsRoute[]>([]);
  const selected = routes[0];
  const leg = selected?.legs[0];

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;

    setDirectionsService(new routesLibrary.DirectionsService());

    let renderers = []
    for (let i = 0; i < selectedPlaces.length; i++) {
      renderers.push(new routesLibrary.DirectionsRenderer({ map, polylineOptions: polylineOptions[i], markerOptions }))
    }

    setDirectionsRenderers(renderers);
  }, [routesLibrary, map, selectedPlaces]);

  const getDirections = async () => {
    if (!directionsService || !directionsRenderers) return;

    if (selectedPlaces.length < 2) return;

    let newLegs: google.maps.DirectionsRoute[] = []
    for (let i = 0; i < selectedPlaces.length - 1; i++) {
      directionsService
        .route({
          origin: selectedPlaces[i].address as string,
          destination: selectedPlaces[i + 1].address as string,
          travelMode: google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true
        })
        .then(response => {
          directionsRenderers[i].setDirections(response);
          setRoutes(response.routes);
          newLegs.push(response.routes[0])
        });
    }
    // from last location back to beginning
    directionsService
      .route({
        origin: selectedPlaces[selectedPlaces.length - 1].address as string,
        destination: selectedPlaces[0].address as string,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true
      })
      .then(response => {
        directionsRenderers[selectedPlaces.length - 1].setDirections(response);
        setRoutes(response.routes);
        newLegs.push(response.routes[0])
      });

    setLegs(newLegs)
  }

  if (selectedPlaces.length < 2) {
    return (
      <div className="absolute right-0 top-0 bg-slate-900/90 w-64 m-1 p-5 rounded-md">
        <p>Select some places you'd like to visit then click "Compute Path"!</p>
      </div>
    )
  }

  if (!leg) {
    return (
      <div className="absolute right-0 top-0 bg-slate-900/90 w-64 m-1 p-5 rounded-md">
        <span>
          <h3>Best path:</h3>
          {selectedPlaces.map(place => <p key={place.name}>- {place.name}</p>)}
        </span>
        <button onClick={getDirections}>Get Directions</button>
      </div>
    );
  }

  return (
    <div id="directions-wrapper" className="absolute right-0 top-0">
      {legs.map((leg, i) => 
        <div key={leg.legs[0].start_address} className="w-64 m-1 p-5 rounded-md" style={{ backgroundColor: polylineOptions[i].strokeColor, opacity: 0.85 }}>
          <p>
            {leg.legs[0].start_address.split(',')[0]} to {leg.legs[0].end_address.split(',')[0]}
          </p>
          <p>Distance: {leg.legs[0].distance?.text}</p>
          <p>Duration: {leg.legs[0].duration?.text}</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="directions">
      <h2>Directions</h2>
      <ul>
        {legs.map(leg =>
          <li className="mt-2" key={leg.legs[0].start_address}>
            <p>
              {leg.legs[0].start_address.split(',')[0]} to {leg.legs[0].end_address.split(',')[0]}
            </p>
            <p>Distance: {leg.legs[0].distance?.text}</p>
            <p>Duration: {leg.legs[0].duration?.text}</p>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Directions