import React, { useState } from "react";
import Image from "next/image";
import aiPic from "../../../public/Imges/Ai.png";
import HumenPic from "../../../public/Imges/Humen.png";
import { useSession } from "next-auth/react";

const Cardcontainer = ({ photo, result, id }) => {
  const [correctModalOpen, setCorrectModalOpen] = useState(false);
  const [wrongModalOpen, setWrongModalOpen] = useState(false);
  const { data: session } = useSession();

  const handleCloseModals = () => {
    setCorrectModalOpen(false);
    setWrongModalOpen(false);
  };

  const updateScore = async () => {
    if (!session) {
      console.error("No session found.");
      return;
    }

    try {
      const response = await fetch("/api/addScore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Error updating score:", data.message);
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  // const updateAi = async () => {
  //   if (!session) {
  //     console.error("No session found.");
  //     return;
  //   }

  //   try {
  //     const response = await fetch("/api/addAi", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ id }),
  //     });

  //     const data = await response.json();
  //     if (!response.ok) {
  //       console.error("Error updating AI click:", data.message);
  //     } else {
  //       console.log("AI click updated successfully");
  //     }
  //   } catch (error) {
  //     console.error("Error updating AI click:", error);
  //   }
  // };

  // const updateHuman = async () => {
  //   if (!session) {
  //     console.error("No session found.");
  //     return;
  //   }

  //   try {
  //     const response = await fetch("/api/addHuman", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ id }),
  //     });

  //     const data = await response.json();
  //     if (!response.ok) {
  //       console.error("Error updating human click:", data.message);
  //     } else {
  //       console.log("Human click updated successfully");
  //     }
  //   } catch (error) {
  //     console.error("Error updating human click:", error);
  //   }
  // };

  const aicheck = () => {
    if (result === "ai") {
      setCorrectModalOpen(true);
      updateScore();
      // updateAi();
    } else {
      setWrongModalOpen(true);
    }
  };

  const humencheck = () => {
    if (result === "human") {
      setCorrectModalOpen(true);
      updateScore();
      // updateHuman();
    } else {
      setWrongModalOpen(true);
    }
  };

  return (
    <div className="max-w-sm rounded-lg shadow-lg overflow-hidden bg-none relative">
      <Image
        className="w-full h-64 object-cover"
        src={photo}
        width={500}
        height={500}
        alt="Card Image"
      />
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center gap-4 p-2">
        {result ? (
          <>
            <div
              className="bg-slate-700 flex justify-center bg-none text-white font-semibold px-4 py-2 rounded hover:bg-green-500 border border-white"
              onClick={aicheck}
            >
              <div className="h-5 w-5 flex items-center justify-center rounded-full">
                <Image src={aiPic} alt="AI Icon" className="h-6 w-6" />
              </div>
            </div>
            <div
              className="bg-slate-700 flex justify-center bg-none text-white font-semibold px-4 py-2 rounded hover:bg-red-500 border border-white"
              onClick={humencheck}
            >
              <div className="h-5 w-5 flex items-center justify-center rounded-full">
                <Image
                  src={HumenPic}
                  alt="Human Icon"
                  className="h-6 w-6 rounded-full"
                />
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
        <div
          className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center"
          onClick={handleCloseModals}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg z-10">
            <p className="text-2xl text-center font-semibold text-green-500 mb-4">
              Correct Answer
            </p>
            <p className="text-lg text-center">
              Congratulations! You got the correct answer.
            </p>
          </div>
        </div>
      )}
      {wrongModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center"
          onClick={handleCloseModals}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-6 rounded-lg z-10">
            <p className="text-2xl text-center font-semibold text-red-500 mb-4">
              Wrong Answer
            </p>
            <p className="text-lg text-center">Oops! Better luck next time.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cardcontainer;
