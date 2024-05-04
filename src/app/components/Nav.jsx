import React from 'react'
import { FaCannabis } from "react-icons/fa";

function Nav() {

  return (
    <div className="flex justify-center">
        <nav className='w-full flex justify-between items-center h-24 bg-slate-800' >
            <a href="/"><FaCannabis className='ml-4 size-16 text-white' /></a>
            <ul className='flex mr-20'>
                <li><a className='mr-10 text-white text-xl font-sans' href="#">How to use</a></li>
                <li><a className='text-white text-xl font-sans' href="#">Teams</a></li>
            </ul>
        </nav>
    </div>
  )
}

export default Nav