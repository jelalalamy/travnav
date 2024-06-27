import React from 'react'
import { SelectedPlace, SolveMethod } from './App'

interface Props {
  selectedPlaces: Array<SelectedPlace>;
  bestPath: Array<SelectedPlace>;
  solveMethods: Array<SolveMethod>;
  selectedMethod: SolveMethod;
  onSolveMethodChange: (solveMethod: SolveMethod) => void;
  onComputePath: () => void;
};

const ControlPanel = ({selectedPlaces, bestPath, solveMethods, selectedMethod, onSolveMethodChange, onComputePath}: Props) => {

  const onMethodSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMethod = solveMethods.find(method => method.id === e.target.value);
    if (newMethod) {
      onSolveMethodChange(newMethod)
    };
  }

  return (
    <div className="control">
      <select className="text-black" value={selectedMethod.id} onChange={onMethodSelect}>
        {solveMethods.map(({id, label}) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
      <span>
        <p>Selected places:</p>
        {selectedPlaces.map(place => <p key={place.name}>- {place.name}</p>)}
      </span>
      <button onClick={onComputePath}>Compute Path</button>
      <span>
        <p>Best path:</p>
        {bestPath.map(place => <p key={place.name}>- {place.name}</p>)}
      </span>
    </div>
  )
}

export default ControlPanel