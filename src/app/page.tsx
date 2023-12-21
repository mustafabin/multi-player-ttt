import Image from "next/image"
import "../styles/main.scss"
import Link from "next/link"

export default function Home() {
  return (
    <div className='Home'>
      <header className='Home-header'>
        <h1>Tic-Tac-Tactics</h1>
        <p>Choose your game mode: Classic or Ultimate Challenge.</p>
      </header>
      <Image
        className='w-full max-w-xs h-auto mx-auto md:max-w-sm lg:max-w-md'
        alt='Rubix cube with an X and O as the side faces'
        src='/hero.svg'
        width={300}
        height={300}
        layout='responsive'
      />
      <div className='Home-navbar'>
        <Link href='/normal'>Normal</Link>
        <Link href='/hard'>9-D Ultimate</Link>
      </div>
    </div>
  )
}
