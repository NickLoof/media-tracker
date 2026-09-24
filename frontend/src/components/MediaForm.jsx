import {Star, CircleX} from "lucide-react"
import { useState, useEffect, useRef, Fragment} from "react";
import "./MediaForm.css"

const genreMap = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Musical",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    53: "Thriller",
    10752: "War",
    37: "Western"
};
const genreOptions = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Musical",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Sport",
    "Superhero",
    "Thriller",
    "War",
    "Western",
    "Anime"
];

const MediaForm = (props) => {
    const [rating, setRating] = useState(0);
    const starCount = [1, 2, 3, 4, 5];
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [genre, setGenre] = useState([]);
    const [status, setStatus] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const searchRef = useRef(null);

    const handleSelect = (item) => {
        console.log(item);
        setTitle(item.title || item.name);
        setType(item.media_type === "movie" ? "Movie":"Tv Show");
        setSearchResults([]);
        setIsSearching(false);
        setSelectedMedia(item);

        const genres = item.genre_ids.map((id) => genreMap[id]);
        setGenre(genres);
    }

    const handleGenreChange = (genreOption) => {
        if (genre.includes(genreOption)) {
            return setGenre(genre.filter((item) => item !== genreOption));
        }
        setGenre([...genre, genreOption]);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(title ==="" || type === "" || genre.length === 0 || status === "" || rating === 0){
            setErrorMessage("Please fill out all fields!");
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);

            return;
        }
        fetch("http://localhost:3000/media", {method: "POST", headers: {"Content-Type": "application/json"}, 
            body: JSON.stringify({title, type, genre, status, rating, poster_path: selectedMedia?.poster_path || null, description: selectedMedia?.overview || "", 
                release_date: selectedMedia?.release_date || selectedMedia?.first_air_date || ""})})
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            props.addMedia(data);
            props.hideMediaForm();
        });
        }

    useEffect(() => {
        if(!isSearching){
            return;
        }
        if(title === ""){
            setSearchResults([]);
            return;
        }
        const timer = setTimeout(() => {
            fetch(`http://localhost:3000/search?title=${encodeURIComponent(title)}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setSearchResults(data);
            })
        }, 500);
        return() => {
            clearTimeout(timer);
        };
    }, [title, isSearching]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)){
                setIsSearching(false);
            }
        };
    document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <fieldset className="media-form">
                    <button type="button" className="close-button" onClick={props.hideMediaForm}><CircleX /></button>
                    <legend>Add Media</legend>
                        <div className="search-header">
                        <label htmlFor="title">Title: </label>
                        <div className="search-container" ref={searchRef}>
                        <input id="Title" placeholder="Enter Title" value={title} onChange={(event) => {setTitle(event.target.value); setSelectedMedia(null); setIsSearching(true);}}
                        onFocus={() => setIsSearching(true)}/>
                        {isSearching && searchResults.length > 0 && (<div className="search-dropdown">
                        {searchResults.map((item) => (<div key={item.id} className="search-result" onClick={() => handleSelect(item)} >
                            {item.poster_path?(<img className="search-poster" src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                            alt={item.title || item.name}/>):(<div className="no-poster">No Image</div>)}
                            <p>{item.title || item.name}{item.media_type === "movie" ? item.release_date?.slice(0, 4): item.first_air_date?.slice(0, 4)}</p></div>))}
                        </div>)}
                        </div>
                        <p>Results found: {searchResults.length}</p>
                    </div>
                    <label htmlFor="typeSelect">Type: </label>
                    <select id="typeSelect" className="media-select" value={type} onChange={(event) => setType(event.target.value)}>
                        <option value="" disabled>Select</option>
                        <option value="Movie">Movie</option>
                        <option value="Tv Show">Tv Show</option>
                    </select>
                    <label htmlFor="genreCheckbox">Genre: </label>
                    {genreOptions.map((genreOption) => <Fragment key={genreOption}>
                            <input value ={genreOption} type="checkbox" id="genreCheckbox" checked={genre.includes(genreOption)} onChange={() => handleGenreChange(genreOption)}/>
                            <label htmlFor="genreCheckbox">{genreOption}</label>
                            </Fragment>)}
                    <label htmlFor="statusSelect">Status: </label>
                    <select id="statusSelect" className="media-select" value={status} onChange={(event) => setStatus(event.target.value)}>
                        <option value="" disabled>Select</option>
                        <option value=" Want to Watch">Want to Watch</option>
                        <option value="Watching">Watching</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Dropped">Dropped</option>
                    </select>
                    <div id="ratingSelect" className="star-rating">Rating: 
                        {starCount.map((star) => (
                            <Star key={star} onClick={() => setRating(star)} fill={rating >= star ? "currentColor" : "none"} /> 
                        ))}
                        <p>Selected Rating: {rating}</p>
                    </div>
                    <button type="submit">Add Movie</button>
                    <p>{errorMessage}</p>
                </fieldset>
            </form>
        </>
    )
}

export default MediaForm;