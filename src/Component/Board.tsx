import React, { useState } from "react";
import styled from "styled-components";
import { useEffect } from "react";
import { Button, Row, Col } from "antd";
import "./Board.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Board = styled.div<{ size: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.size}, 50px);
  grid-template-rows: repeat(${(props) => props.size}, 50px);
  gap: 2px;

  justify-content: center;
`;

const Cell = styled.button<{ cell: string }>`
  background-color: #413c3c;
  color: ${({ cell }) =>
    cell === "X" ? "red" : cell === "O" ? "blue" : "#413c3c"};
  border-radius: 0;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

interface BoardProps {
  size: number;
}

const CaroBoard: React.FC<BoardProps> = ({ size }) => {
  // hàm tạo ra size của bảng
  const createInitialBoard = () => {
    const initialBoard: string[][] = [];
    for (let i = 0; i < size; i++) {
      initialBoard.push(Array.from({ length: size }, () => ""));
    }
    return initialBoard;
  };
  const [board, setBoard] = useState<string[][]>(createInitialBoard);
  const [player, setPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string>("");

  useEffect(() => {
    setBoard(createInitialBoard());
    setPlayer("X");
    setWinner("");
  }, [size]);

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] === "" && !winner) {
      const updatedBoard = [...board];
      updatedBoard[row][col] = player;
      setBoard(updatedBoard);
      setPlayer((prevPlayer) => (prevPlayer === "X" ? "O" : "X"));
      checkWinner(row, col);
    }
  };

  const checkWinner = (row: number, col: number) => {
    const currentPlayer = board[row][col];

    // Kiểm tra hàng ngang
    let count = 1;
    let i = 1;
    while (col - i >= 0 && board[row][col - i] === currentPlayer) {
      count++;
      i++;
    }
    i = 1;
    while (col + i < size && board[row][col + i] === currentPlayer) {
      count++;
      i++;
    }
    if (count >= 5) {
      setWinner(currentPlayer);
      handleWin(currentPlayer);
      return;
    }

    // Kiểm tra cột dọc
    count = 1;
    i = 1;
    while (row - i >= 0 && board[row - i][col] === currentPlayer) {
      count++;
      i++;
    }
    i = 1;
    while (row + i < size && board[row + i][col] === currentPlayer) {
      count++;
      i++;
    }
    if (count >= 5) {
      setWinner(currentPlayer);
      handleWin(currentPlayer);
      return;
    }

    // Kiểm tra đường chéo chính
    count = 1;
    i = 1;
    while (
      row - i >= 0 &&
      col - i >= 0 &&
      board[row - i][col - i] === currentPlayer
    ) {
      count++;
      i++;
    }
    i = 1;
    while (
      row + i < size &&
      col + i < size &&
      board[row + i][col + i] === currentPlayer
    ) {
      count++;
      i++;
    }
    if (count >= 5) {
      setWinner(currentPlayer);
      handleWin(currentPlayer);
      return;
    }

    // Kiểm tra đường chéo phụ
    count = 1;
    i = 1;
    while (
      row - i >= 0 &&
      col + i < size &&
      board[row - i][col + i] === currentPlayer
    ) {
      count++;
      i++;
    }
    i = 1;
    while (
      row + i < size &&
      col - i >= 0 &&
      board[row + i][col - i] === currentPlayer
    ) {
      count++;
      i++;
    }
    if (count >= 5) {
      setWinner(currentPlayer);
      handleWin(currentPlayer);
      return;
    }

    // Kiểm tra hòa
    if (!board.flat().includes("")) {
      setWinner("Draw");
      handleWin("Draw");
    }
  };

  const handleReset = () => {
    setBoard(
      Array.from({ length: size }, () => Array.from({ length: size }, () => ""))
    );
    setPlayer("X");
    setWinner("");
  };

  const handleWin = (player: string) => {
    if (player === "Draw") {
      toast(`2 người chơi hòa nhau`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast(`Người chơi ${player} đã thắng!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div>
      <Board size={size}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              cell={cell}
            >
              {cell}
            </Cell>
          ))
        )}
      </Board>
      {winner && (
        <div style={{ textAlign: "center" }}>
          <ToastContainer />
          {winner === "Draw" ? (
            <h2>Hòa nhau! </h2>
          ) : (
            <h2>Người thắng: {`${winner} wins`}</h2>
          )}

          <Button onClick={handleReset}>Reset</Button>
        </div>
      )}
    </div>
  );
};
export default CaroBoard;
