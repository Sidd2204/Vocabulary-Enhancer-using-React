import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landingpage from "./components/landingpage";
import LoginPage from "./components/loginpage";
import Homepage from "./components/homepage";
import Learn from "./components/learn";
import Stats from "./components/stats";
import Profile from "./components/profile";
import Review from "./components/review";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landingpage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/homepage/:username" element={<Homepage />}></Route>
          <Route path="/profile/:username" element={<Profile />}></Route>
          <Route path="/learn/:username" element={<Learn />}></Route>
          <Route path="/stats/:username" element={<Stats />}></Route>
          <Route path="/review/:username" element={<Review />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
