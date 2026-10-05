import { useContext, useState, useEffect, useRef } from "react";
import { LanguageContext } from "../context/languageContext";
import { translations } from "../../translations/translations";
import "./home.css"
import {Search, ArrowRight} from "lucide-react"
import MediaDetails from "../components/MediaDetails";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const {language, setLanguage} = useContext(LanguageContext);
    const t = translations[language];
    const [inputValue, setInputValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [recentMedia, setRecentMedia] = useState([]);
    const [watchingMedia, setWatchingMedia] = useState([]);
    const [movieCount, setMovieCount] = useState(0);
    const [tvShowCount, setTvShowCount] = useState(0);
    const navigate = useNavigate();
    const recentlyAddedRef = useRef(null);
    const continueWatchingRef = useRef(null);
    const searchAreaRef = useRef(null);

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

    useEffect(() => {
        fetch(`http://localhost:3000/media`)
        .then((response) => {return response.json()})
        .then((data) => {
            const recent = [...data].sort((a, b) => b.id - a.id).slice(0, 5);
            const watching = data.filter((item) => item.status === "Watching").slice(0, 5);
            const moviesTotal = data.filter((item) => item.type === "Movie").length;
            const tvShowTotal = data.filter((item) => item.type === "Tv Show").length;
            setRecentMedia(recent);
            setWatchingMedia(watching);
            setMovieCount(moviesTotal);
            setTvShowCount(tvShowTotal);
        })
    }, [])

    useEffect(() => {
        if(recentlyAddedRef.current){
        recentlyAddedRef.current.scrollLeft = 0;
        }
        if(continueWatchingRef.current){
        continueWatchingRef.current.scrollLeft = 0;
        }
    }, [recentMedia, watchingMedia])

    useEffect(() => {
        const handleClickOutside = (event) =>{
            if(
                searchAreaRef.current &&
                !searchAreaRef.current.contains(event.target)
            ){
                setIsSearching(false);
            } 
            
        };
        document.addEventListener("mousedown", handleClickOutside);
        return() =>{
                document.removeEventListener("mousedown", handleClickOutside);
            };
    }, [])

    const totalMedia = movieCount + tvShowCount;
    const moviePercentage = totalMedia > 0 ? (movieCount / totalMedia) * 100 : 0;
    const tvShowPrecentage = totalMedia > 0 ? (tvShowCount / totalMedia) * 100 : 0;

    const handleMediaClick = (item) => {
        setSelectedMedia(item);
        setIsSearching(false);
    }

    return (
        <>
            <div className="home-layout">
            <div className="search-container" >
                <div className="home-search-wrapper" ref={searchAreaRef}>
                    <Search className="search-icon"/>
                    <input value={inputValue} type="text" className="home-searchbar" placeholder={t.searchMedia} onChange={(event) => {setInputValue(event.target.value);
                        setSelectedMedia(null); setIsSearching(true);}} onFocus={() => setIsSearching(true)}/>
                    {isSearching && searchResults.length > 0 && (<div className="home-search-dropdown">
                        {searchResults.map((item) => (<div className="search-result" key={item.id} onClick={() => handleMediaClick(item)}>
                            {item.poster_path?(<img className="search-poster" src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name}/>)
                            :(<div className="no-poster">{t.noImage}</div>)}
                            <p>{item.title || item.name}{" "}({item.media_type === "movie" ? item.release_date?.slice(0, 4): item.first_air_date?.slice(0, 4)})</p>
                            </div>))}</div>)}
                </div>            
                    {selectedMedia&&(
                    <MediaDetails selectedMedia={selectedMedia} type={selectedMedia.type || (selectedMedia.media_type === "movie" ? "Movie" : "Tv Show")} onClose={() => 
                    {setSelectedMedia(null); setInputValue(""); setSearchResults([]); setIsSearching(false);}}/>)}
            </div>
            <div className="home-content">
                <div className="heading">
                    <h1>{t.welcomeBack}</h1>
                </div>
                <div className="recently-added-section">
                    <div className="recently-added-layout">
                        <div className="recently-added-title">
                            <h2>{t.recentlyAdded}</h2>
                        </div>
                        <div className="recently-added-grid" ref={recentlyAddedRef}>
                            {recentMedia.map((item) => (
                            <div className="recently-added-card" key={item.id} onClick={() => handleMediaClick(item)}>
                                <img className="search-poster" src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name}/>
                                <p className="media-title">{item.title || item.name}{" "}({item.release_date?.slice(0, 4)})</p>  
                            </div>))}
                                <button className="mobile-view-all" onClick={() => navigate("/library")}>{t.viewAll}<ArrowRight className="arrow"/></button>
                        </div>
                    </div>    
                    <div className="view-all">
                        <button className="view-all-button" onClick={() => navigate("/library")}>{t.viewAll}<ArrowRight className="arrow"/></button>
                    </div>
                </div>
                <div className="continue-watching-section">
                    <div className="continue-watching-layout">
                        <div className="continue-watching-title">
                            <h2>{t.continueWatching}</h2>
                        </div>
                        <div className="continue-watching-grid" ref={continueWatchingRef}> 
                            {watchingMedia.map((item) => (
                                <div className="continue-watching-card" key={item.id} onClick={() => handleMediaClick(item)}>
                                    <img className="search-poster" src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name}/>
                                    <p className="media-title">{item.title || item.name}{" "}({item.release_date?.slice(0, 4)})</p>
                                </div>))}
                                <button className="mobile-view-all" onClick={() => navigate("/library?status=Watching")}>{t.viewAll}<ArrowRight className="arrow"/></button>
                        </div>
                    </div>
                    <div className="view-all">
                        <button className="view-all-button" onClick={() => navigate("/library?status=Watching")}>{t.viewAll}<ArrowRight className="arrow"/></button>
                    </div>
                </div>
                <div className="your-library">
                    <div className="library-stats-title">
                    <h2>{t.yourLibrary}</h2>
                    </div>
                    <div className="library-stats-body">
                    <div className="library-stats-overview">
                        <div className="stats-card stats-card-movie">
                            <h2>{movieCount}</h2>
                            <p>{t.totalMovies}</p>
                        </div>
                        <div className="stats-card stats-card-tv">
                            <h2>{tvShowCount}</h2>
                            <p>{t.totalTvShows}</p>
                        </div>
                    </div>
                    <div className="stats-stats">
                        <div className="library-chart" style={{background: `conic-gradient( #ae05fc 0% ${moviePercentage}%, #673aed ${moviePercentage}% 100%)`}}>
                            <div className="chart-center">
                                <p>{totalMedia}</p>
                            </div>
                        </div>
                        <div className="library-count">
                            <div className="display-percentage">
                                <p className="movie-percentage">{t.movies}</p>
                                <p className="movie-percentage">{moviePercentage.toFixed(2)}%</p>
                            </div>
                            <div className="display-percentage">
                                <p className="tv-percentage">{t.tvShows}</p>
                                <p className="tv-percentage">{tvShowPrecentage.toFixed(2)}%</p>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
};

export default Home;