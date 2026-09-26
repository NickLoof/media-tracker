import {useState, useEffect} from "react";
import "./Browse.css";

const Browse = () =>{
    const [page, setPage] = useState(1);
    const [movies, setMovies] = useState([]);
    const [typeFilter, setTypeFilter] = useState("Movie");
    const [category, setCategory] = useState("Popular");
    const [totalPages, setTotalPages] = useState(0);
    const pageNumbers = (page<3?[1, 2, 3, 4, 5]:[page -2, page-1, page, page + 1, page +2]).filter((number)=> number <= totalPages);
    const [genres, setGenres] = useState([]);
    const [genreFilter, setGenreFilter] = useState("");

    useEffect(() => {
        fetch(`http://localhost:3000/browse-movies?page=${page}&type=${typeFilter}&category=${category}&genre=${genreFilter}`)
        .then((response) => response.json())
        .then((data) => {
            setMovies(data.results);
            setTotalPages(data.total_pages)})
    }, [page, typeFilter, category, genreFilter]);

    useEffect(() => {

        fetch(`http://localhost:3000/genres?type=${typeFilter}`)
        .then((response) => response.json())
        .then((data) => {
            setGenres(data.genres)});
    },[typeFilter])

    

    return (
        <div>
            <h1>Browse all media</h1>
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
            <div className="browse-grid">
            {movies.map((movie) => (
                <div className="browse-movie-card" key={movie.id}>
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
}

export default Browse;