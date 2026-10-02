import { useContext } from "react";
import { LanguageContext } from "../context/languageContext";
import { translations } from "../../translations/translations";
import {useState, useEffect} from "react";
import "./home.css"
import {Search, ArrowRight} from "lucide-react"
import MediaDetails from "../components/MediaDetails";

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
            <div className="search-container">
                <Search className="search-icon"/>
                <input value={inputValue} type="text" className="home-searchbar" placeholder={t.searchMedia} onChange={(event) => {setInputValue(event.target.value);
                    setSelectedMedia(null); setIsSearching(true);}} onFocus={() => setIsSearching(true)}/>
                {isSearching && searchResults.length > 0 && (<div className="search-dropdown">
                    {searchResults.map((item) => (<div className="search-result" key={item.id} onClick={() => handleMediaClick(item)}>
                        {item.poster_path?(<img className="search-poster" src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name}/>):(<div className="no-poster">{t.noImage}</div>)}
                        <p>{item.title || item.name}{" "}({item.media_type === "movie" ? item.release_date?.slice(0, 4): item.first_air_date?.slice(0, 4)})</p>
                        </div>))}</div>)}
                    {selectedMedia&&(
                    <MediaDetails selectedMedia={selectedMedia} type={selectedMedia.media_type === "movie" ? "Movie" : "Tv Show"} onClose={() => {setSelectedMedia(null); setInputValue("");}}/>)}
            </div>
            <div className="home-content">
                <div className="heading">
                    <h1>{t.welcomeBack}</h1>
                </div>
                <h2>{t.recentlyAdded}</h2>
                <div className="recently-added-section">
                    <div className="recently-added-grid">
                        {recentMedia.map((item) => (
                            <div className="recently-added-card" key={item.id}>
                                <img className="search-poster" src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name}/>
                                <p className="media-title">{item.title || item.name}{" "}({item.release_date?.slice(0, 4)})</p>  
                            </div>))}
                    </div>
                    <div className="view-all">
                        <button className="view-all-button"><ArrowRight className="arrow"/>{t.viewAll}</button>
                    </div>
                </div>
                <h2>{t.continueWatching}</h2>
                <div className="continue-watching-section">
                    <div className="continue-watching-grid">
                        {watchingMedia.map((item) => (
                            <div className="continue-watching-card" key={item.id}>
                                <img className="search-poster" src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name}/>
                                <p className="media-title">{item.title || item.name}{" "}({item.release_date?.slice(0, 4)})</p>
                            </div>))}
                    </div>
                    <div className="view-all">
                        <button className="view-all-button"><ArrowRight className="arrow"/>{t.viewAll}</button>
                    </div>
                </div>
                <div className="your-library">
                    <div className="library-stats-title">
                    <h2>{t.yourLibrary}</h2>
                    </div>
                    <div className="library-stats-overview">
                        <div className="stats-card">
                            <h2>{movieCount}</h2>
                            <p>{t.totalMovies}</p>
                        </div>
                        <div className="stats-card">
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
                                <p>{t.movies}</p>
                                <p>{moviePercentage.toFixed(2)}%</p>
                            </div>
                            <div className="display-percentage">
                                <p>{t.tvShows}</p>
                                <p>{tvShowPrecentage.toFixed(2)}%</p>
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