'use client'
import React from 'react'
import Image from 'next/image'
import pic from '../../../public/Imges/LOGO.png'

function Cardcontainer() {
  return (
    <div className="max-w-sm rounded-lg shadow-lg overflow-hidden">
    <Image className="w-52 h-48 object-cover" src={pic} alt="Placeholder Image" />
    <div className="p-2 m-2 mb-2">
        <h2 className="text-xl  mb-2">Card Title</h2>
    <div className='flex justify-center item-center gap-4'>
    <div className="flex justify-center bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-400 w-20 ">
            AI
        </div>
        <div className="flex justify-center bg-green-500 text-white font-semibold px-4 py-2 rounded hover:bg-green-400 w-20">
            Human
        </div>
    </div>
        
    </div>
</div>
  )
}

export default Cardcontainer