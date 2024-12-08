import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./test/Main.tsx";
import Create from "./test/Create.tsx";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route exact path="/create" element={<Create />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
