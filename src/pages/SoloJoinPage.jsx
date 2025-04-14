import React, {useEffect, useState} from 'react';
import { zoomies } from 'ldrs';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from "../firebase"

zoomies.register();

const SoloJoinPage = () => {


  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [noidError, setNoidError] = useState(false);
  const [subError, setSubError] = useState(false);
  const [idArr, setIDArr] = useState([]);


  function handleStart(){
    navigate(
      `/game/${id?.split("_")[0]}?name=${name}&mode=${decideMode(id?.split("_")[1])}`
    )
  }

  function handleBack(){
    navigate(`/`);
  }


  async function fetchGameData() {
    try {
      const gamesReference = ref(db,"games");

      const snapshot = await get(gamesReference);

      if(snapshot.exists()) {
        const gamesIDs = Object.keys(snapshot.val());
        console.log("Game IDs: ", gamesIDs);
        setIDArr(gamesIDs);
        return gamesIDs; //returns me the array of IDs
      } else {
        console.log("No games found in database");
        return [];
      }




    } catch (error) {
      console.error("Error fetching game IDs: ", error);
    }
    
  }

  useEffect(() => {
    fetchGameData();
  }, []);

  function decideMode(data) {
    if (data == "E") {
      return "easy";
    } else if (data == "M") {
      return "medium";
    } else if (data == "H") {
      return "hard";
    }
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
      ) : noidError ? (
        <div className="w-full h-[100svh] flex justify-center items-center flex-col">
          <span className="font-[interSemibold] text-[24px] h-[50px] mt-[-50px]">
            {subError ? <>Oops</> : <>Error</>}
          </span>
          <l-zoomies
            size="140"
            stroke="5"
            bg-opacity="0.1"
            speed="1.4"
            color="#0F172A"
          ></l-zoomies>
          <span className="font-[interRegular] text-[15px] h-[50px] pt-[13px] mb-[-50px] text-center px-[20px]">
            {subError ? (
              <>Entered ID is invalid, please enter a valid ID</>
            ) : (
              <>
                Please be patient we are trying to make a connection to the
                server
              </>
            )}
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

          <div className="text-[13px] w-[300px] flex justify-start items-center pl-[10px] mb-[-10px] z-10 mt-[10px]">
            <div className="px-[5px] text-[#c5baba] bg-[#020817]">Game ID</div>
          </div>
          <input
          className={"w-[300px] h-[43px] border  rounded-lg px-[15px] outline-none" +
              (error ? " border-[#e04c27]" : " border-[#dde4ec]")}
          type="text"
          placeholder="Enter ID"
          value={id}
          onChange={(e) =>{
            setError(false);
            setId(e.target.value)
          }}
          />

<div
      className={
        "mt-[20px] flex justify-center items-center w-[300px] h-[43px] rounded-lg px-[15px] outline-none font-[interSemibold] cursor-pointer " +
        (name.length > 0 && id.length > 0
          ? " bg-[#dfe2e5] hover:bg-[#d6d1d1da] text-black"
                : " bg-[#7d8189] hover:bg-[#706666c3] text-white")
        }
        
        onClick={()=>{
          if(name.length > 0 && id.length>0){
            if(!id.includes("_")) {
              setError(true);
            }else if(id?.split("_")[1].length != 1) {
              setError(true);
            }else {
              if(idArr.includes(id?.split("_")[0])) {
                setLoading(true);
                setTimeout(()=>{
                  setLoading(false);
                  handleStart();
                }, 3000);
              } else {
                setNoidError(true);
                setTimeout(()=>{
                  setSubError(true);
                },1500);
                setTimeout(()=>{
                  setNoidError(false);
                  setSubError(false);
                }, 4000);
              }
            }
          }
        }}
        >
        Join Game
      </div>
      <div className="w-[100px] flex justify-center items-center my-[20px] h-0 overflow-visible border border-[#f7f7f73b]">
            <div className="h-[20px] flex text-[14px] justify-center items-center px-[8px] bg-[#020817]">
              OR
            </div>
          </div>

          <div
          className={
            " flex justify-center items-center w-[300px] h-[43px] rounded-lg px-[15px] outline-none font-[interSemibold] cursor-pointer text-white bg-[#7d8189] hover:bg-[#706666c3]"
          }
          onClick={() => {
            handleBack();
          }}
          >
            Start a new Game
          </div>
        </>
      )}
    </>
  )
}

export default SoloJoinPage
