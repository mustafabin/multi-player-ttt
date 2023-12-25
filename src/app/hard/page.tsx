"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import "../../styles/hard.scss"
import { useState, useRef } from "react"
import Swal from "sweetalert2"
const createInitialBoard = () =>
  Array(9)
    .fill(null)
    .map(() =>
      Array(3)
        .fill(null)
        .map(() => Array(3).fill(""))
    )
const createInitialBoardStats = () => {
  const stats = new Map()
  for (let i = 0; i < 9; i++) {
    stats.set(i, { winner: "", draw: false })
  }
  return stats
}
const checkWinner = (board: Array<Array<string>>, currentMove: Array<number>, player: string) => {
  let [currentRow, currentCol] = currentMove
  // check rows and columns
  if (board[currentRow].every((cel: string) => cel === player)) return player
  if (board.every((row: Array<string>) => row[currentCol] === player)) return player
  // check diagonals
  if (currentRow === currentCol && board.every((row: Array<string>, col: number) => row[col] === player)) return player
  if (currentRow + currentCol === 2 && board.every((row: Array<string>, col: number) => row[2 - col] === player)) return player
  // no winner
  return ""
}
const convertMapToArray = (mapToConvert: Map<number, { winner: string; draw: boolean }>) => {
  let convertedArray = Array(3)
    .fill(null)
    .map(() => Array(3).fill(null))
  mapToConvert.forEach((value, key) => {
    let row = Math.floor(key / 3)
    let col = key % 3
    convertedArray[row][col] = value.draw ? "-" : value.winner
  })
  return convertedArray
}
const Hard = () => {
  const router = useRouter()
  const [activeGrid, setActiveGrid] = useState(-1)
  const [gameBoard, setGameBoard] = useState(createInitialBoard())
  const gameBoardStats = useRef(createInitialBoardStats())
  const [currentTurn, setCurrentTurn] = useState("X")
  const [gameOver, setGameOver] = useState(false)
  let restartGame = () => {
    setGameOver(false)
    setCurrentTurn("X")
    setGameBoard(createInitialBoard())
    setActiveGrid(-1)
    gameBoardStats.current = createInitialBoardStats()
  }
  let handleCellClick = (gridIndex: number, rowIndex: number, colIndex: number) => {
    // ? check if the game is over
    if (gameOver) return Swal.fire("Restart?", "Click to Clear Board", "question").then((response) => response.isConfirmed && restartGame())
    // ? check if ur allowed to play in the grid
    if (activeGrid !== -1 && activeGrid !== gridIndex) return
    // ? check if the cell just clicked is occupied and if it isnt already won
    let currentGameBoardStats = gameBoardStats.current
    if (
      gameBoard[gridIndex][rowIndex][colIndex] === "" &&
      (currentGameBoardStats.get(gridIndex).winner !== "X" || currentGameBoardStats.get(gridIndex).winner !== "O")
    ) {
      //! winner logic
      let newBoard = gameBoard.map((grid) => grid.map((row) => row.map((cell) => cell)))
      newBoard[gridIndex][rowIndex][colIndex] = currentTurn
      setGameBoard(newBoard)
      setCurrentTurn(currentTurn === "X" ? "O" : "X")

      let isWinner = checkWinner(newBoard[gridIndex], [rowIndex, colIndex], currentTurn)
      if (isWinner) {
        console.log("Winner of a micro board ", gridIndex)
        currentGameBoardStats.set(gridIndex, { winner: currentTurn, draw: false })
        gameBoardStats.current = currentGameBoardStats
        let macroBoard = convertMapToArray(currentGameBoardStats)
        let macroWinner = checkWinner(macroBoard, [Math.floor(gridIndex / 3), gridIndex % 3], currentTurn)
        console.log("Macro board", macroBoard)
        console.log("Macro winner", macroWinner)
        if (macroWinner) {
          Swal.fire("GAME OVER", `${currentTurn} won the game click the button to restart`, "info").then(
            (response) => response.isConfirmed && restartGame()
          )
          setGameOver(true)
        }
      }
      // check if the grid being set active to is already won or in a draw
      // if it is then set the active grid to -1
      let nextFocus = rowIndex * 3 + colIndex
      if (
        currentGameBoardStats.get(nextFocus).draw ||
        currentGameBoardStats.get(nextFocus).winner === "X" ||
        currentGameBoardStats.get(nextFocus).winner === "O"
      ) {
        setActiveGrid(-1)
      } else {
        setActiveGrid(nextFocus)
      }
    }
  }
  return (
    <div className='Hard'>
      <div className='Hard-nav'>
        <Link href='/'>Home</Link>
      </div>
      <p>9D ULTIMATE</p>
      <p>{activeGrid === -1 ? "Click on any cell on the board" : "Focus on the highlighted grid"}</p>
      <p>
        <span style={{ color: currentTurn === "X" ? "red" : "blue" }}> {currentTurn}</span>'s turn
      </p>
      <div className='Hard-board'>
        {gameBoard.map((grid, i) => (
          <DisplayMiniGrid grid={grid} index={i} key={i} activeGrid={activeGrid} handleCellClick={handleCellClick} />
        ))}
      </div>
      <div className='Hard-bottom'>
        <button onClick={() => router.push("/multi")}>Want to challenge a friend ?</button>
      </div>
    </div>
  )
}
export default Hard
const DisplayMiniGrid = ({ grid, index, activeGrid, handleCellClick }: DisplayMiniGridProps) => {
  return (
    <div className={`Hard-board-mini-board  ${activeGrid === index && "Hard-active-grid"}`}>
      {grid.map((row, i) => (
        <div className='Hard-board-mini-board-row' key={i}>
          {row.map((cell, j) => (
            <div className='Hard-board-mini-board-row-cell' key={j} onClick={() => handleCellClick(index, i, j)}>
              <span style={{ color: cell === "X" ? "red" : "blue" }}> {cell}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
interface DisplayMiniGridProps {
  grid: string[][]
  index: number
  activeGrid: number
  handleCellClick: (gridIndex: number, rowIndex: number, colIndex: number) => void
}
