import React from "react";
import Header from "./components/Header"
import Hero from "./components/Hero"
import Stats from "./components/Stats"
import CoreVoice from "./components/CoreVoice";
import FeaturedPrograms from "./components/FeaturedPrograms";

function App() {
  return (
    <>
      <div className="font-sans">
        <Header/>
        <Hero/>
        <Stats/>
        <CoreVoice/>
        <FeaturedPrograms/>
      </div>
    </>
  );
}

export default App;
