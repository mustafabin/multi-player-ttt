"use client"
import Link from "next/link"
import "../../styles/normal.scss"
import NormalBoard from "./NormalBoard"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import { API_URL } from "../hard/utils"
export default function ClientSidePage() {
  const router = useRouter()

  let handleChallenge = async () => {
    try {
      let response = await fetch(`https://${API_URL}/create`)
      let data = await response.json()
      console.log("creating room", data)
      let { roomID } = data
      router.push(`/multi?room=${roomID}`)
    } catch (error) {
      Swal.fire("Error", "Couldnt generate room ID", "error")
    }
  }
  let handleJoin = () => {
    Swal.fire({
      title: "Enter Room ID",
      input: "text",
      inputLabel: "Room ID",
      inputPlaceholder: "Enter Room ID",
      showCancelButton: true,
    }).then((response) => {
      if (response.isConfirmed) {
        let roomID = response.value
        router.push(`/multi?room=${roomID}`)
      }
    })
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
        <button onClick={handleChallenge}>Challenge a friend ?</button>
        <button onClick={handleJoin}>Have a code ?</button>
      </div>
    </div>
  )
}
