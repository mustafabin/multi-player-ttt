"use client"
import { useEffect, useRef, useState } from "react"
import { socket } from './socket';

const NormalBoard = () => {
  useEffect(() => {
    function onConnect() {
      console.log('connected')
    }

    function onDisconnect() {
      console.log('disconnected')
    }

    function onMessage(value:any) {
      console.log('askdfasd message', value)
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message', onMessage);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message', onMessage);
    };
  }, []);

  const dialogRef = useRef<HTMLDialogElement>(null)
  const [gameBoard, setGameBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ])
  const [turn, setTurn] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState("")
  const [isDraw, setIsDraw] = useState(false)
  let deepCopyBoard = (boardToCopy: Array<Array<string>>) => {
    return boardToCopy.map((row) => row.map((cell) => cell))
  }
  let checkDraw = (board: Array<Array<string>>) => {
    return board.every((row) => row.every((cell) => cell !== ""))
  }
  let playMove = (row: number, col: number) => {
    if (gameBoard[row][col] === "" && winner === "") {
      const newBoard = deepCopyBoard(gameBoard)
      newBoard[row][col] = turn
      setGameBoard(newBoard)

      let currentWinner = checkWinner(newBoard, [row, col], turn)

      if (currentWinner) {
        dialogRef.current && dialogRef.current.showModal()
        setWinner(currentWinner)
      } else if (checkDraw(newBoard)) {
        setIsDraw(true)
      } else {
        setTurn(turn === "X" ? "O" : "X")
      }
    }
  }
  let checkWinner = (board: Array<Array<string>>, currentMove: Array<number>, currentTurn: string) => {
    // check based on current move to avoid extra work
    // if a move doesnt require a diagonal check no need to no extra work
    // check current column and row
    // check if diagonals are even needed

    let [currentRow, currentCol] = currentMove
    // checking current row
    if (board[currentRow].every((cel) => cel === turn)) return currentTurn

    // checking current col
    if (board.every((row) => row[currentCol] === turn)) return currentTurn

    // check right diagonal only if the coords are played on a diagon
    if (currentRow === currentCol && board.every((row, col) => row[col] === turn)) return currentTurn

    // left diagonal starting from top right
    if (currentRow + currentCol === 2 && board.every((row, col) => row[2 - col] === turn)) return currentTurn

    return ""
  }
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
      {isDraw ? (
        <div className='Normal-board-bottom flex-col p-2'>
          <h1>Its a draw</h1>
          <button
            onClick={() => {
              setIsDraw(false)
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
      ) : (
        <div className='Normal-board-bottom'>
          Its <span style={{ color: turn === "X" ? "red" : "blue" }}>{turn}</span> turn
        </div>
      )}
      {winner && (
        <dialog ref={dialogRef}>
          <div className='Normal-board-dialog'>
            <p>Winner</p>
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
