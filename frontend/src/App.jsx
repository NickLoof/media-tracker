import './App.css';
import { Routes, Route, NavLink} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Library from "./pages/Library.jsx";
import Browse from "./pages/Browse.jsx";
import {useContext, useState} from "react";
import { LanguageContext } from './context/languageContext.jsx';
import { translations } from '../translations/translations.js';
import {House, LibraryBig, Globe, TvMinimalPlay, Menu, CircleX} from "lucide-react";

function App() {
  const {language, setLanguage} = useContext(LanguageContext);
  const t = translations[language];
  const [menuOpen, setMenuOpen] = useState(false);

  return(
    <>
      <div className="page-layout">
        <button className='mobile-menu-button' onClick={() => setMenuOpen(!menuOpen)}>{menuOpen?<CircleX/>:<Menu/>}</button>
        {menuOpen&&(<div className="menu-backdrop" onClick={() => setMenuOpen(false)}></div>)}
      <div className={menuOpen?"side-menu side-menu-open":"side-menu"}>
        <div className="title-container">
          <TvMinimalPlay className="title-icon"/>
          <h1 className="app-title">{t.appTitle}</h1>
        </div>
        <div className="menu-container">
          <p className="menu-title">{t.menu}</p>
          <NavLink to="/" end onClick={() => setMenuOpen(false)} className={({isActive}) => isActive? "page-link page-link-active": "page-link"}><House/> {t.home} </NavLink>
          <NavLink to="/library" onClick={() => setMenuOpen(false)} className={({isActive}) => isActive? "page-link page-link-active": "page-link"}><LibraryBig/> {t.library} </NavLink>
          <NavLink to="/browse" onClick={() => setMenuOpen(false)} className={({isActive}) => isActive? "page-link page-link-active": "page-link"}><Globe/> {t.browseMedia}</NavLink>
        </div>
        <div className="language-picker">
          <button className="language-button" onClick={() => setLanguage("en")}>{t.english}</button>
          <button className="language-button" onClick={() => setLanguage("de")}>{t.german}</button>
        </div>
      </div>
      
      <main className="page-content">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse/>}/>
            <Route path="/library" element={<Library />} />
          </Routes>
      </main>
      </div>
    </>
  )
}

export default App
