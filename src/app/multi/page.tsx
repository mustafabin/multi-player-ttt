"use client"
import Swal from "sweetalert2"
import { useEffect, useRef, useState } from "react"
import "../../styles/normal.scss"
import { useSearchParams } from "next/navigation"
import { API_URL, Player, ResultType } from "../hard/utils"
import Board from "./Board"

const MulitplayerNormal = () => {
  const params = useSearchParams()
  const socketRef = useRef<WebSocket | null>(null)
  const hasConnectedRef = useRef(false)

  const [gameBoard, setGameBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ])
  const [isOver, setIsOver] = useState({
    isDraw: false,
    winner: "",
  })
  const [player, setPlayer] = useState<Player | undefined>(undefined)
  const [currentTurn, setCurrentTurn] = useState<Player>("X")
  let handleSocketOpen = (event: Event) => {
    console.log("Connected to server ", event)
  }
  let handleMessage = (event: MessageEvent) => {
    // todo chat feature
    let data = JSON.parse(event.data) as ResultType
    switch (data.status) {
      case "update":
        handleWebsocketUpdate(data)
        break
      case "assign":
        setPlayer(data.player)
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
  let handleWebsocketUpdate = (data: ResultType) => {
    setGameBoard(data.board)
    setCurrentTurn(data.currentTurn)
    console.log("data", data)
    setIsOver({ isDraw: data.isDraw, winner: data.winner })
  }
  useEffect(() => {
    if (!isOver.isDraw && isOver.winner === "") return
    let titleText = player === isOver.winner ? "Winner" : "You Lost"
    if (isOver.isDraw) titleText = "Its a draw"
    Swal.fire(titleText, "", isOver.isDraw ? "info" : player === isOver.winner ? "success" : "error")
  }, [isOver])
  useEffect(() => {
    const room = params.get("room")
    if (hasConnectedRef.current) {
      return
    }
    socketRef.current = new WebSocket(`ws://${API_URL}/join?room=${room}`)
    const socket = socketRef.current
    socket.onclose = (event) => console.log("closed", event)
    socket.onopen = handleSocketOpen
    socket.onmessage = handleMessage
    socket.onerror = () => Swal.fire("Error", "Error connecting to match", "error")
    hasConnectedRef.current = true

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log("closing socket")
        socket.close()
        socketRef.current = null
      }
    }
  }, [])
  let sendWebsocketMessage = (data: any) => {
    let socket = socketRef.current
    if (socket === null) return Swal.fire("Error", "Lost connection to match", "error")
    socket.send(JSON.stringify(data))
  }

  return (
    <Board
      websocketHandler={sendWebsocketMessage}
      roomCode={params.get("room")}
      isOver={isOver}
      player={player}
      currentTurn={currentTurn}
      gameBoard={gameBoard}
    />
  )
}
export default MulitplayerNormal
