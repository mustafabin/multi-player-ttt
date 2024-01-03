"use client"
import Link from "next/link"
import "../../../styles/hard.scss"
import { createInitialBoard, createInitialBoardStats } from "@/app/hard/utils"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Board from "./Board"
const Hard = () => {
  const gameBoardStats = useRef(createInitialBoardStats())
  const [currentTurn, setCurrentTurn] = useState("X")
  const [gameOver, setGameOver] = useState(false)
  const [activeGrid, setActiveGrid] = useState(-1)
  const [gameBoard, setGameBoard] = useState(createInitialBoard())
  const params = useSearchParams()

  useEffect(() => {
    const room = params.get("room")
    console.log("room", room)
  }, [])
  let handleMessage = (data:any) => {

  }
  return (
    <div className='Hard'>
      <div className='Hard-nav'>
        <Link href='/'>Home</Link>
      </div>
      <p>9D ULTIMATE</p>
      <p>{activeGrid === -1 ? "Click on any cell on the board" : "Focus on the highlighted grid"}</p>
      <p>
        <span style={{ color: currentTurn === "X" ? "red" : "blue" }}> {currentTurn + "'"}</span>s turn
      </p>
      <Board gameBoard={gameBoard} activeGrid={activeGrid} websocketHandler={handleMessage}/>
    </div>
  )
}
export default Hard
