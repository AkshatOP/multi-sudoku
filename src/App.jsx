import './App.css'
import React from 'react'
import GamePage from "./pages/GamePage.jsx";
import JoinPage from "./pages/JoinPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import SoloJoinPage from "./pages/SoloJoinPage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  

  return (

      <Router>
        <div className="w-full h-[100svh] flex justify-center items-center flex-col select-none">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/game/join" element={<SoloJoinPage />} />
            <Route path="/game/:gameId" element={<GamePage />} />
            <Route path="/joinGame/join" element={<JoinPage />} />
            
          </Routes>
        </div>
      </Router>
    
  )
}

export default App
