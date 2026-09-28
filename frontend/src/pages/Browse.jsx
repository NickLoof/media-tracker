import {useState, useEffect} from "react";
import "./Browse.css";
import {CircleX, Star} from "lucide-react"

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

    useEffect(() => {
        if(!movieClicked){
            return;
        }
        fetch(`http://localhost:3000/media-details/${movieClicked.id}?type=${typeFilter}`)
        .then((response) => response.json())
        .then((data) => {
            setMovieDetails(data);
        })
        fetch(`http://localhost:3000/media-videos/${movieClicked.id}?type=${typeFilter}`)
        .then((response) => response.json())
        .then((data) => {
        const trailer = data.results.find((video) => video.site === "YouTube" && video.type === "Trailer" && video.official === true)||
                        data.results.find((video) => video.site === "YouTube" && video.type === "Trailer")||
                        data.results.find((video) => video.site === "YouTube" && video.type === "Teaser" && video.official === true)||
                        data.results.find((video) => video.site === "YouTube" && video.type === "Teaser");
        setTrailerVideo(trailer)})
    }, [movieClicked, typeFilter]);

    useEffect(() => {
        let url = inputValue
        ? `/browse-movies?title=${encodeURIComponent(inputValue)}&type=${typeFilter}`
        : `/browse-movies?page=${page}&type=${typeFilter}&category=${category}&genre=${genreFilter}`
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
    }, [page, typeFilter, category, genreFilter, inputValue]);

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
        .then((response) =>{ if(response.status === 409) {setLibraryMessage("Movie already added!"); 
            return;
        }if(response.status === 201) {setLibraryMessage("Added to your Library!")}
        })
        };
   
    

    return (
        <div>
            <h1>Browse all media</h1>
            <div>
                <input type="text" placeholder="Search movies and Tv shows..." value={inputValue} onChange={(event) => setInputValue(event.target.value)}/>
            </div>
            <div>
                <button className={typeFilter === "Movie" ?"filter-button-active":"filter-button"} onClick={() => {setTypeFilter("Movie"); setGenreFilter(""); setPage(1);}}>Movies</button> |
                <button className={typeFilter === "Tv Show" ?"filter-button-active":"filter-button"} onClick={() => {setTypeFilter("Tv Show"); setGenreFilter(""); setPage(1);}}>Tv Shows </button> 
            </div>
            <div>
                <button className={category === "Popular" ?"filter-button-active":"filter-button"} onClick={() => {setCategory("Popular"); setPage(1);}}>Popular</button> |
                <button className={category === "New Releases" ?"filter-button-active":"filter-button"} onClick={() => {setCategory("New Releases"); setPage(1);}}>New Releases</button> |
                <button className={category === "Top Rated" ?"filter-button-active":"filter-button"} onClick={() => {setCategory("Top Rated"); setPage(1);}}>Top Rated</button>
            </div>
            <div>
                <label htmlFor="genreSelect">Genre: </label>
                <select id="genreSelect" value={genreFilter} onChange={(event) => {setGenreFilter(event.target.value); setPage(1)}}>
                    <option value={""}>All Genres</option>
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
                                {typeFilter === "Movie"?<>{hours}<abbr title="hours">h</abbr>
                                                          {minutes}<abbr title="minutes">m</abbr>
                                                        </>
                                                        : <>
                                                        {movieDetails?.number_of_seasons}{" "}
                                                        {movieDetails?.number_of_seasons === 1 ? "Season" : "Seasons"}
                                                        </>}
                                </p>
                            {movieDetails?.tagline&& <p className="tagline">{movieDetails.tagline}</p>}
                            <p>Type: {typeFilter}</p>
                            <p>Genre: {movieClicked.genre_ids.map((id) => genres.find((genre)=> genre.id===id).name).join(", ")}</p>
                            <p><Star className="star" fill="currentColor"/>{movieDetails?.vote_average.toFixed(1)} / 10</p>
                        </div>
                        </div>
                        {trailerVideo &&(<iframe className="trailer" src={`https://youtube.com/embed/${trailerVideo.key}`}></iframe>)}
                        <details><summary>Description: </summary>{movieClicked.overview}</details>
                        <button className="add-to-library-button" onClick={() => addToLibrary()}>Add to Library</button>
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
            <p>Current Page: {page}</p>
            <button className="page-button" onClick={() => setPage(page>=2?(page - 1):(page))}>Previous</button>
            {pageNumbers.map((number) => <button className={number === page ? "page-button-active":"page-button"} key={number} onClick={() => setPage(number)}>{number}</button>)}
            <button className="page-button" onClick={() => setPage(page<totalPages?page +1:page)}>Next</button>
        </div>
    );
};

export default Browse;