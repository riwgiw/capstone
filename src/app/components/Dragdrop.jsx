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
import { Container } from "postcss";
import Cardcontainer from "./Cardcontainer";

var axios = require("axios");

function Dragdrop({ className }) {
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);

  const [verdict, setVerdict] = useState();
  const [quality, setQuality] = useState();
  const [nsfw, setNsfw] = useState();

  const [submit, setSubmit] = useState(false);

  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((PreviousFiles) => [
        ...PreviousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxSize: 1920 * 1080,
    maxFiles: 1,
  });

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const removeAll = () => {
    setFiles([]);
    setRejected([]);
  };

  const removeRejected = (name) => {
    setRejected((files) => files.filter(({ file }) => file.name !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files?.length) return;

    setLoading(true); // Start loading

    const formData = new FormData();

    files.forEach((file) => formData.append("file", file));
    formData.append("upload_preset", "dejandkkv");

    const URL = "https://api.cloudinary.com/v1_1/dejandkkv/image/upload";
    try {
      const response = await fetch(URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      console.log("data", data.url);

      var imageInsert = JSON.stringify({
        object: data.url,
      });

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.aiornot.com/v1/reports/image",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdkMjc0M2EzLTc4NmItNDdhYS04NTg0LTMwZTU5ZGY3NGQ2MSIsInVzZXJfaWQiOiI3ZDI3NDNhMy03ODZiLTQ3YWEtODU4NC0zMGU1OWRmNzRkNjEiLCJhdWQiOiJhY2Nlc3MiLCJleHAiOjAuMH0.g84Y1ffU14iw1QWgP-alYYxRHZvuUOvSPIl3d052mLU",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data: imageInsert,
      };

      const aiResponse = await axios(config);
      const responseData = aiResponse.data;
      console.log(responseData);
      setVerdict(responseData.report.verdict);
      setQuality(responseData.facets.quality.is_detected);
      setNsfw(responseData.facets.nsfw.is_detected);
      setSubmit(true);
      console.log(JSON.stringify(responseData));
      console.log("Verdict", responseData.report.verdict);
      console.log("Quality :", responseData.facets.quality.is_detected);
      console.log("Nsfw :", responseData.facets.nsfw.is_detected);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading state to false after completion
    }
  };

  return (
    <>
      <div className="flex justify-center items-center flex-col w-screen">
        <form onSubmit={handleSubmit} method="post" className="flex flex-col lg:flex-row">
          <div className="px-5 max-w-[1000px]">
            <div className="flex justify-center font-sans text-xl ">
              Upload your images
            </div>
            {/* Upload files */}
            <div
              {...getRootProps({
                className: className,
              })}
            >
              <input {...getInputProps()} name="file" />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p className="text-center">
                  Drag & drop file here, or click to select file
                </p>
              )}
            </div>

            {/* Preview */}
            <div className="mt-10">
              <div className="flex gap-4">
                <h2 className="title text-3xl font-semibold">Preview</h2>
                <button
                  type="button"
                  onClick={removeAll}
                  className="mt-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-slate-300 transition-colors"
                >
                  Remove all files
                </button>
                <button
                  type="submit"
                  className="ml-auto mt-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-slate-800 rounded-md px-3 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  Check AI or Human
                </button>
              </div>
            </div>

            {/* Accepted files */}
            <h3 className="title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3">
              Accepted Files
            </h3>
            
            <ul className="mt-6 flex justify-center">
              {files.map((file) => (
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
                    onClick={() => removeFile(file.name)}
                  >
                    <FaXmark className="text-white" />
                  </button>
                  <p className="mt-2 text-neutral-500 text-[14px] font-medium">
                    {file.name}
                  </p>
                </li>
              ))}
            </ul>

            {/* Rejected Files */}
            <h3 className="title text-lg font-semibold text-neutral-600 mt-24 border-b pb-3">
              Rejected Files
            </h3>
            <ul className="mt-6 flex flex-col">
              {rejected.map(({ file, errors }) => (
                <li
                  key={file.name}
                  className="flex items-start justify-between w-20"
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
                    remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mx-[20px] p-[20px] h-[500px] w-[550px] bg-slate-700 rounded-xl flex justify-center items-center">
            <div className="flex flex-col w-full h-full">
              <div className="flex justify-center items-center h-1/2 bg-slate-800 rounded-[8px]">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] justify-between h-1/2 pt-[20px]">
                <div className="flex flex-col justify-center items-center h-full bg-slate-800 rounded-[8px]">
                  <p className="text-slate-400 font-semibold text-[18px]">
                    Quality
                  </p>
                  {submit ? (
                    quality ? (
                      <div className="mt-4 flex flex-col justify-center items-center">
                        <FaRegThumbsUp className="text-white text-[30px]" />
                        <p className="text-white text-[20px]">Good</p>
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-col justify-center items-center">
                        <FaRegThumbsDown className="text-white text-[30px]" />
                        <p className="text-white text-[20px]">Bad</p>
                      </div>
                    )
                  ) : (
                    <p className="text-white text-[20px]">None</p>
                  )}
                </div>
                <div className="flex flex-col justify-center items-center h-full bg-slate-800 rounded-[8px]">
                  <p className="text-slate-400 font-semibold text-[18px]">
                    Nsfw
                  </p>
                  {submit ? (
                    nsfw ? (
                      <div className="mt-4 flex flex-col justify-center items-center">
                        <FaCheck className="text-white text-[30px]" />
                        <p className="text-white text-[20px]">Yes</p>
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-col justify-center items-center">
                        <FaXmark className="text-white text-[30px]" />
                        <p className="text-white text-[20px]">No</p>
                      </div>
                    )
                  ) : (
                    <p className="text-white text-[20px]">None</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Loading Indicator */}
          {loading && (
            <div className="absolute top-0 left-0 w-full h-lvh bg-gray-900 opacity-75 flex justify-center items-center">
              <p className="text-white font-semibold text-xl">Loading...</p>
            </div>
          )}
        </form>
        <div className="flex justify-center font-sans text-xl mt-10">
          try ai or not
        </div>
        <div className="w-full flex items-start justify-start mt-10 flex-wrap max-w-[768px] px-10">
          <div className="w-full grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 grid gap-2 md:gap-3">
            <Cardcontainer />
            <Cardcontainer />
            <Cardcontainer />
            <Cardcontainer />
            <Cardcontainer />
            <Cardcontainer />
            <Cardcontainer />
            <Cardcontainer />
            <Cardcontainer />
          </div>
        </div>
        <footer className=" relative top-10 bg-gray-800 text-white text-center py-2 h-32 w-screen flex items-center justify-center ">
          Copyright 2024
        </footer>
      </div>
    </>
  );
}

export default Dragdrop;
