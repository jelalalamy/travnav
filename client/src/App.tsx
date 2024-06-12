import { useState, useEffect } from "react";
import { APIProvider, ControlPosition, Map, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import {CustomMapControl} from './map-control';
import MapHandler from './map-handler'

export type AutocompleteMode = {id: string; label: string};
type SelectedPlace = {name: string | undefined, address: string | undefined, place: google.maps.places.PlaceResult | null}

const autocompleteModes: Array<AutocompleteMode> = [
  {id: 'classic', label: 'Google Autocomplete Widget'},
  {id: 'custom', label: 'Custom Build'},
  {id: 'custom-hybrid', label: 'Custom w/ Select Widget'}
];

const App = () => {
  const [data, setData] = useState([]);
  const [selectedAutocompleteMode, setSelectedAutocompleteMode] = useState<AutocompleteMode>(autocompleteModes[0]);
  // const temp : Array<SelectedPlace> = [{name: 'home', placeId: 'ChIJOdPET4rT1IkR9pq2mnY1hTU'}, 
  //                                      {name: 'oishiii', placeId: 'ChIJ55UUDwzT1IkRv4F9ZBII87I'}, 
  //                                      {name: 'v1', placeId: 'ChIJYVMHqB_T1IkRUXng8NIT57U'}, 
  //                                      {name: 'utsc', placeId: 'ChIJf9Wrt2_a1IkRrHuIaQFuZbs'}
  //                                     ];
  const [selectedPlaces, setSelectedPlaces] = useState<Array<SelectedPlace>>([]);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('hello');

  const onClickHandler = async () => {
    const places = selectedPlaces.map(place => place.name);
    const addresses = selectedPlaces.map(place => place.address)

    const res = await fetch('http://localhost:5000/bestpath', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ places: places, addresses: addresses, method: selectedMethod })
    });
    const resData = await res.json();
    console.log(resData);
    console.log(resData.data.path);
    setData(resData.data.path + resData.data.distances);
  };

  const onPlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    setSelectedPlace(place);
    console.log(place)
    const name = place?.name;
    const address = place?.formatted_address;
    setSelectedPlaces([...selectedPlaces, {name: name, address: address, place: place}])
  }

  const onMethodSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMethod(e.target.value)
  }

  return (
    <div className="h-screen">
      <select className="text-black" value={selectedMethod} onChange={onMethodSelect}>
        <option value="hello">Hello</option>
        <option value="brute">Brute Force</option>
        <option value="nearest">Nearest Neighbour</option>
      </select>
      <button onClick={onClickHandler}>Compute Path</button>
      <h3>Data: {data}</h3>
      <h3>Selected places: {selectedPlaces.map(place => place.name)}</h3>
      <h3>{selectedPlace ? selectedPlace.formatted_address : 'nothing selected yet'}</h3>
      <APIProvider apiKey={process.env.REACT_APP_GMK as string}>
        <Map
          defaultZoom={9}
          defaultCenter={{ lat: 43.65, lng: -79.38 }}
          gestureHandling={'greedy'}
          disableDefaultUI={true}>
          {/* <Directions/> */}
        </Map>
        <CustomMapControl
          controlPosition={ControlPosition.TOP}
          selectedAutocompleteMode={selectedAutocompleteMode}
          onPlaceSelect={onPlaceSelect}
        />
        <MapHandler place={selectedPlace} />
      </APIProvider>
    </div>
  );
}

const Directions = () => {
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

  // Use directions service
  // useEffect(() => {
  //   if (!directionsService || !directionsRenderer) return;

  //   directionsService
  //     .route({
  //       origin: '43 Inniscross Crescent, Scarborough, ON M1V 2S8, Canada',
  //       destination: '43 Inniscross Crescent, Scarborough, ON M1V 2S8, Canada',
  //       waypoints: [{location: '3376 Kennedy Rd Unit 2, Scarborough, ON M1V 3S8, Canada'}, 
  //                   {location: '105-3700 Midland Ave, Scarborough, ON M1V 0B4, Canada'},
  //                   {location: '1265 Military Trail, Scarborough, ON M1C 1A4, Canada'}
  //                 ],
  //       travelMode: google.maps.TravelMode.DRIVING,
  //       provideRouteAlternatives: true
  //     })
  //     .then(response => {
  //       directionsRenderer.setDirections(response);
  //       setRoutes(response.routes);
  //     });

  //   return () => directionsRenderer.setMap(null);
  // }, [directionsService, directionsRenderer]);

  const getDirections = () => {
    if (!directionsService || !directionsRenderer) return;

    directionsService
      .route({
        origin: '43 Inniscross Crescent, Scarborough, ON M1V 2S8, Canada',
        destination: '43 Inniscross Crescent, Scarborough, ON M1V 2S8, Canada',
        waypoints: [{location: '3376 Kennedy Rd Unit 2, Scarborough, ON M1V 3S8, Canada'}, 
                    {location: '105-3700 Midland Ave, Scarborough, ON M1V 0B4, Canada'},
                    {location: '1265 Military Trail, Scarborough, ON M1C 1A4, Canada'}
                  ],
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
      <h2>{selected.summary}</h2>
      <p>
        {leg.start_address.split(',')[0]} to {leg.end_address.split(',')[0]}
      </p>
      <p>Distance: {leg.distance?.text}</p>
      <p>Duration: {leg.duration?.text}</p>

    </div>
  );
}

export default App;
