"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import "../../styles/hard.scss"
import { useState, useRef } from "react"
import Swal from "sweetalert2"
import { checkDraw, checkWinner, convertMapToArray, createInitialBoard, createInitialBoardStats } from "./utils"

const Hard = () => {
  const router = useRouter()
  const [activeGrid, setActiveGrid] = useState(-1)
  const [gameBoard, setGameBoard] = useState(createInitialBoard())
  const gameBoardStats = useRef(createInitialBoardStats())
  const [currentTurn, setCurrentTurn] = useState("X")
  const [gameOver, setGameOver] = useState(false)


  let handleCellClick = (gridIndex: number, rowIndex: number, colIndex: number) => {
    // ? check if the game is over
    if (gameOver) return Swal.fire("Restart?", "Click to Clear Board", "question").then((response) => response.isConfirmed && restartGame())
    // ? check if ur allowed to play in the grid
    if (activeGrid !== -1 && activeGrid !== gridIndex) return
    // ? check if the cell just clicked is occupied and if it isnt already won
    let currentGameBoardStats = gameBoardStats.current
    if (
      gameBoard[gridIndex][rowIndex][colIndex] === "" &&
      currentGameBoardStats.get(gridIndex).winner === "" &&
      currentGameBoardStats.get(gridIndex).draw === false
    ) {
      // deep copy gameboard
      let newBoard = gameBoard.map((grid) => grid.map((row) => row.map((cell) => cell)))
      newBoard[gridIndex][rowIndex][colIndex] = currentTurn
      setGameBoard(newBoard)
      setCurrentTurn(currentTurn === "X" ? "O" : "X")

      // ! checking if the mini board is won
      let microWinner = checkWinner(newBoard[gridIndex], [rowIndex, colIndex], currentTurn)
      if (microWinner) {
        console.log("Winner of a micro board ", gridIndex)

        // ? updating and valdating the macro board when a mini board is won
        currentGameBoardStats.set(gridIndex, { winner: currentTurn, draw: false })
        let macroBoard = convertMapToArray(currentGameBoardStats)
        let macroWinner = checkWinner(macroBoard, [Math.floor(gridIndex / 3), gridIndex % 3], currentTurn)
        handleGameOver(macroWinner, macroBoard)
        // ! check a macro board draw whenever a micro board is full or won over
      } else if (checkDraw(newBoard[gridIndex])) {
        currentGameBoardStats.set(gridIndex, { winner: "-", draw: true })
        let macroDrawBoard = convertMapToArray(currentGameBoardStats)
        console.log("Draw in micro board", gridIndex)
        if (checkDraw(macroDrawBoard)) {
          Swal.fire("GAME OVER", `Its a draw click the button to restart`, "info").then((response) => response.isConfirmed && restartGame())
          setGameOver(true)
        }
      }
      // check if the grid being set active to is already won or in a draw
      calcFocusGrid(rowIndex,colIndex,currentGameBoardStats)
    }
  }


  function calcFocusGrid (microRow:number, microCol:number,macroBoardStats:Map<any, any>){
    let nextFocus = microRow * 3 + microCol
    let macroCellStats = macroBoardStats.get(microRow * 3 + microCol)
      if (
        macroCellStats.draw ||
        macroCellStats.winner === "X" ||
        macroCellStats.winner === "O"
      ) {
        setActiveGrid(-1)
      } else {
        setActiveGrid(nextFocus)
      }
  }
  function restartGame () {
    setGameOver(false)
    setCurrentTurn("X")
    setGameBoard(createInitialBoard())
    setActiveGrid(-1)
    gameBoardStats.current = createInitialBoardStats()
  }

  function handleGameOver (winner: string, board: Array<Array<string>>) {
    if (winner) {
      Swal.fire("GAME OVER", `${currentTurn} won the game click the button to restart`, "info").then(
        (response) => response.isConfirmed && restartGame()
      )
      return setGameOver(true)
    }
    let isDraw = checkDraw(board)
    if (isDraw) {
      Swal.fire("GAME OVER", `Its a draw click the button to restart`, "info").then((response) => response.isConfirmed && restartGame())
      return setGameOver(true)
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
