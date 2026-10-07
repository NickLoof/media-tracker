import {useState, useEffect} from "react";
import "./Browse.css";
import { useContext } from "react";
import { LanguageContext } from "../context/languageContext.js";
import { translations } from "../../translations/translations";
import MediaDetails from "../components/MediaDetails";
import { Search } from "lucide-react";
import { API_URL } from "../../api.js";

const Browse = () =>{
    const [page, setPage] = useState(1);
    const [movies, setMovies] = useState([]);
    const [typeFilter, setTypeFilter] = useState("Movie");
    const [category, setCategory] = useState("Popular");
    const [totalPages, setTotalPages] = useState(0);
    const pageNumbers = (page<3?[1, 2, 3, 4, 5]:[page -2, page-1, page, page + 1, page +2]).filter((number)=> number <= totalPages);
    const [genres, setGenres] = useState([]);
    const [genreFilter, setGenreFilter] = useState("");
    const [movieClicked, setMovieClicked] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const {language} = useContext(LanguageContext);
    const t = translations[language];


    useEffect(() => {
        let url = inputValue
        ? `/browse-movies?title=${encodeURIComponent(inputValue)}&type=${typeFilter}&language=${language}`
        : `/browse-movies?page=${page}&type=${typeFilter}&category=${category}&genre=${genreFilter}&language=${language}`
        const timer = setTimeout(() =>{
        fetch(`${API_URL}${url}`)
        .then((response) => response.json())
        .then((data) => {
            setMovies(data.results);
            setTotalPages(data.total_pages);})
        .catch((error) => {
            console.error("Browse FETCH ERROR", error);
        });  
    }, 200); 
    return () => clearTimeout(timer);
    }, [page, typeFilter, category, genreFilter, inputValue, language]);

    useEffect(() => {

        fetch(`${API_URL}/genres?type=${typeFilter}&language=${language}`)
        .then((response)=> response.json())
        .then((data) => {
            setGenres(data.genres)});
    },[typeFilter, language])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behaviour: "smooth"
        });
    }, [page])
   
    

    return (
        <>
        <div className="browse-title-container">
            <h1>{t.browseAllMedia}</h1>
        </div>
        <div className="browse-layout">
            <div className="browse-search-wrapper">
                <Search className="browse-search-icon"/>
                <input className="browse-searchbar" type="text" placeholder={t.searchPlaceholder} value={inputValue} onChange={(event) => setInputValue(event.target.value)}/>
            </div>
            <div className="filter-group">
            <div className="type-filters">
                <button className={typeFilter === "Movie" ?"filter-button-active":"filter-button"} onClick={() => {setTypeFilter("Movie"); setGenreFilter(""); setPage(1);}}>{t.movies}</button>
                <button className={typeFilter === "Tv Show" ?"filter-button-active":"filter-button"} onClick={() => {setTypeFilter("Tv Show"); setGenreFilter(""); setPage(1);}}>{t.tvShows} </button> 
            </div>
            <div className="category-filters">
                <button className={category === "Popular" ?"filter-button-active":"filter-button"} onClick={() => {setCategory("Popular"); setPage(1);}}>{t.popular}</button>
                <button className={category === "New Releases" ?"filter-button-active":"filter-button"} onClick={() => {setCategory("New Releases"); setPage(1);}}>{t.newReleases}</button> 
                <button className={category === "Top Rated" ?"filter-button-active":"filter-button"} onClick={() => {setCategory("Top Rated"); setPage(1);}}>{t.topRated}</button>
            </div>
            </div>
            <div>
                <label htmlFor="genre-select">{t.genre}: </label>
                <select className="genre-select" value={genreFilter} onChange={(event) => {setGenreFilter(event.target.value); setPage(1)}}>
                    <option value={""}>{t.allGenres}</option>
                    {genres.map((genre) => (<option key={genre.id} value={genre.id}>{genre.name}</option>))}
                </select>
            </div>
            {movieClicked&&(
                <MediaDetails selectedMedia={movieClicked} type={typeFilter} onClose={() => setMovieClicked(null)}/>)}

            <div className="browse-grid">
            {movies.map((movie) => (
                <div className="browse-movie-card" key={movie.id} onClick={() => {setMovieClicked(movie)}}>
                    <img className="browse-poster" src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title || movie.name}/>
                    <div className="movie-title">
                        <p>{movie.title||movie.name}{" "}({movie.release_date?.slice(0,4)||movie.first_air_date?.slice(0,4)})</p>
                    </div>
                </div>))}
            </div>
            {/*<p>{t.currentPage}: {page}</p>*/}
            <div className="page-navigation">
                <button className="previous-button" onClick={() => setPage(page>=2?(page - 1):(page))}>{t.previous}</button>
                    {pageNumbers.map((number) => <button className={number === page ? "page-button-active":"page-button"} key={number} onClick={() => setPage(number)}>{number}</button>)}
                <button className="next-button" onClick={() => setPage(page<totalPages?page +1:page)}>{t.next}</button>
            </div>
        </div>
        </>
    );
};

export default Browse;