import Link from "next/link"
import { Player } from "../hard/utils"
import Swal, { SweetAlertResult } from "sweetalert2"
import copy from "copy-to-clipboard"
import { useState } from "react"

const Board = ({ websocketHandler, roomCode, isOver, player, currentTurn, gameBoard }: BoardProps) => {
  let yourTurn = currentTurn === player
  let playMove = (row: number, col: number) => {
    if (yourTurn === false) return Swal.fire("Wait", "Its not your turn", "info")
    websocketHandler({ messageType: "game", actionType: "move", coords: [row, col] })
  }
  let handleReset = () => {
    websocketHandler({ messageType: "game", actionType: "reset" })
  }

  return (
    <div className='MulitplayerNormal'>
      <div className='Normal-nav'>
        <Link href='/'>Home</Link>
      </div>
      <div className='MulitplayerNormal-top'>
        {yourTurn ? (
          <p> Play Your Move </p>
        ) : (
          <p>
            Wait for <span style={{ color: currentTurn === "X" ? "red" : "blue" }}> {currentTurn}</span>
          </p>
        )}
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
      <p>
        You are <span style={{ color: player === "X" ? "red" : "blue" }}> {player}</span>
      </p>
      <div className='MulitplayerNormal-code Normal-bottom'>
        <h1>
          ROOM CODE: <span>{roomCode}</span>
        </h1>
        <CopyButton player={player} />
      </div>
    </div>
  )
}
interface BoardProps {
  websocketHandler: (data: any) => Promise<SweetAlertResult<any>> | undefined
  player: Player | undefined
  currentTurn: Player
  roomCode: string | null
  isOver: {
    isDraw: boolean
    winner: string
  }
  gameBoard: string[][]
}
const CopyButton = ({ player }: { player: Player | undefined }) => {
  const [copied, setCopied] = useState(false)
  return (
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
  )
}
export default Board
