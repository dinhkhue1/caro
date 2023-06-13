import React from "react";
import { useState } from "react";

import "./App.css";
import Board from "./Component/Board";

function App() {
  const [boardSize, setBoardSize] = useState(10);
  const handleBoardSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    setBoardSize(size);
  };
  return (
    <div className="App">
      <h1>Caro Game</h1>
      <label htmlFor="boardSize">Độ rộng của bảng: </label>
      <input
        type="number"
        id="boardSize"
        value={boardSize}
        min="5"
        max="20"
        onChange={handleBoardSizeChange}
      />
      <Board size={boardSize} />
    </div>
  );
}

export default App;
