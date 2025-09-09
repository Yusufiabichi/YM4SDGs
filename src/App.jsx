import React from "react";
import Header from "./components/Header"
import Hero from "./components/Hero"
import Stats from "./components/Stats"

function App() {
  return (
    <>
      <div className="font-sans">
        <Header/>
        <Hero/>
        <Stats/>
      </div>
    </>
  );
}

export default App;
