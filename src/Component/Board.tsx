import React, { useState } from "react";
import styled from "styled-components";
import { useEffect } from "react";
import { Button, Row, Col, Modal } from "antd";
import "./Board.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Board, Cell, createInitialBoard } from "./boardStyle";

interface BoardProps {
  size: number;
}

enum Player {
  X = "X",
  O = "O",
  Draw = "Draw",
}

const CaroBoard: React.FC<BoardProps> = ({ size }) => {
  const [board, setBoard] = useState<string[][]>(createInitialBoard(size));

  // const [player, setPlayer] = useState<"X" | "O">("X");
  // const [winner, setWinner] = useState<string>("");
  const [player, setPlayer] = useState<Player>(Player.X);
  const [winner, setWinner] = useState<Player | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [moves, setMoves] = useState<
    { row: number; col: number; player: Player }[]
  >([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(0);
  useEffect(() => {
    setBoard(createInitialBoard(size));
    setPlayer(Player.X);
    setWinner(null);
  }, [size]);

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] === "" && !winner) {
      const clickedCell = board[row][col];
      if (clickedCell !== "") {
        handleUndo();
        return;
      }
      const updatedBoard = [...board];
      updatedBoard[row][col] = player;
      setBoard(updatedBoard);
      setPlayer((prevPlayer) =>
        prevPlayer === Player.X ? Player.O : Player.X
      );
      const newMove = { row, col, player };
      setMoves((prevMoves) => [
        ...prevMoves.slice(0, currentMoveIndex + 1),
        newMove,
      ]);
      setCurrentMoveIndex((prevIndex) => prevIndex + 1);
      checkWinner(row, col);
    }
  };
  const checkRow = (
    row: number,
    col: number,
    currentPlayer: string
  ): boolean => {
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
    return count >= 5;
  };
  const checkCol = (
    row: number,
    col: number,
    currentPlayer: string
  ): boolean => {
    let count = 1;
    let i = 1;
    while (row - i >= 0 && board[row - i][col] === currentPlayer) {
      count++;
      i++;
    }
    i = 1;
    while (row + i < size && board[row + i][col] === currentPlayer) {
      count++;
      i++;
    }
    return count >= 5;
  };
  const checkDiagonalMain = (
    row: number,
    col: number,
    currentPlayer: string
  ): boolean => {
    let count = 1;
    let i = 1;
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
    return count >= 5;
  };

  const checkDiagonalSub = (
    row: number,
    col: number,
    currentPlayer: string
  ): boolean => {
    let count = 1;
    let i = 1;
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
    return count >= 5;
  };

  const checkDraw = (): boolean => {
    return !board.flat().includes("");
  };

  const checkWinner = (row: number, col: number) => {
    const currentPlayer = board[row][col];

    if (
      checkRow(row, col, currentPlayer) ||
      checkCol(row, col, currentPlayer) ||
      checkDiagonalMain(row, col, currentPlayer) ||
      checkDiagonalSub(row, col, currentPlayer)
    ) {
      setWinner(currentPlayer as Player);
      handleWin(currentPlayer);
      return;
    }

    if (checkDraw()) {
      setWinner(Player.Draw);
      handleWin(Player.Draw);
    }
  };

  const handleReset = () => {
    setBoard(
      Array.from({ length: size }, () => Array.from({ length: size }, () => ""))
    );
    setPlayer(Player.X);
    setWinner(null);
  };

  const handleUndo = () => {
    setPlayer((prevPlayer) => (prevPlayer === Player.X ? Player.O : Player.X));
    setWinner(null);

    setCurrentMoveIndex((prevIndex) => {
      const newCurrentMoveIndex = prevIndex - 1;
      const lastMove = moves[newCurrentMoveIndex];
      const { row, col } = lastMove;

      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[row][col] = "";
        return newBoard;
      });

      setMoves((prevMoves) => prevMoves.slice(0, newCurrentMoveIndex));

      return newCurrentMoveIndex;
    });
  };

  const handleWin = (player: string) => {
    setShowPopup(true);
    // if (player === "Draw") {
    //   toast(`2 người chơi hòa nhau`, {
    //     position: "top-right",
    //     autoClose: 2000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //   });
    // } else {
    //   toast(`Người chơi ${player} đã thắng!`, {
    //     position: "top-right",
    //     autoClose: 2000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //   });
    // }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    handleReset();
  };

  return (
    <div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <Button
            onClick={handleUndo}
            disabled={currentMoveIndex <= 0}
            style={{ background: "blue", color: "white" }}
          >
            Đi lại
          </Button>
          <div style={{ flex: "1" }}>
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
          </div>
        </div>
      </div>
      {/* {winner && (
        <div style={{ textAlign: "center" }}>
          <ToastContainer />
          {winner === "Draw" ? (
            <h2>Hòa nhau! </h2>
          ) : (
            <h2>Người thắng: {`${winner} wins`}</h2>
          )}

          <Button onClick={handleReset}>Reset</Button>
        </div>
      )} */}

      {showPopup && (
        <Modal
          title={
            winner === "Draw" ? "Hòa nhau!" : `Người thắng: ${winner} wins`
          }
          visible={showPopup}
          onCancel={handlePopupClose}
          footer={[
            <Button key="reset" onClick={handlePopupClose}>
              Reset
            </Button>,
          ]}
        ></Modal>
      )}
    </div>
  );
};
export default CaroBoard;
