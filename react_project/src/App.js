import React from "react";
import { Routes, Route } from "react-router-dom";

// Home Page Component
function Home() {
  return (
    <div>
      <h1>Hello, World!</h1>
      <p>Welcome to the Aunt Mary’s Storybook project.</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Add more Route components here for future pages */}
    </Routes>
  );
}

export default App;
