import Image from "next/image";
import Link from 'next/link';
import Dragdrop from "./components/Dragdrop";
import Login from "./components/Login";

function Home() {
  
  
  return (
    <>
      <div>
        <div className='w-full flex justify-center items-center mt-5' >
          <Dragdrop/>
        </div>
      </div>

    </>
  );
}

export default Home