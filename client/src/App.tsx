import { useState } from "react";
import { APIProvider, ControlPosition, Map } from '@vis.gl/react-google-maps';
import {CustomMapControl} from './map-control';
import MapHandler from './map-handler'
import Directions from "./Directions";

export type AutocompleteMode = {id: string; label: string};
export type SolveMethod = {id: string, label: string}
export type SelectedPlace = {name: string | undefined, address: string | undefined, place: google.maps.places.PlaceResult | null}

const autocompleteModes: Array<AutocompleteMode> = [
  {id: 'classic', label: 'Google Autocomplete Widget'},
  {id: 'custom', label: 'Custom Build'},
  {id: 'custom-hybrid', label: 'Custom w/ Select Widget'}
];

const solveMethods: Array<SolveMethod> = [
  {id: 'brute', label: 'Brute Force'},
  {id: 'nearest', label: 'Nearest Neighbour'}
];

const App = () => {
  const [data, setData] = useState([]);
  const [selectedAutocompleteMode, setSelectedAutocompleteMode] = useState<AutocompleteMode>(autocompleteModes[0]);
  const [selectedPlaces, setSelectedPlaces] = useState<Array<SelectedPlace>>([]);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<SolveMethod>(solveMethods[0]);
  const [bestPath, setBestPath] = useState<Array<SelectedPlace>>([]);

  const onClickHandler = async () => {
    const places = selectedPlaces.map(place => place.name);
    const addresses = selectedPlaces.map(place => place.address)

    const res = await fetch('http://localhost:5000/bestpath', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ places: places, addresses: addresses, method: selectedMethod.id })
    });
    const resData = await res.json();
    const path = resData.data.path;
    setData(path + resData.data.distances);
    setBestPath(path.map((place: string) => selectedPlaces.find((selectedPlace: SelectedPlace) => place === selectedPlace.name)));
  };

  const onPlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    setSelectedPlace(place);
    const name = place?.name;
    const address = place?.formatted_address;
    setSelectedPlaces([...selectedPlaces, {name: name, address: address, place: place}])
  }

  const onMethodSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMethod = solveMethods.find(method => method.id === e.target.value);
    if (newMethod) {
      setSelectedMethod(newMethod)
    };
  }

  return (
    <div className="h-screen">
      <select className="text-black" value={selectedMethod.id} onChange={onMethodSelect}>
        {solveMethods.map(({id, label}) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
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
          <Directions selectedPlaces={bestPath}/>
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

export default App;
