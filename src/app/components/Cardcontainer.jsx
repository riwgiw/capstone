import React, { useState } from 'react';
import Image from 'next/image';
import defaultPic from '../../../public/Imges/LOGO.png';
import aiPic from '../../../public/Imges/Ai.png';
import HumenPic from '../../../public/Imges/Humen.png';

const Cardcontainer = ({ photo, types }) => {
  const [correctModalOpen, setCorrectModalOpen] = useState(false);
  const [wrongModalOpen, setWrongModalOpen] = useState(false);

  const handleCorrectModalOpen = () => {
    setCorrectModalOpen(true);
  }

  const handleWrongModalOpen = () => {
    setWrongModalOpen(true);
  }

  const handleCloseModals = () => {
    setCorrectModalOpen(false);
    setWrongModalOpen(false);
  }

  return (
    <div className="max-w-sm rounded-lg shadow-lg overflow-hidden bg-none relative">
      <Image className="w-full h-64 object-cover" src={photo || defaultPic} alt="Card Image" />
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-4 p-2">
        {types ? (
          <>
            <div className="flex justify-center bg-none text-white font-semibold px-4 py-2 rounded hover:bg-red-400 border border-white" onClick={handleCorrectModalOpen}>
              <div className="h-5 w-5 flex items-center justify-center rounded-full">
                <Image src={aiPic} alt="AI Icon" className="h-6 w-6" />
              </div>
            </div>
            <div className="flex justify-center bg-none text-white font-semibold px-4 py-2 rounded hover:bg-red-400 border border-white" onClick={handleWrongModalOpen}>
              <div className="h-5 w-5 flex items-center justify-center rounded-full">
                <Image src={HumenPic} alt="Human Icon" className="h-6 w-6 rounded-full" />
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center bg-gray-500 text-white font-semibold px-4 py-2 rounded hover:bg-gray-400">
            Unknown
          </div>
        )}
      </div>
      {correctModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center" onClick={handleCloseModals}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg z-10">
            <p className="text-2xl text-center font-semibold text-green-500 mb-4">Correct Answer</p>
            <p className="text-lg text-center">Congratulations! You got the correct answer.</p>
          </div>
        </div>
      )}
      {wrongModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center" onClick={handleCloseModals}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg z-10">
            <p className="text-2xl text-center font-semibold text-red-500 mb-4">Wrong Answer</p>
            <p className="text-lg text-center">Oops! Better luck next time.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cardcontainer;
