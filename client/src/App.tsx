import { useState } from "react";
import { APIProvider, ControlPosition, Map } from '@vis.gl/react-google-maps';
import {CustomMapControl} from './map-control';

export type AutocompleteMode = {id: string; label: string};
type SelectedPlace = {name: string, latlng: [number | undefined, number | undefined]}

const autocompleteModes: Array<AutocompleteMode> = [
  {id: 'classic', label: 'Google Autocomplete Widget'},
  {id: 'custom', label: 'Custom Build'},
  {id: 'custom-hybrid', label: 'Custom w/ Select Widget'}
];

const App = () => {
  const [data, setData] = useState([]);
  const [selectedAutocompleteMode, setSelectedAutocompleteMode] = useState<AutocompleteMode>(autocompleteModes[0]);
  const temp : Array<SelectedPlace> = [{name: 'home', latlng: [43.82120817331005, -79.31640603338617]}, 
                                       {name: 'oishiii', latlng: [43.81793459999999, -79.30532389999999]}, 
                                       {name: 'v1', latlng: [43.8145114, -79.29339039999999]}, 
                                       {name: 'utsc', latlng: [43.7830961, -79.1873263]}
                                      ]
  const [selectedPlaces, setSelectedPlaces] = useState<Array<SelectedPlace>>(temp)
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

  const onClickHandler = async () => {
    const cities = ["Toronto", "Scarborough", "Markham", "North York"];
    const distances = [[0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]];

    const res = await fetch('http://localhost:5000/brute', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cities: cities, distances: distances })
    });
    const resData = await res.json();
    console.log(resData)
    console.log(resData.data.path)
    setData(resData.data.path);
  };

  const onPlaceSelect = (place: google.maps.places.PlaceResult | null) => {
    setSelectedPlace(place)
    const lat = place?.geometry?.location?.lat()
    const lng = place?.geometry?.location?.lng()
    setSelectedPlaces([...selectedPlaces, {name: 'asdf', latlng: [lat, lng]}])
  }

  return (
    <div className="h-screen">
      <h3>asdf</h3>
      <h3>selected places: {selectedPlaces.map(place => JSON.stringify(place)).toString()}</h3>
      <h3>{selectedPlace ? selectedPlace.formatted_address : 'nothing selected yet'}</h3>
      {/* <button onClick={onClickHandler}>Click me</button>
      <h3>{data}</h3> */}
      {/* <APIProvider apiKey={process.env.REACT_APP_GMK as string}>
        <Map
          defaultZoom={3}
          defaultCenter={{ lat: 22.54992, lng: 0 }}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        />
      <CustomMapControl
        controlPosition={ControlPosition.TOP}
        selectedAutocompleteMode={selectedAutocompleteMode}
        onPlaceSelect={onPlaceSelect}
      />
      </APIProvider> */}
    </div>
  );
}

export default App;
