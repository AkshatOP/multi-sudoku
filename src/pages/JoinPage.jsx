import React, { useState } from "react";
import {useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { zoomies } from "ldrs";

zoomies.register();

const JoiningPage = () => {
  const [name, setName] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const mode = searchParams.get("mode");
  const roomID = searchParams.get("roomId")

  function handleStart() {
    
    console.log("navigate");
    console.log();
    navigate(
      `/game/${roomID}?name=${name}&mode=${mode}`
    );
  }

  return (
    <>
      {loading ? (
        <div className="w-full h-[100svh] flex justify-center items-center flex-col">
          <span className="font-[interSemibold] text-[24px] h-[50px] mt-[-50px]">
            Joining
          </span>
          <l-zoomies
            size="140"
            stroke="5"
            bg-opacity="0.1"
            speed="1.4"
            color="white"
          ></l-zoomies>
          <span className="font-[interRegular] text-[15px] h-[50px] pt-[13px] mb-[-50px] text-center px-[20px]">
            Please be patient while we establish the connection with server
          </span>
        </div>
      ) : (
        <>
          <div className=" text-[20px] tracking-wider mb-[5px] ml-[-40px] ">
            Realtime
          </div>
          <div className=" text-[40px] tracking-tighter my-[-20px] ">
            Sudoku
          </div>
          <div className=" text-[14px]  mt-[5px] mr-[-120px]">
            Multiplayer
          </div>
          <div className="text-[13px] w-[300px] flex justify-start items-center pl-[10px] mb-[-10px] z-10 mt-[30px]">
            <div className="px-[5px] text-[#c5baba] bg-[#020817]">Name</div>
          </div>
          <input
            className="w-[300px] h-[43px] border border-[#dde4ec] rounded-lg px-[15px] outline-none"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div
            className={
              "mt-[20px] flex justify-center items-center w-[300px] h-[43px] rounded-lg px-[15px] outline-none font-[interSemibold] cursor-pointer " +
              (name.length > 0 ? " bg-[#dfe2e5] hover:bg-[#d6d1d1da] text-black" : " bg-[#7d8189] hover:bg-[#706666c3] text-white")
            }
            onClick={() => {
              if (name.length > 0) {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  handleStart();
                }, 3000);
              }
            }}
          >
            Join Game
          </div>
        </>
      )}
    </>
  );
};
export default JoiningPage;
