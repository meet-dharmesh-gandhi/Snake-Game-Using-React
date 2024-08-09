import React from "react";
import GameBoard from "./gameBoard.tsx";
import './App.css';

function App(): React.ReactElement {
  return (
    <div className="App">
      <GameBoard />
    </div>
  );
}

export default App;
