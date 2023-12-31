"use client"
import Swal from "sweetalert2"
import { useEffect, useRef, useState } from "react"
import "../../styles/normal.scss"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { API_URL, Player, ResultType } from "../hard/utils"

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
  let playMove = (row: number, col: number) => {
    sendWebsocketMessage({ messageType: "game", actionType: "move", coords: [row, col] })
  }
  let handleReset = () => {
    sendWebsocketMessage({ messageType: "game", actionType: "reset" })
  }
  return (
    <div className='MulitplayerNormal'>
      <div className='MulitplayerNormal-nav'>
        <Link href='/'>Home</Link>
      </div>
      <div className='MulitplayerNormal-top'>
        <p>
          You are <span style={{ color: player === "X" ? "red" : "blue" }}> {player}</span>
        </p>
      </div>
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
      </div>
      {(isOver.isDraw || isOver.winner) && (
        <div className='Normal-board-bottom flex-col p-2'>
          <button onClick={handleReset}>Play Again</button>
        </div>
      )}
      <h1 className="Normal-code">ROOM CODE: <span>{params.get("room")}</span></h1>
    </div>
  )
}
export default MulitplayerNormal
