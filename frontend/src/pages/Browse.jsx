import {useState, useEffect} from "react";
import "./Browse.css";
import {CircleX, Star} from "lucide-react"
import { useContext } from "react";
import { LanguageContext } from "../context/languageContext";
import { translations } from "../../translations/translations";

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
    const [libraryMessage, setLibraryMessage] = useState("");
    const [movieDetails, setMovieDetails] = useState(null);
    const hours = Math.floor((movieDetails?.runtime || 0) / 60);
    const minutes = (movieDetails?.runtime || 0) % 60;
    const [trailerVideo, setTrailerVideo] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const {language, setLanguage} = useContext(LanguageContext);
    const t = translations[language];

    useEffect(() => {
        if(!movieClicked){
            return;
        }
        fetch(`http://localhost:3000/media-details/${movieClicked.id}?type=${typeFilter}&language=${language}`)
        .then((response) => response.json())
        .then((data) => {
            setMovieDetails(data);
        })
        fetch(`http://localhost:3000/media-videos/${movieClicked.id}?type=${typeFilter}`)
        .then((response) => response.json())
        .then((data) => {
        const germanVideos = data.results.filter((video) => video.iso_639_1 === "de");
        const englishVideos = data.results.filter((video) => video.iso_639_1 === "en");
        const germanTrailer = germanVideos.find((video) => video.site === "YouTube" && video.type === "Trailer" && video.official === true)||
                              germanVideos.find((video) => video.site === "YouTube" && video.type === "Trailer")||
                              germanVideos.find((video) => video.site === "YouTube" && video.type === "Teaser" && video.official === true)||
                              germanVideos.find((video) => video.site === "YouTube" && video.type === "Teaser");
        const englishTrailer = englishVideos.find((video) => video.site === "YouTube" && video.type === "Trailer" && video.official === true)||
                               englishVideos.find((video) => video.site === "YouTube" && video.type === "Trailer")||
                               englishVideos.find((video) => video.site === "YouTube" && video.type === "Teaser" && video.official === true)||
                               englishVideos.find((video) => video.site === "YouTube" && video.type === "Teaser");
        const trailer = language === "de"? germanTrailer || englishTrailer:englishTrailer;
                         
        setTrailerVideo(trailer)})
    }, [movieClicked, typeFilter, language]);

    useEffect(() => {
        let url = inputValue
        ? `/browse-movies?title=${encodeURIComponent(inputValue)}&type=${typeFilter}&language=${language}`
        : `/browse-movies?page=${page}&type=${typeFilter}&category=${category}&genre=${genreFilter}&language=${language}`
        const timer = setTimeout(() =>{
        fetch(`http://localhost:3000${url}`)
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

        fetch(`http://localhost:3000/genres?type=${typeFilter}`)
        .then((response)=> response.json())
        .then((data) => {
            setGenres(data.genres)});
    },[typeFilter])


   const addToLibrary = () => {
        const libraryFormat = {
            title: movieClicked.title || movieClicked.name,
            type: typeFilter,
            genre: movieClicked.genre_ids.map((id) => genres.find((genre)=> genre.id===id).name),
            status: "Want to Watch",
            rating: 3,
            poster_path: movieClicked.poster_path,
            description: movieClicked.overview,
            release_date: movieClicked.release_date || movieClicked.first_air_date,
            tmdb_id: movieClicked.id
        }
        fetch("http://localhost:3000/media", {method: "POST", headers:{"Content-Type": "application/json"}, body: JSON.stringify(libraryFormat)})
        .then((response) =>{ if(response.status === 409) {setLibraryMessage(t.alreadyInLibrary); 
            return;
        }if(response.status === 201) {setLibraryMessage(t.addedToLibrary)}
        })
        };
   
    

    return (
        <div>
            <h1>{t.browseAllMedia}</h1>
            <div>
                <input type="text" placeholder={t.searchPlaceholder} value={inputValue} onChange={(event) => setInputValue(event.target.value)}/>
            </div>
            <div>
                <button className={typeFilter === "Movie" ?"filter-button-active":"filter-button"} onClick={() => {setTypeFilter("Movie"); setGenreFilter(""); setPage(1);}}>{t.movies}</button> |
                <button className={typeFilter === "Tv Show" ?"filter-button-active":"filter-button"} onClick={() => {setTypeFilter("Tv Show"); setGenreFilter(""); setPage(1);}}>{t.tvShows} </button> 
            </div>
            <div>
                <button className={category === "Popular" ?"filter-button-active":"filter-button"} onClick={() => {setCategory("Popular"); setPage(1);}}>{t.popular}</button> |
                <button className={category === "New Releases" ?"filter-button-active":"filter-button"} onClick={() => {setCategory("New Releases"); setPage(1);}}>{t.newReleases}</button> |
                <button className={category === "Top Rated" ?"filter-button-active":"filter-button"} onClick={() => {setCategory("Top Rated"); setPage(1);}}>{t.topRated}</button>
            </div>
            <div>
                <label htmlFor="genreSelect">{t.genre}: </label>
                <select id="genreSelect" value={genreFilter} onChange={(event) => {setGenreFilter(event.target.value); setPage(1)}}>
                    <option value={""}>{t.allGenres}</option>
                    {genres.map((genre) => (<option key={genre.id} value={genre.id}>{genre.name}</option>))}
                </select>
            </div>
            {movieClicked&&(
                <div className="movie-overlay">
                    <div className="movie-popup">
                        <div className="movie-backdrop" style={{backgroundImage: `url(https://image.tmdb.org/t/p/w780${movieDetails?.backdrop_path})`}}>
                        <button className="close-button" onClick={()=>{setMovieClicked(null); setLibraryMessage("")}}><CircleX/></button>
                        </div>
                        <div className="movie-card-body">
                        <div className="poster">
                            <img src={`https://image.tmdb.org/t/p/w200${movieClicked.poster_path}`}></img>
                        </div>
                        <div className="movie-info">
                            
                            <p>{movieClicked.title || movieClicked.name}</p>
                            <p>{movieClicked.release_date?.slice(0, 4) || movieClicked.first_air_date?.slice(0,4)}{" • "}
                                {typeFilter === "Movie"?<>{hours}<abbr title={t.hours}>h</abbr>
                                                          {minutes}<abbr title={t.minutes}>m</abbr>
                                                        </>
                                                        : <>
                                                        {movieDetails?.number_of_seasons}{" "}
                                                        {movieDetails?.number_of_seasons === 1 ? t.season : t.seasons}
                                                        </>}
                                </p>
                            {movieDetails?.tagline&& <p className="tagline">{movieDetails.tagline}</p>}
                            <p>{t.type}: {typeFilter === "Movie" ? t.movie : t.tvShow}</p>
                            <p>{t.genre}: {movieClicked.genre_ids.map((id) => genres.find((genre)=> genre.id===id).name).join(", ")}</p>
                            <p><Star className="star" fill="currentColor"/>{movieDetails?.vote_average.toFixed(1)} / 10</p>
                        </div>
                        </div>
                        {trailerVideo &&(<iframe className="trailer" src={`https://youtube.com/embed/${trailerVideo.key}`}></iframe>)}
                        <details><summary>{t.description}: </summary>{movieClicked.overview}</details>
                        <button className="add-to-library-button" onClick={() => addToLibrary()}>{t.addToLibrary}</button>
                        {libraryMessage &&(<p>{libraryMessage}</p>)}
                    </div>
                </div>)}
            <div className="browse-grid">
            {movies.map((movie) => (
                <div className="browse-movie-card" key={movie.id} onClick={() => {setMovieClicked(movie)}}>
                    <img className="browse-poster" src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title || movie.name}/>
                    <div className="movie-title">
                        <p>{movie.title||movie.name}{" "}({movie.release_date?.slice(0,4)||movie.first_air_date?.slice(0,4)})</p>
                    </div>
                </div>))}
            </div>
            <p>{t.currentPage}: {page}</p>
            <button className="page-button" onClick={() => setPage(page>=2?(page - 1):(page))}>{t.previous}</button>
            {pageNumbers.map((number) => <button className={number === page ? "page-button-active":"page-button"} key={number} onClick={() => setPage(number)}>{number}</button>)}
            <button className="page-button" onClick={() => setPage(page<totalPages?page +1:page)}>{t.next}</button>
        </div>
    );
};

export default Browse;