"use client"
import Swal from "sweetalert2"
import { useEffect, useRef, useState } from "react"
import "../../styles/normal.scss"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

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
  const playerRef = useRef<"X" | "O">("X")
  let handleSocketOpen = (event: Event) => {
    console.log("Connected to server ", event)
  }
  let handleMessage = (event: MessageEvent) => {
    console.log("message", event.data)
    return
    let data = JSON.parse(event.data)
    if (data["status"] === "error") return Swal.fire("Error", data["error"], "error")
    if (data["status"] === "connected") return (playerRef.current = data["player"])
    // setGameBoard(data["board"])
    if (data["status"] === "update") {
      setGameBoard(data["board"])
      if (data["winner"]) {
        console.log("winner is", data["winner"], "player is", playerRef.current)
        Swal.fire(
          playerRef.current === data["winner"] ? "Winner" : "You Lost",
          data["winner"] + " won the game",
          playerRef.current === data["winner"] ? "success" : "error"
        ).then((confirm) => {
          console.log("confirm", confirm)
          setGameBoard([
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
          ])
        })
        return
      }
      if (data["draw"]) return setIsOver({ isDraw: true, winner: "" })
    }
  }
  useEffect(() => {
    const room = params.get("room")
    if (hasConnectedRef.current) {
      return
    }
    socketRef.current = new WebSocket(`ws://192.168.8.141:3030/join?room=${room}`)
    const socket = socketRef.current
    socket.onclose = (event) => console.log("closed", event)
    socket.onopen = handleSocketOpen
    socket.onmessage = handleMessage
    socket.onerror = () => Swal.fire("Error", "Error connecting to match", "error")
    hasConnectedRef.current = true

    return () => {
      console.log("closing socket")
      if(socket && socket.readyState === WebSocket.OPEN){
        socket.close()
        socketRef.current = null
      }
    }
  }, [])

  let handleDrawReset = () => {}

  let handlePlayerWin = () => {}

  let playMove = (row: number, col: number) => {
    let socket = socketRef.current
    if (socket === null) return Swal.fire("Error", "Lost connection to match", "error")
    socket.send(
      JSON.stringify({
        coords: [row, col],
        player: playerRef.current,
        type: "normal",
      })
    )
  }
  return (
    // div with tail wind classes that is a flex div
    <div className='MulitplayerNormal'>
      <div className='MulitplayerNormal-nav'>
        <Link href='/'>Home</Link>
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

      {isOver.isDraw && (
        <div className='Normal-board-bottom flex-col p-2'>
          <h1>Its a draw</h1>
          <button onClick={handleDrawReset}>Play Again</button>
        </div>
      )}
    </div>
  )
}
export default MulitplayerNormal
