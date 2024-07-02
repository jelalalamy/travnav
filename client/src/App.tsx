import { useState } from "react";
import { APIProvider, ControlPosition, Map } from '@vis.gl/react-google-maps';
import { CustomMapControl } from './map-control';
import MapHandler from './map-handler'
import Directions from "./Directions";
import ControlPanel from "./ControlPanel";

export type AutocompleteMode = { id: string; label: string };
export type SolveMethod = { id: string, label: string }
export type SelectedPlace = { name: string | undefined, address: string | undefined, place: google.maps.places.PlaceResult | null }

const autocompleteModes: Array<AutocompleteMode> = [
  { id: 'classic', label: 'Google Autocomplete Widget' },
  { id: 'custom', label: 'Custom Build' },
  { id: 'custom-hybrid', label: 'Custom w/ Select Widget' }
];

const solveMethods: Array<SolveMethod> = [
  { id: 'brute', label: 'Brute Force' },
  { id: 'nearest', label: 'Nearest Neighbour' },
  { id: 'asadpour', label: 'Asadpour Approximation'}
];

const App = () => {
  const [selectedAutocompleteMode, setSelectedAutocompleteMode] = useState<AutocompleteMode>(autocompleteModes[0]);
  const [selectedPlaces, setSelectedPlaces] = useState<Array<SelectedPlace>>([]);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<SolveMethod>(solveMethods[0]);
  const [bestPath, setBestPath] = useState<Array<SelectedPlace>>([]);

  const computeBestPath = async ():Promise<SelectedPlace[]> => {
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
    return path.map((place: string) => selectedPlaces.find((selectedPlace: SelectedPlace) => place === selectedPlace.name))
  }

  const onComputePath = async () => {
    const bestPath = await computeBestPath();
    setBestPath(bestPath);
  };

  const onPlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    setSelectedPlace(place);
    const name = place?.name;
    const address = place?.formatted_address;
    setSelectedPlaces([...selectedPlaces, { name: name, address: address, place: place }])
  }

  return (
    <div className="h-screen">
      <APIProvider apiKey={process.env.REACT_APP_GMK as string}>
        <Map
          defaultZoom={9}
          defaultCenter={{ lat: 43.65, lng: -79.38 }}
          gestureHandling={'greedy'}
          disableDefaultUI={true}>
          <ControlPanel
            selectedPlaces={selectedPlaces}
            bestPath={bestPath}
            solveMethods={solveMethods}
            selectedMethod={selectedMethod}
            onSolveMethodChange={setSelectedMethod}
            onComputePath={onComputePath}
          />
          <Directions
            selectedPlaces={bestPath}
          />
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
