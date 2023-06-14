import React from "react";
import { useState } from "react";
import { Button, Row, Col, Modal, Popconfirm, message } from "antd";
import "./App.css";
import Board from "./Component/Board";

function App() {
  const [boardSize, setBoardSize] = useState(10);

  const [newBoardSize, setNewBoardSize] = useState(10);

  const handleBoardSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    setNewBoardSize(size);
  };

  const handleConfirm = (e: any) => {
    message.success("Đã thay đổi kích thước bảng");
    setBoardSize(newBoardSize);
  };

  const handleCancel = () => {
    message.error("Kích thước của bảng chưa được thay đổi");
  };
  return (
    <div className="App">
      <h1>Caro Game</h1>
      <label htmlFor="boardSize">Độ rộng của bảng: </label>
      <Popconfirm
        title="Bạn có chắc muốn thay đổi kích thước bảng?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        okText="Đồng ý"
        cancelText="Hủy bỏ"
      >
        <input
          type="number"
          id="boardSize"
          value={boardSize}
          min="5"
          max="20"
          onChange={handleBoardSizeChange}
        />
      </Popconfirm>
      <Board size={boardSize} />
    </div>
  );
}

export default App;
