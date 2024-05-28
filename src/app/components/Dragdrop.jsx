"use client";

import React, { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import {
  FaXmark,
  FaRobot,
  FaUserTie,
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaCheck,
} from "react-icons/fa6";
import Cardcontainer from "./Cardcontainer";

import { useSession } from "next-auth/react";
import photo1 from "../../../public/Imges/LOGO.png";
import photo2 from "../components/bg-G.jpg";

import Nav from "./Nav";

const axios = require("axios");

function Dragdrop() {
  const [file, setFile] = useState(null);
  const [rejected, setRejected] = useState([]);
  const [verdict, setVerdict] = useState();
  const [quality, setQuality] = useState();
  const [nsfw, setNsfw] = useState();
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const keepData = [
    { id: 1, photo: photo1, types: true },
    { id: 2, photo: photo2, types: true },
];

  const { data: session } = useSession();
  // console.log(session);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      const newFile = acceptedFiles[0];
      setFile(Object.assign(newFile, { preview: URL.createObjectURL(newFile) }));
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

  // useEffect(() => {
  //   if (submit && resultRef) {
  //     document.getElementById('ypred').scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [submit]);

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
    // console.log(file);
    formData.append("upload_preset", "dejandkkv");

    const URL = "http://localhost:5000/upload";
    try {
      const response = await fetch(URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      // console.log("data", data);

      const imageInsert = JSON.stringify({
        object: data.url,
      });

      // const config = {
      //   method: "post",
      //   maxBodyLength: Infinity,
      //   url: "http://localhost:5000/reports/image",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Accept: "application/json",
      //   },
      //   data: imageInsert,
      // };

      // const aiResponse = await axios(config);

      const responseData = data;
      // console.log(responseData);

      setVerdict(responseData.report.verdict);
      setQuality(responseData.facets.quality.is_detected);
      setNsfw(responseData.facets.nsfw.is_detected);
      setSubmit(true);

      console.log('verdict', verdict);
      document.getElementById('ypred').scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.log(error);
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
          <div className="h-full w-full max-w-full px-2 flex justify-center items-center" id='ypred'>
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

          {/* Loading Indicator */}
          {loading && (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 opacity-75 flex justify-center items-center">
              <p className="text-white font-semibold text-xl">Loading...</p>
            </div>
          )}
        </form>
        {session && (
          <>
            <div className="flex justify-center font-sans text-xl mt-10">
              Try AI or not
            </div>
            <div className="w-full flex items-start justify-start mt-10 flex-wrap max-w-[768px] px-10">
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                {keepData.map((data) => (
                  <Cardcontainer
                    key={data.id}
                    photo={data.photo}
                    types={data.types}
                  />
                ))}
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
