import { useState } from "react";

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
      body: JSON.stringify({cities: cities, distances: distances})
    });
    const resData = await res.json();
    console.log(resData)
    console.log(resData.data.path)
    setData(resData.data.path);
  };

  return (
    <div>
      <button onClick={onClickHandler}>Click me</button>
      <h3>{data}</h3>
    </div>
  );
}

export default App;
