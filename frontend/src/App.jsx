import './App.css';
import { Routes, Route, NavLink} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Library from "./pages/Library.jsx";

function App() {

  return(
    <>
      <h1>Media Tracker</h1>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/library">Library</NavLink>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
      </Routes>
    </>
  )
}

export default App
