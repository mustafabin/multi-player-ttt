"use client"
import Link from "next/link"
import "../../styles/normal.scss"
import NormalBoard from "./NormalBoard"
import { useRouter } from "next/navigation"
export default function Normal() {
  const router = useRouter()
  let handleClick = () => {

  }
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
        <button onClick={()=>router.push("/multi")}>Want to challenge a friend ?</button>
      </div>
    </div>
  )
}
