import Link from "next/link"
import "../../styles/normal.scss"
import NormalBoard from "./NormalBoard"
export default function Normal() {
  return (
    <div className='Normal'>
      <div className='Normal-nav'>
        <Link href='/'>Home</Link>
      </div>
      <div className='Normal-content'>
        <p>Classical game of Tic-Tac-Toe</p>
        <NormalBoard />
      </div>
      <div className='Normal-bottom'>
        <button>Want to challenge a friend ?</button>
      </div>
    </div>
  )
}
