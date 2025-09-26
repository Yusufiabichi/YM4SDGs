import React from "react";
import Header from "./components/Header"
import Hero from "./components/Hero"
import Stats from "./components/Stats"
import CoreVoice from "./components/CoreVoice";
import FeaturedPrograms from "./components/FeaturedPrograms";
import KeyCampaigns from "./components/KeyCampaigns";
// import Footer from "./components/Footer";

function App() {
  return (
    <>
      <div className="font-sans">
        <Header/>
        <Hero/>
        <Stats/>
        <CoreVoice/>
        <FeaturedPrograms/>
        <KeyCampaigns/>
        {/* <Footer/> */}
      </div>
    </>
  );
}

export default App;
