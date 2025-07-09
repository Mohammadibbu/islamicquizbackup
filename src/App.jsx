import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import AddQuiz from "./Pages/Admin/AddQuiz";
import Questions from "./Pages/Admin/Questions";
import Dashboard from "./Pages/Admin/Dashboard";
import Evaluate from "./Pages/Admin/Evaluate";
import AddParticipant from "./Pages/Admin/AddParticipant";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/addquiz" element={<AddQuiz />} />
        <Route path="/admin/questions" element={<Questions />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/addparticipants" element={<AddParticipant />} />
        <Route path="/admin/evaluation" element={<Evaluate />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
