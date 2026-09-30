import './App.css';
import { Routes, Route, NavLink} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Library from "./pages/Library.jsx";
import Browse from "./pages/Browse.jsx";
import {useContext} from "react";
import { LanguageContext } from './context/languageContext.jsx';
import { translations } from '../translations/translations.js';
import {House, LibraryBig, Globe, TvMinimalPlay} from "lucide-react";

function App() {
  const {language, setLanguage} = useContext(LanguageContext);
  const t = translations[language];

  return(
    <>
      <div className="language-picker">
      <button className="language-button" onClick={() => setLanguage("en")}>{t.english}</button>
      <button className="language-button" onClick={() => setLanguage("de")}>{t.german}</button>
      </div>
      <div className="page-layout">
      <div className="side-menu">
        <div className="title-container">
          <TvMinimalPlay className="title-icon"/>
          <h1 className="app-title">{t.appTitle}</h1>
        </div>
        <div className="menu-container">
          <p className="menu-title">Menu</p>
          <NavLink to="/" end className={({isActive}) => isActive? "page-link page-link-active": "page-link"}><House/> {t.home} </NavLink>
          <NavLink to="/library" className={({isActive}) => isActive? "page-link page-link-active": "page-link"}><LibraryBig/> {t.library} </NavLink>
          <NavLink to="/browse" className={({isActive}) => isActive? "page-link page-link-active": "page-link"}><Globe/> {t.browseMedia}</NavLink>
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
