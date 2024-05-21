import React from 'react';
import './Nav.css';
import Login from './Login';

function Nav() {
  return (
    <div>
      <div className='w-full h-96 bg-custom bg-slate-800 bg-opacity-60 rounded-bl-[35px] rounded-br-[35px] p-7 pt-4 flex flex-col justify-between'>
        <div className='flex justify-between items-center'>
          <div className='text-2xl text-white'>AIMAI</div>
          <div className='flex text-white text-xl font-sans'>
            <div className='mr-10'>Home</div>
            <div>Content</div>
          </div>
          <div>
            <Login></Login>
          </div>
        </div>
        <div className='flex-grow flex flex-col justify-center items-center'>
          <div className='text-white text-3xl font-sans mb-4 m-10'>
            VERIFICATION WITH AI DETECTION
          </div>
          <div className='m-6 text-white text-l font-sans border border-white rounded-3xl px-4 py-2'>
            ADEIO
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default Nav;
