import { useState } from "react";
import { APIProvider, Map } from '@vis.gl/react-google-maps';

const App = () => {
  const [data, setData] = useState([]);

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

  return (
    <div className="h-screen">
      <button onClick={onClickHandler}>Click me</button>
      <h3>{data}</h3>
      <APIProvider apiKey={process.env.REACT_APP_GMK as string}>
        <Map
          defaultZoom={3}
          defaultCenter={{ lat: 22.54992, lng: 0 }}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        />
      </APIProvider>
    </div>
  );
}

export default App;
