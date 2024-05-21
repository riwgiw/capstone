import Image from "next/image";
import Link from 'next/link';
import Dragdrop from "./components/Dragdrop";
import Login from "./components/Login";

function Home() {
  
  
  return (
    <>
      <div>
      
        <div className='flex justify-center items-center p-10' >
          <Dragdrop className='p-16 mt-10 border border-neutral-700 rounded-xl' />
        </div>
      </div>

    </>
  );
}

export default Home