import { SweetAlertResult } from "sweetalert2"

const Board = ({ gameBoard, activeGrid, websocketHandler,macroBoardMap }: BoardProps) => {
  let handleCellClick = (gridIndex: number, rowIndex: number, colIndex: number) => {
    websocketHandler({ messageType: "game", actionType: "move", coords: [rowIndex, colIndex], gridIndex })
  }

  return (
    <div className='Hard-board'>
      {gameBoard.map((grid, i) => (
        <DisplayMiniGrid grid={grid} index={i} key={i} activeGrid={activeGrid} handleCellClick={handleCellClick} macroBoardMap={macroBoardMap} />
      ))}
    </div>
  )
}

const DisplayMiniGrid = ({ grid, index, activeGrid, handleCellClick, macroBoardMap }: DisplayMiniGridProps) => {
  return (
    <div className='Hard-board-mini-board'>
      {grid.map((row, i) => (
        <div className='Hard-board-mini-board-row' key={i}>
          {row.map((cell, j) => (
            <div
              className={`Hard-board-mini-board-row-cell ${activeGrid === index && "Hard-active-grid"} ${
                macroBoardMap.get(index)?.winner === "X" ? "Cell-Red" : macroBoardMap.get(index)?.winner === "O" && "Cell-Blue"
              } ${macroBoardMap.get(index)?.draw && "Cell-Draw"}`}
              key={j}
              onClick={() => handleCellClick(index, i, j)}>
              <span style={{ color: cell === "X" ? "red" : "blue" }}> {cell}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
interface BoardProps {
  websocketHandler: (data: any) => Promise<SweetAlertResult<any>> | undefined | void
  activeGrid: number
  gameBoard: string[][][]
  macroBoardMap: Map<any, any>
}
interface DisplayMiniGridProps {
  grid: string[][]
  index: number
  activeGrid: number
  handleCellClick: (gridIndex: number, rowIndex: number, colIndex: number) => void
  macroBoardMap: Map<any, any>
}


export default Board
