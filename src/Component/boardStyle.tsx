import styled from "styled-components";

import "react-toastify/dist/ReactToastify.css";

export const Board = styled.div<{ size: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.size}, 50px);
  grid-template-rows: repeat(${(props) => props.size}, 50px);
  gap: 2px;

  justify-content: center;
`;

export const Cell = styled.button<any>`
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

export const createInitialBoard = (size: number): string[][] => {
  const initialBoard: string[][] = [];
  for (let i = 0; i < size; i++) {
    initialBoard.push(Array.from({ length: size }, () => ""));
  }
  return initialBoard;
};
