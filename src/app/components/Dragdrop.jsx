"use client";

import React, { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { FaXmark, FaRobot, FaUserTie } from "react-icons/fa6";
import Cardcontainer from "./Cardcontainer";
import { useSession } from "next-auth/react";
import Nav from "./Nav";

import firstimage from "../../../public/Imges/first.png";
import secondimage from "../../../public/Imges/second.png";
import thirdimage from "../../../public/Imges/third.png";

const axios = require("axios");

function Dragdrop() {
  const [file, setFile] = useState(null);
  const [rejected, setRejected] = useState([]);
  const [verdict, setVerdict] = useState();
  const [quality, setQuality] = useState();
  const [nsfw, setNsfw] = useState();
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gameData, setGameData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true); // New state for data loading
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [third, setThird] = useState(null);

  console.log(userData);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getGame", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setGameData(data);
      } catch (error) {
        console.error("Error fetching game data:", error);
      } finally {
        setDataLoading(false); // Stop loading when data is fetched
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        const sortedData = data.sort((a, b) => b.scores - a.scores);
        setUserData(sortedData);
        const firstUserData = sortedData[0];
        const secondUserData = sortedData[1];
        const thirdUserData = sortedData[2];

        setFirst(firstUserData);
        setSecond(secondUserData);
        setThird(thirdUserData);
      } catch (error) {
        console.error("Error fetching game data:", error);
      } finally {
        setDataLoading(false); // Stop loading when data is fetched
      }
    };

    fetchGameData();
    fetchUserData();
  }, [loading]);

  const { data: session } = useSession();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      const newFile = acceptedFiles[0];
      setFile(
        Object.assign(newFile, { preview: URL.createObjectURL(newFile) })
      );
    }

    if (rejectedFiles?.length) {
      setRejected(rejectedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
  });

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file.preview);
    };
  }, [file]);

  const removeFile = () => {
    setFile(null);
  };

  const removeAll = () => {
    setFile(null);
    setRejected([]);
  };

  const removeRejected = (name) => {
    setRejected((files) => files.filter(({ file }) => file.name !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return;

    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "dejandkkv");

    const URL_coudinary =
      "https://api.cloudinary.com/v1_1/dejandkkv/image/upload";
    const URL = "http://localhost:5000/upload";

    try {
      const response_coudinary = await fetch(URL_coudinary, {
        method: "POST",
        body: formData,
      });
      const data_coudinary = await response_coudinary.json();

      const response = await fetch(URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      const upload_mogos = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: data_coudinary.url,
          result: data.report.verdict,
        }),
      });

      setVerdict(data.report.verdict);
      setQuality(data.facets.quality.is_detected);
      setNsfw(data.facets.nsfw.is_detected);
      setSubmit(true);

      document.getElementById("ypred").scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Set loading state to false after completion
    }
  };

  return (
    <div className="w-full flex flex-col">
      <Nav session={session} />
      <div className="mt-10 flex justify-center items-center flex-col">
        <form
          onSubmit={handleSubmit}
          method="post"
          className="flex flex-col max-w-[1000px] w-full items-center"
        >
          <div className="px-3 w-3/4">
            <div className="flex justify-center font-sans text-2xl font-bold">
              Upload your image
            </div>
            {/* Upload files */}
            <div
              className="mt-10 w-full h-[150px] border border-neutral-700 rounded-xl flex justify-center items-center"
              {...getRootProps({})}
            >
              <input {...getInputProps()} name="file" />
              {isDragActive ? (
                <p>Drop the file here ...</p>
              ) : (
                <p className="text-center">
                  Drag & drop file here, or click to select file
                </p>
              )}
            </div>

            {/* Preview */}
            <div className="mt-10">
              <div className="flex w-full">
                <h2 className="title text-3xl font-semibold mr-2">Preview</h2>
                <button
                  type="button"
                  onClick={removeAll}
                  className="mr-5 mt-1 text-[12px] uppercase font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-slate-300 transition-colors"
                >
                  Remove all files
                </button>
                <button
                  type="submit"
                  className="mt-1 text-[12px] uppercase font-bold text-neutral-500 border border-slate-800 rounded-md px-3 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Check AI or Human
                </button>
              </div>
            </div>

            {/* Accepted file */}
            <h3 className="title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3">
              Accepted File
            </h3>

            <ul className="mt-6 flex justify-center">
              {file && (
                <li
                  key={file.name}
                  className="relative h-56 rounded-md shadow-lg mr-2"
                >
                  <Image
                    src={file.preview}
                    alt={file.name}
                    width={300}
                    height={300}
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview);
                    }}
                    className="h-full w-full object-contain rounded-md"
                  />
                  <button
                    type="button"
                    className="w-7 h-7 border border-secondary-400 bg-red-600 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-red-400 transition-colors"
                    onClick={removeFile}
                  >
                    <FaXmark className="text-white" />
                  </button>
                  <p className="mt-2 text-neutral-500 text-[14px] font-medium">
                    {file.name}
                  </p>
                </li>
              )}
            </ul>

            {/* Rejected Files */}
            <h3 className="title text-lg font-semibold text-neutral-600 mt-24 border-b pb-3">
              Rejected Files
            </h3>
            <ul className="mt-6 flex flex-col">
              {rejected.map(({ file, errors }) => (
                <li
                  key={file.name}
                  className="flex items-start justify-between w-full"
                >
                  <div>
                    <p className="mt-2 text-neutral-500 text-sm font-medium">
                      {file.name}
                    </p>
                    <ul className="text-[12px] text-red-400">
                      {errors.map((error) => (
                        <li key={error.code}>{error.message}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="mt-1 py-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-white transition-colors"
                    onClick={() => removeRejected(file.name)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="h-full w-full max-w-full px-2 flex justify-center items-center"
            id="ypred"
          >
            <div className="p-[20px] h-[250px] w-full max-w-[550px] bg-slate-700 rounded-xl">
              <div className="flex flex-col w-full h-full">
                <div className="flex justify-center items-center h-[250px] bg-slate-800 rounded-[8px]">
                  {submit ? (
                    verdict === "human" ? (
                      <div className="flex flex-col justify-center items-center">
                        <FaUserTie className="my-4 text-white text-[100px]" />
                        <p className="text-white font-bold text-4xl">
                          From Human
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center">
                        <FaRobot className="my-4 text-white text-[100px]" />
                        <p className="text-white font-bold text-4xl">From AI</p>
                      </div>
                    )
                  ) : (
                    <p className="text-white font-semibold text-[18px]">
                      Please upload your file for check
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <p className="font-bold text-3xl mt-5">Top Scores</p>

          <div className="mt-20 max-w-full w-full h-[240px] flex flex-row justify-center items-center">
            {!dataLoading && userData ? (
              <>
                <div className="min-w-[120px] min-h-[120px] sm:min-w-[160px] sm:min-h-[160px] md:min-w-[200px] md:min-h-[200px] rounded-full bg-slate-900 flex flex-col justify-center items-center text-white text-[20px] relative ">
                  <Image
                    src={secondimage}
                    alt="second"
                    className="absolute w-[80px] sm:w-[100px] md:w-[140px] -top-4 sm:-top-8 md:-top-12"
                  />
                  <p className="uppercase font-bold text-[30px] sm:text-[50px] md:text-[80px] mb-7 sm:mb-10 md:mb-14">
                    {second.name.charAt(0)}
                  </p>
                  <div className="absolute flex flex-col justify-center items-center bottom-3 text-[12px] sm:text-[14px] md:text-[16px] text-[#8A8A8A] font-medium">
                    <p>{second.name}</p>
                    <p>scores: {second.scores}</p>
                  </div>
                </div>

                <div className="min-w-[160px] min-h-[160px] sm:min-w-[200px] sm:min-h-[200px] md:min-w-[240px] md:min-h-[240px] rounded-full bg-slate-900 flex flex-col justify-center items-center text-white text-[20px] relative mx-1 sm:mx-4 md:mx-7">
                  <Image
                    src={firstimage}
                    alt="first"
                    className="absolute w-[120px] sm:w-[140px] md:w-[170px] -top-6 sm:-top-9 md:-top-10"
                  />
                  <p className="uppercase font-bold text-[40px] sm:text-[70px] md:text-[100px] mb-7 sm:mb-10 md:mb-14">
                    {first.name.charAt(0)}
                  </p>
                  <div className="absolute flex flex-col justify-center items-center bottom-3 text-[12px] sm:text-[14px] md:text-[16px] text-[#8A8A8A] font-medium">
                    <p>{first.name}</p>
                    <p>scores: {first.scores}</p>
                  </div>
                </div>

                <div className="min-w-[120px] min-h-[120px] sm:min-w-[160px] sm:min-h-[160px] md:min-w-[200px] md:min-h-[200px] rounded-full bg-slate-900 flex flex-col justify-center items-center text-white text-[20px] relative ">
                  <Image
                    src={thirdimage}
                    alt="third"
                    className="absolute w-[80px] sm:w-[100px] md:w-[140px] -top-4 sm:-top-8 md:-top-12"
                  />
                  <p className="uppercase font-bold text-[30px] sm:text-[50px] md:text-[80px] mb-7 sm:mb-10 md:mb-14">
                    {third.name.charAt(0)}
                  </p>
                  <div className="absolute flex flex-col justify-center items-center bottom-3 text-[12px] sm:text-[14px] md:text-[16px] text-[#8A8A8A] font-medium">
                    <p>{third.name}</p>
                    <p>scores: {third.scores}</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-center w-full">Loading user data...</p>
            )}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 opacity-75 flex justify-center items-center">
              <p className="text-white font-semibold text-xl">Loading...</p>
            </div>
          )}
        </form>
        {session && (
          <>
            <div className="flex justify-center font-bold text-3xl mt-10">
              Try AI or not
            </div>
            <div className="w-full flex items-start justify-start mt-10 flex-wrap max-w-[1280px] px-10">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3">
                {!dataLoading && gameData ? (
                  gameData.map((data) => (
                    <Cardcontainer
                      key={data._id} // Use the actual _id as the key
                      id={data._id} // Pass the actual _id as the id prop
                      photo={data.url}
                      result={data.result}
                    />
                  ))
                ) : (
                  <p className="text-center w-full">Loading game data...</p>
                )}
              </div>
            </div>
          </>
        )}

        <footer className="z-0 relative bottom-0 text-gray-800 text-center py-2 h-32 w-screen flex items-center justify-center">
          Copyright 2024
        </footer>
      </div>
    </div>
  );
}

export default Dragdrop;
