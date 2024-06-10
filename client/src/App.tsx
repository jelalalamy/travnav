import { useState } from "react";
import { APIProvider, ControlPosition, Map } from '@vis.gl/react-google-maps';
import {CustomMapControl} from './map-control';
import MapHandler from './map-handler'

export type AutocompleteMode = {id: string; label: string};
type SelectedPlace = {name: string | undefined, placeId: string | undefined, place: google.maps.places.PlaceResult | null}

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
    const placeIds = selectedPlaces.map(place => place.placeId)

    const res = await fetch('http://localhost:5000/bestpath', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ places: places, placeIds: placeIds, method: selectedMethod })
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
    const placeId = place?.place_id;
    setSelectedPlaces([...selectedPlaces, {name: name, placeId: placeId, place: place}])
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
        <MapHandler place={selectedPlace} />
      </APIProvider>
    </div>
  );
}

export default App;
