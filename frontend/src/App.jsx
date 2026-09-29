import './App.css';
import { Routes, Route, NavLink} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Library from "./pages/Library.jsx";
import Browse from "./pages/Browse.jsx";
import {useContext} from "react";
import { LanguageContext } from './context/languageContext.jsx';
import { translations } from '../translations/translations.js';

function App() {
  const {language, setLanguage} = useContext(LanguageContext);
  const t = translations[language];

  return(
    <>
      <h1>{t.appTitle}</h1>
      <button onClick={() => setLanguage("en")}>{t.english}</button>
      <button onClick={() => setLanguage("de")}>{t.german}</button>
      <NavLink to="/">{t.home} |</NavLink>
      <NavLink to="/library"> {t.library} |</NavLink>
      <NavLink to="/browse"> {t.browseMedia}</NavLink>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse" element={<Browse/>}/>
        <Route path="/library" element={<Library />} />
      </Routes>
    </>
  )
}

export default App
