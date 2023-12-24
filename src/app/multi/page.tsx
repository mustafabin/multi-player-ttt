"use client"
import Swal from "sweetalert2"
import { useEffect, useRef, useState } from "react"
import "../../styles/normal.scss"

let socket: WebSocket | null = null
const MulitplayerNormal = () => {
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
    if (socket === null) {
      socket = new WebSocket("ws://192.168.8.141:3030/websocket")
      socket.onclose = (event) => console.log("closed", event)
      socket.onopen = (event) => handleSocketOpen(event)
      socket.onmessage = (event) => handleMessage(event)
      socket.onerror = (event) => console.log("error", event)
    }

    return () => {
      console.log("closing socket")
      socket?.close()
      socket = null
    }
  }, [])
  let handleDrawReset = () => {}

  let handlePlayerWin = () => {}

  let playMove = (row: number, col: number) => {
    if (socket === null) return Swal.fire("Error", "Lost connection to match", "error")
    socket.send(
      JSON.stringify({
        coords: [row, col],
        player: playerRef.current,
      })
    )
  }
  return (
    // div with tail wind classes that is a flex div
    <div className='MulitplayerNormal'>
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
