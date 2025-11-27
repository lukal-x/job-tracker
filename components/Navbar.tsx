"use client"
import { ModeToggle } from './theme-toggler'

const Navbar = () => {
  return (
    <div className='w-full h-[60px] z-9999 flex items-center px-10 justify-end'>
        <ModeToggle />
    </div>
  )
}

export default Navbar