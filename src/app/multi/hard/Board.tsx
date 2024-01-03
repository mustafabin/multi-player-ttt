import { SweetAlertResult } from "sweetalert2"

const Board = ({ gameBoard, activeGrid, websocketHandler }: BoardProps) => {
  let handleCellClick = (gridIndex: number, rowIndex: number, colIndex: number) => {
    console.log("gridIndex", gridIndex)
    console.log("rowIndex", rowIndex)
    console.log("colIndex", colIndex)
  }

  return (
    <div className='Hard-board'>
      {gameBoard.map((grid, i) => (
        <DisplayMiniGrid grid={grid} index={i} key={i} activeGrid={activeGrid} handleCellClick={handleCellClick} />
      ))}
    </div>
  )
}
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
interface BoardProps {
  websocketHandler: (data: any) => Promise<SweetAlertResult<any>> | undefined | void
  activeGrid: number
  gameBoard: string[][][]
}
interface DisplayMiniGridProps {
  grid: string[][]
  index: number
  activeGrid: number
  handleCellClick: (gridIndex: number, rowIndex: number, colIndex: number) => void
}

export default Board