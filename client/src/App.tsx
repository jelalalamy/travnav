import { useState } from "react";

const App = () => {
  const [data, setData] = useState("");

  const onClickHandler = async () => {
    const cities = ["Toronto", "Scarborough", "Markham", "North York"];
    const distances = [[0, 10, 15, 20], 
                    [10, 0, 35, 25], 
                    [15, 35, 0, 30], 
                    [20, 25, 30, 0]];
    
    const res = await fetch('http://localhost:5000/hello');
    const resData = await res.json();
    console.log(resData)

    setData("asdf");
  };

  return (
    <div>
      <h1 className="text-4xl font-bold underline">
        Hello world!
      </h1>
      <button onClick={onClickHandler}>Click me</button>
      <h3>{data}</h3>
    </div>
  );
}

export default App;
