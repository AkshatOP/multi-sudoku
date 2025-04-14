import React, { useEffect, useState , useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import { zoomies } from "ldrs";
import {  set , ref } from 'firebase/database';
import { db } from '../firebase'

zoomies.register();

const LandingPage = () => {
  
  
  const [name, setName] = useState("");
  const [mode, setMode] = useState("");
  const [gameId, setGameId] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  


  
  const defaultBoards = [
    {
      board: [
        [0, 0, 0, 0, 0, 0, 0, 0, 2],
        [4, 8, 0, 6, 0, 0, 0, 1, 3],
        [0, 0, 9, 0, 1, 3, 5, 6, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0],
        [3, 0, 0, 0, 4, 9, 0, 0, 5],
        [0, 0, 0, 5, 0, 2, 8, 0, 1],
        [0, 7, 0, 0, 0, 8, 1, 4, 6],
        [8, 0, 0, 0, 0, 0, 0, 7, 9],
        [9, 6, 0, 0, 7, 1, 3, 0, 0]
      ],
      solution: [
        [1, 3, 6, 4, 9, 5, 7, 8, 2],
        [4, 8, 5, 6, 2, 7, 9, 1, 3],
        [7, 2, 9, 8, 1, 3, 5, 6, 4],
        [5, 9, 2, 1, 8, 6, 4, 3, 7],
        [3, 1, 8, 7, 4, 9, 6, 2, 5],
        [6, 4, 7, 5, 3, 2, 8, 9, 1],
        [2, 7, 3, 9, 5, 8, 1, 4, 6],
        [8, 5, 1, 3, 6, 4, 2, 7, 9],
        [9, 6, 4, 2, 7, 1, 3, 5, 8]
      ],
    },
    {
      board: [
        [2, 0, 4, 0, 8, 0, 0, 7, 9],
        [8, 0, 1, 0, 0, 2, 0, 3, 0],
        [0, 3, 9, 6, 7, 1, 4, 0, 8],
        [0, 4, 2, 0, 1, 7, 0, 8, 0],
        [7, 8, 9, 0, 0, 0, 0, 0, 0],
        [0, 0, 5, 0, 0, 0, 0, 0, 0],
        [0, 0, 6, 7, 0, 9, 0, 0, 0],
        [0, 0, 8, 0, 0, 0, 5, 0, 6],
        [0, 0, 7, 8, 0, 5, 0, 6, 0],
      ],
      solution: [
        [2, 6, 4, 5, 8, 3, 1, 7, 9],
        [8, 7, 1, 4, 9, 2, 5, 3, 6],
        [5, 3, 9, 6, 7, 1, 4, 2, 8],
        [6, 4, 2, 3, 1, 7, 9, 8, 5],
        [7, 8, 3, 9, 5, 4, 6, 1, 2],
        [1, 9, 5, 2, 6, 8, 3, 4, 7],
        [3, 2, 6, 7, 4, 9, 8, 5, 1],
        [4, 5, 8, 1, 2, 6, 7, 9, 3],
        [9, 1, 7, 8, 3, 5, 2, 6, 4],
      ],
    },
    {
      board: [
        [5, 0, 0, 0, 0, 1, 0, 8, 3],
        [0, 0, 9, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 5, 6, 1, 0, 0],
        [8, 1, 0, 0, 4, 7, 0, 9, 5],
        [0, 5, 0, 3, 1, 0, 2, 0, 0],
        [3, 0, 7, 9, 0, 0, 4, 8, 0],
        [0, 3, 0, 8, 7, 0, 0, 0, 1],
        [0, 0, 0, 0, 4, 8, 3, 7, 0],
        [0, 7, 0, 1, 0, 9, 0, 2, 4]
      ],
      solution: [
        [5, 4, 2, 6, 9, 1, 7, 8, 3],
        [1, 6, 9, 7, 8, 3, 4, 5, 2],
        [7, 8, 3, 4, 2, 5, 6, 1, 9],
        [8, 1, 6, 2, 4, 7, 3, 9, 5],
        [9, 5, 4, 3, 1, 8, 2, 7, 6],
        [3, 2, 7, 9, 5, 6, 1, 4, 8],
        [4, 3, 5, 8, 7, 2, 9, 6, 1],
        [2, 9, 1, 5, 6, 4, 8, 3, 7],
        [6, 7, 8, 1, 3, 9, 5, 2, 4]
      ]
    }
  ];
  
  const fallbackHandler = async () => {

    const randomIndex = Math.floor(Math.random() * defaultBoards.length);
    const selectedBoard = defaultBoards[randomIndex];

    const boardString = selectedBoard.board.flat().join(",");
    const solvedString = selectedBoard.solution.flat().join(","); 
  
    // Update Firebase
    await set(ref(db, `games/${gameId}/board`), boardString);
    await set(ref(db, `games/${gameId}/solvedBoard`), solvedString);
    await set(ref(db, `games/${gameId}/currBoard`), boardString);
    await set(ref(db, `games/${gameId}/mistakes`), 0);
    await set(ref(db, `games/${gameId}/gameOver`), false);
    await set(ref(db, `games/${gameId}/colorTheme`), true);
    await set(ref(db, `games/${gameId}/considerMistakes`), true);
    await set(ref(db, `games/${gameId}/gameEnd`), false);
    await set(ref(db, `games/${gameId}/creationTime`), new Date().toISOString());

    console.warn("Using fallback default board due to API failure or missing difficulty match.");
  };

  const fetchGameData = useCallback(async () => {
    console.log("fetching with gameid: ", gameId);
  
    try {
      const res = await fetch(
        `https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:20){grids{value,solution,difficulty}}}`
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
  
      const data = await res.json();
      const grids = data?.newboard?.grids || [];
  
      const desiredDifficulty = mode;
  
      const selectedSudoku = grids.find((grid) => grid.difficulty === desiredDifficulty);
  
      if (!selectedSudoku) {
        console.warn("No matching Sudoku found for the selected difficulty.");
        fallbackHandler(); // Use the default board
        console.log("BAD")
        return;
      }
  
      const boardArray = selectedSudoku.value || [];
      const solvedArray = selectedSudoku.solution || [];
      const boardString = boardArray.flat().join(",");
      const solvedString = solvedArray.flat().join(",");
  
      // Update Firebase
      await set(ref(db, `games/${gameId}/board`), boardString);
      await set(ref(db, `games/${gameId}/solvedBoard`), solvedString);
      await set(ref(db, `games/${gameId}/currBoard`), boardString);
      await set(ref(db, `games/${gameId}/mistakes`), 0);
      await set(ref(db, `games/${gameId}/gameOver`), false);
      await set(ref(db, `games/${gameId}/colorTheme`), true);
      await set(ref(db, `games/${gameId}/considerMistakes`), true);
      await set(ref(db, `games/${gameId}/gameEnd`), false);
      await set(ref(db, `games/${gameId}/creationTime`), new Date().toISOString());
    } catch (error) {
      console.error("Error fetching data, using fallback board:", error.message);
      fallbackHandler(); // Use the default board in case of an error
    }
  }, [gameId, mode]);


  function handleStart(tempData) {
    console.log(`Navigating ${tempData}`);
    navigate( `/game/${tempData}?name=${name}&mode=${mode}`)
  }
  
  function handleMoveToJoin(){
    navigate(`/game/join`);
  }

  useEffect(() => {
    if( gameId !== 0){
      fetchGameData();
    }
  }, [gameId , fetchGameData]);





  return (
    <>

    {loading ? (
      <div className="w-full h-[100svh] flex justify-center items-center flex-col">
          <span className="font-[interSemibold] text-[24px] h-[50px] mt-[-50px]">
            Loading
          </span>
          <l-zoomies
            size="140"
            stroke="5"
            bg-opacity="0.1"
            speed="1.4"
            color="#FFFFFF"
          ></l-zoomies>
          <span className="font-[interRegular] text-[15px] h-[50px] pt-[13px] mb-[-50px] text-center px-[20px]">
            Please wait while your game is being loaded
          </span>
        </div>
    ) : (
      <>
      <div className='text-[20px] tracking-wider mb-[5px] ml-[-40px] '>Realtime</div>
      <div className='text-[40px] tracking-tighter my-[-20px] '>Sudoku</div>
      <div className=' text-[14px]  mt-[5px] mr-[-120px]'>Multiplayer</div>

      <div className="text-[13px] w-[300px] flex justify-start items-center pl-[10px] mb-[-10px] z-10 mt-[10px]">
        <div className="px-[5px] text-[#c5baba] bg-[#020817]">Name</div>
      </div>
      <input
      className="w-[300px] h-[43px] border border-[#dde4ec] rounded-lg px-[15px] outline-none"
      type="text"
      placeholder="Enter your name"
      value={name}
      onChange={(e) => setName(e.target.value)}
      />

      <div className="text-[13px] w-[300px] flex justify-start items-center mt-[40px]">
        <div className="px-[5px] text-[#d8d5d5] font-bold">Difficulty</div>
      </div>


      <button
      className={`w-[300px] h-[43px] py-2 px-4 mt-[8px] cursor-pointer rounded-lg border
        ${mode === "Easy" ? "bg-blue-950 border-white text-white" : "bg-transparent border-white border-opacity-40 text-white hover:bg-blue-950"}`}
      onClick={() => setMode("Easy")}
      >
      Easy
      </button>

      <button
      className={`w-[300px] h-[43px] py-2 px-4 mt-[8px] cursor-pointer rounded-lg border
        ${mode === "Medium" ? "bg-blue-950 border-white text-white" : "bg-transparent border-white border-opacity-40 text-white hover:bg-blue-950"}`}
        onClick={() => setMode("Medium")}
        >
      Medium
      </button>

      <button
      className={`w-[300px] h-[43px] py-2 px-4 mt-[8px] cursor-pointer rounded-lg border
        ${mode === "Hard" ? "bg-blue-950 border-white text-white" : "bg-transparent border-white border-opacity-40 text-white hover:bg-blue-950"}`}
        onClick={() => setMode("Hard")}
        >
      Hard
      </button>


      <div
      className={
        "mt-[20px] flex justify-center items-center w-[300px] h-[43px] rounded-lg px-[15px] outline-none font-[interSemibold] cursor-pointer " +
        (name.length > 0 && mode.length > 0
          ? " bg-[#dfe2e5] text-black hover:bg-[#d6d1d1da]"
                : " bg-[#7d8189] text-white hover:bg-[#706666c3]" )
        }
        
        onClick={()=>{
          if(name.length > 0 && mode.length>0){
            let id = Date.now();
            setGameId(id);
            setLoading(true);
            setTimeout(()=>{
              setLoading(false);
              handleStart(id);
            }, 3000);
          }
        }}
        >
        Start Game
      </div>
      <div className="w-[100px] flex justify-center items-center my-[20px] h-0 overflow-visible border border-[#f7f7f73b]">
            <div className="h-[20px] flex text-[14px] justify-center items-center px-[8px] bg-[#020817]">
              OR
            </div>
          </div>

          <div
          className={
            " flex justify-center items-center w-[300px] h-[43px] rounded-lg px-[15px] outline-none font-[interSemibold] cursor-pointer text-white bg-[#7d8189] hover:bg-[#786d6dc3]"
          }
          onClick={() => {
            handleMoveToJoin();
          }}
          >
            Join
          </div>
          </>
      
    )}


    </>
  )
}

export default LandingPage
