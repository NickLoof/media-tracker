import { useContext } from "react";
import { LanguageContext } from "../context/languageContext";
import { translations } from "../../translations/translations";
import {useState, useEffect} from "react";
import "./home.css"
import {Search} from "lucide-react"
import MediaDetails from "../components/MediaDetails";

const Home = () => {
    const {language, setLanguage} = useContext(LanguageContext);
    const t = translations[language];
    const [inputValue, setInputValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if(!isSearching){
            return;
        }
        if(inputValue === ""){
            setSearchResults([]);
            return;
        }
        const timer = setTimeout(()=> {
        fetch(`http://localhost:3000/search?title=${encodeURIComponent(inputValue)}&language=${language}`)
        .then((response) => response.json())
        .then((data) => {setSearchResults(data)});
        }, 200);
        return() => {
            clearTimeout(timer);
        }

    }, [inputValue], [isSearching], [language]);

    const handleMediaClick = (item) => {
        setSelectedMedia(item);
        setIsSearching(false);

    }

    return (
        <>
            <div className="layout">
            <div className="search-container">
                <Search className="search-icon"/>
                <input value={inputValue} type="text" className="home-searchbar" placeholder={t.searchMedia} onChange={(event) => {setInputValue(event.target.value);
                    setSelectedMedia(null); setIsSearching(true);}} onFocus={() => setIsSearching(true)}/>
                {isSearching && searchResults.length > 0 && (<div className="search-dropdown">
                    {searchResults.map((item) => (<div className="search-result" key={item.id} onClick={() => handleMediaClick(item)}>
                        {item.poster_path?(<img className="search-poster" src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}alt={item.title || item.name}/>):(<div className="no-poster">{t.noImage}</div>)}
                        <p>{item.title || item.name}{item.media_type === "movie" ? item.release_date?.slice(0, 4): item.first_air_date?.slice(0, 4)}</p>
                        </div>))}</div>)}
                    {selectedMedia&&(
                    <MediaDetails selectedMedia={selectedMedia} type={selectedMedia.media_type === "movie" ? "Movie" : "Tv Show"} onClose={() => {setSelectedMedia(null); setInputValue("");}}/>)}
            </div>
            <div className="home-content">
                <div className="heading">
                    <h1>{t.welcomeBack}</h1>
                </div>
                <div className="recently-added">
                    <p>{t.recentlyAdded}</p>
                </div>
                <div className="continue-watching">
                    <p>{t.continueWatching}</p>
                </div>
                <div className="your-library">
                    <p>{t.yourLibrary}</p>
                </div>
            </div>
            </div>
        </>
    );
};

export default Home;