import {Star, CircleX, Search} from "lucide-react"
import { useState, useEffect, useRef, Fragment} from "react";
import "./MediaForm.css"
import { useContext } from "react";
import { LanguageContext } from "../context/languageContext";
import { translations } from "../../translations/translations";




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
    const [movieGenreMap, setMovieGenreMap] = useState({});
    const [tvGenreMap, setTvGenreMap] = useState({});
    const genreOptions = Object.values(type === "Movie"?movieGenreMap:tvGenreMap);
    const {language, setLanguage} = useContext(LanguageContext);
    const t = translations[language];

    useEffect(() => {
        fetch("http://localhost:3000/genres?type=Movie")
        .then((response) => 
            response.json())
        .then((data) => {
        const fetchedGenreMap = 
    data.genres.reduce((result, genre) => {
        result[genre.id] = genre.name;
        return result;
        },{});
        setMovieGenreMap(fetchedGenreMap);
    })
        fetch(`http://localhost:3000/genres?type=${"Tv Show"}`)
        .then((response) => 
            response.json())
        .then((data) => {
        const fetchedGenreMap = 
    data.genres.reduce((result, genre) => {
        result[genre.id] = genre.name;
        return result;
        },{});
        setTvGenreMap(fetchedGenreMap);
    })
    }, []);

    const handleSelect = (item) => {
        setTitle(item.title || item.name);
        setType(item.media_type === "movie" ? "Movie":"Tv Show");
        setSearchResults([]);
        setIsSearching(false);
        setSelectedMedia(item);
        const correctGenreMap = item.media_type === "movie"?movieGenreMap:tvGenreMap;

        const genres = item.genre_ids.map((id) => correctGenreMap[id]).filter((genre) => genre !== undefined);
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
            setErrorMessage(t.fillAllFields);
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);

            return;
        }
        fetch("http://localhost:3000/media", {method: "POST", headers: {"Content-Type": "application/json"}, 
            body: JSON.stringify({title, type, genre, status, rating, poster_path: selectedMedia?.poster_path || null, description: selectedMedia?.overview || "", 
                release_date: selectedMedia?.release_date || selectedMedia?.first_air_date || "", tmdb_id: selectedMedia?.id})})
        .then((response) => {
            if(response.status === 409) {setErrorMessage("Movie already added!"); 
            return;
        }if(response.status === 201) {return response.json()}
        })
        .then((data) => {
            if(data){props.addMedia(data);
            props.hideMediaForm();}
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
        }, 200);
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
                    <button type="button" className="media-form-close-button" onClick={props.hideMediaForm}><CircleX/></button>
                    <legend>{t.addMedia}</legend>
                        <div className="search-header">
                        <label htmlFor="title">{t.title}: </label>
                        <div className="search-container" ref={searchRef}>
                            <Search className="media-form-search-icon"/>
                        <input className="media-form-searchbar" placeholder={t.enterTitle} value={title} onChange={(event) => {setTitle(event.target.value); setSelectedMedia(null); setIsSearching(true);}}
                        onFocus={() => setIsSearching(true)}/>
                        {isSearching && searchResults.length > 0 && (<div className="search-dropdown">
                        {searchResults.map((item) => (<div key={item.id} className="search-result" onClick={() => handleSelect(item)} >
                            {item.poster_path?(<img className="search-poster" src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                            alt={item.title || item.name}/>):(<div className="no-poster">{t.noImage}</div>)}
                            <p>{item.title || item.name}{" "}({item.media_type === "movie" ? item.release_date?.slice(0, 4): item.first_air_date?.slice(0, 4)})</p></div>))}
                        </div>)}
                        </div>
                        {isSearching && title && (
                        <p>{t.resultsFound}: {searchResults.length}</p>
                        )}
                    </div>
                    <div className="media-form-filter-select">
                        <div className="media-form-type-select-container">
                            <label htmlFor="media-form-type-select">{t.type}: </label>
                            <select className="media-form-type-select" value={type} onChange={(event) => setType(event.target.value)}>
                                <option value="" disabled>{t.select}</option>
                                <option value="Movie">{t.movie}</option>
                                <option value="Tv Show">{t.tvShow}</option>
                            </select>
                        </div>
                        <div className="media-form-genre-select-container">
                            <label>{t.genre}: </label>
                            <div className="media-form-genres">
                                {selectedMedia?<p>{genre.join(", ")}</p>:
                                (genreOptions.map((genreOption) => (<Fragment key={genreOption}>
                                <input className="media-form-genre-checkbox" value ={genreOption} type="checkbox" id={`genre-${genreOption}`} 
                                checked={genre.includes(genreOption)} onChange={() => handleGenreChange(genreOption)}/>
                                <label className="media-form-genre-chip" htmlFor={`genre-${genreOption}`}>{genreOption}</label>
                                </Fragment>)))}
                            </div>
                        </div>
                        <div className="media-form-status-select-container">
                            <label htmlFor="media-form-status-select">{t.status}: </label>
                            <select className="media-form-status-select" value={status} onChange={(event) => setStatus(event.target.value)}>
                                <option value="" disabled>{t.select}</option>
                                <option value=" Want to Watch">{t.wantToWatch}</option>
                                <option value="Watching">{t.watching}</option>
                                <option value="Completed">{t.completed}</option>
                                <option value="On Hold">{t.onHold}</option>
                                <option value="Dropped">{t.dropped}</option>
                            </select>
                        </div>
                    </div>
                    <div id="ratingSelect" className="media-form-star-rating">{t.rating}: 
                        {starCount.map((star) => (
                            <Star className="media-form-star" key={star} onClick={() => setRating(star)} fill={rating >= star ? "currentColor" : "none"} /> 
                        ))}
                    </div>
                    <button className="submit-button" type="submit">{t.addMedia}</button>
                    <p>{errorMessage}</p>
                </fieldset>
            </form>
        </>
    )
}

export default MediaForm;