"use client"
import Link from "next/link"
import "../../../styles/hard.scss"
import { API_URL, Player, ResultType, createInitialBoard, createInitialBoardStats } from "@/app/hard/utils"
import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Board from "./Board"
import Swal from "sweetalert2"
import copy from "copy-to-clipboard"
const Hard = () => {
  const gameBoardStats = useRef(createInitialBoardStats())
  const socketRef = useRef<WebSocket | null>(null)
  const hasConnectedRef = useRef(false)
  const [currentTurn, setCurrentTurn] = useState("X")
  const [gameOver, setGameOver] = useState({
    winner: "",
    tie: false,
  })
  const [activeGrid, setActiveGrid] = useState(-1)
  const [gameBoard, setGameBoard] = useState(createInitialBoard())
  const [player, setPlayer] = useState<Player>("X")
  const params = useSearchParams()

  let handleWebsocketUpdate = (data: ResultType) => {
    setCurrentTurn(data.currentTurn)
    setGameBoard(data.board)
    if (typeof data.activeGrid === "number") setActiveGrid(data.activeGrid)
    let newGameStats = new Map(data.gameBoardStatsArray)
    gameBoardStats.current = newGameStats
    if (data.winner || data.isDraw) {
      setGameOver({
        winner: data.winner,
        tie: data.isDraw,
      })
      return Swal.fire("Game Over", data.isDraw ? "Tie" : `${data.winner} won`, data.isDraw ? "info" : "success")
    }
  }
  let handleMessage = (event: MessageEvent) => {
    let data = JSON.parse(event.data) as ResultType
    switch (data.status) {
      case "update":
        handleWebsocketUpdate(data)
        break
      case "assign":
        console.log("assign", data)
        if (!data.player) return Swal.fire("Error", "Error occured syncing to match", "error")
        if (typeof data.player === "string") setPlayer(data.player)
        handleWebsocketUpdate(data)
        break
      case "chat":
        break
      case "error":
        Swal.fire("Error", data.error, "error")
        break
      default:
        break
    }
  }
  useEffect(() => {
    const room = params.get("room")
    if (hasConnectedRef.current) {
      console.log("already connected")
    } else {
      socketRef.current = new WebSocket(`ws://${API_URL}/join?room=${room}`)
      const socket = socketRef.current
      socket.onmessage = handleMessage
      socket.onclose = (event) => console.log("closed", event)
      socket.onopen = () => console.log("connected to server")
      socket.onerror = () => Swal.fire("Error", "Error connecting to match", "error")
      hasConnectedRef.current = true
    }

    return () => {
      console.log("trying to close socket")
      const socket = socketRef.current
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("closing socket")
        socket.close()
        socketRef.current = null
      }
    }
  }, [])
  let websocketHandler = (data: any) => {
    let socket = socketRef.current
    if (socket === null) return Swal.fire("Error", "Lost connection to match", "error")
    socket.send(JSON.stringify(data))
  }
  return (
    <div className='Hard'>
      <div className='Hard-nav'>
        <Link href='/'>Home</Link>
      </div>
      <p className='Hard-instructions'>{activeGrid === -1 ? "Click on any cell on the board" : "Focus on the highlighted grid"}</p>
      <p>
        <span style={{ color: player === "X" ? "red" : "blue" }}> {currentTurn === player ? "Your Turn" : "Not Your Turn"}</span>
      </p>
      <Board gameBoard={gameBoard} activeGrid={activeGrid} websocketHandler={websocketHandler} macroBoardMap={gameBoardStats.current} />
      <CopyButton player={player} roomID={params.get("room") ?? ""} />
    </div>
  )
}
const CopyButton = ({ player, roomID }: { player: Player | undefined; roomID: string }) => {
  const [copied, setCopied] = useState(false)
  return (
    <>
      <div className='Hard-code'>
        <p>
          Room code: <span>{roomID}</span>
        </p>
        <button
          onClick={() => {
            copy(window.location.href, {
              onCopy: () => {
                setCopied(true)
              },
            })
          }}
          style={{ backgroundColor: player === "X" ? "rgb(84, 84, 255)" : "rgb(255, 74, 74)" }}>
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
    </>
  )
}
export default Hard
