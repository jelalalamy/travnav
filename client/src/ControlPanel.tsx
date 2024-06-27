import React from 'react'
import { SelectedPlace, SolveMethod } from './App'

interface Props {
  data: Array<any>;
  selectedPlaces: Array<SelectedPlace>;
  solveMethods: Array<SolveMethod>;
  selectedMethod: SolveMethod;
  onSolveMethodChange: (solveMethod: SolveMethod) => void;
  onComputePath: () => void;
};

const ControlPanel = ({data, selectedPlaces, solveMethods, selectedMethod, onSolveMethodChange, onComputePath}: Props) => {

  const onMethodSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMethod = solveMethods.find(method => method.id === e.target.value);
    if (newMethod) {
      onSolveMethodChange(newMethod)
    };
  }

  return (
    <div className="control">
      ControlPanel
      <select className="text-black" value={selectedMethod.id} onChange={onMethodSelect}>
        {solveMethods.map(({id, label}) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
      <p>Data: {data}</p>
      <span>
        Selected places: 
        {selectedPlaces.map(place => <p key={place.name}>- {place.name}</p>)}
      </span>
      <button onClick={onComputePath}>Compute Path</button>
    </div>
  )
}

export default ControlPanel