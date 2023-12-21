"use client"
import { useEffect, useRef, useState } from "react"

const NormalBoard = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [gameBoard, setGameBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ])
  const [turn, setTurn] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState("")

  let playMove = (row: number, col: number) => {
    if (gameBoard[row][col] === "" && winner === "") {
      const newBoard = [...gameBoard]
      newBoard[row][col] = turn
      setGameBoard(newBoard)
      setTurn(turn === "X" ? "O" : "X")
    }
  }
  let checkWinner = (board: Array<Array<string>>) => {
    // checking rows
    for (let i = 0; i < board.length; i++) {
      let row = board[i]
      // check row
      if (row[0] === row[1] && row[1] === row[2] && row[0] !== "") {
        return row[0]
      }
      // check column
      if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== "") {
        return board[0][i]
      }
      // check diagonals
      if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== "") {
        return board[0][0]
      }
      if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== "") {
        return board[0][2]
      }
    }
    return ""
  }
  useEffect(() => {
    setWinner(checkWinner(gameBoard))
  }, [gameBoard])
  return (
    <div className='Normal-board'>
      {gameBoard.map((row, i) => (
        <div className='Normal-board-row' key={i}>
          {row.map((cell, j) => (
            <div className='Normal-board-cell' key={j} onClick={() => playMove(i, j)}>
              <span style={{ color: cell === "X" ? "red" : "blue" }}> {cell}</span>
            </div>
          ))}
        </div>
      ))}
      <div className='Normal-board-bottom'>
        Its <span style={{ color: turn === "X" ? "red" : "blue" }}>{turn}</span> turn
      </div>
      {winner && (
        <dialog ref={dialogRef} open>
          <div className='Normal-board-dialog'>
            <p>
              Winner
            </p>
            <span style={{ color: winner === "X" ? "red" : "blue" }}> {winner}</span>
            <button
              onClick={() => {
                dialogRef.current && dialogRef.current.close()
                setWinner("")
                setGameBoard([
                  ["", "", ""],
                  ["", "", ""],
                  ["", "", ""],
                ])
                setTurn("X")
              }}>
              Play Again
            </button>
          </div>
        </dialog>
      )}
    </div>
  )
}
export default NormalBoard
