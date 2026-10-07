import {CircleX, Star} from "lucide-react";
import {useState, useEffect} from "react";
import { useContext } from "react";
import { LanguageContext } from "../context/languageContext.js";
import { translations } from "../../translations/translations";
import "./MediaDetails.css";
import { API_URL } from "../../api.js";

const MediaDetails = ({selectedMedia, type, onClose, fromLibrary = false}) => {

    const [movieDetails, setMovieDetails] = useState(null);
    const [trailerVideo, setTrailerVideo] = useState(null);
    const {language} = useContext(LanguageContext);
    const t = translations[language];
    const hours = Math.floor((movieDetails?.runtime || 0) / 60);
    const minutes = (movieDetails?.runtime || 0) % 60;
    const [libraryMessage, setLibraryMessage] = useState("");
    const tmdbId = selectedMedia.tmdb_id || selectedMedia.id;
    const isInLibrary = fromLibrary || selectedMedia.tmdb_id != null;
    const isManualMedia = fromLibrary && selectedMedia.tmdb_id == null;
    

    useEffect(() => {
        if(!selectedMedia){
            return;
        }
        if (isManualMedia) {
            setMovieDetails(selectedMedia);
            setTrailerVideo(null);
            return;
        }
        fetch(`${API_URL}/media-details/${tmdbId}?type=${type}&language=${language}`)
        .then((response) => response.json())
        .then((data) => {
            setMovieDetails(data);
        })
        fetch(`${API_URL}/media-videos/${tmdbId}?type=${type}`)
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
    }, [selectedMedia, type, language, tmdbId]);

     const addToLibrary = () => {
        const libraryFormat = {
            title: selectedMedia.title || selectedMedia.name,
            type: type,
            genre: movieDetails?.genres.map((genre) => genre.name),
            status: "Want to Watch",
            rating: 3,
            poster_path: selectedMedia.poster_path,
            description: selectedMedia.overview,
            release_date: selectedMedia.release_date || selectedMedia.first_air_date,
            tmdb_id: selectedMedia.id
        }
        fetch(`${API_URL}/media`, {method: "POST", headers:{"Content-Type": "application/json"}, body: JSON.stringify(libraryFormat)})
        .then((response) =>{ if(response.status === 409) {setLibraryMessage(t.alreadyInLibrary); 
            return;
        }if(response.status === 201) {setLibraryMessage(t.addedToLibrary)}
        })
        };

    return (
        <div>
            <div className="movie-overlay">
                    <div className="movie-popup">
                        <div className="movie-backdrop" style={{backgroundImage: movieDetails?.backdrop_path
                        ? `url(https://image.tmdb.org/t/p/w780${movieDetails.backdrop_path})`
                        : "none"}}>
                        <button className="close-button" onClick={onClose}><CircleX/></button>
                        </div>
                        <div className="media-details-body">
                        <div className="poster">
                            {selectedMedia.poster_path 
                            ? (<img src={`https://image.tmdb.org/t/p/w200${selectedMedia.poster_path}`} alt={selectedMedia.title || selectedMedia.name}/>) 
                            : (<div className="no-poster">{t.noImage}</div>)}
                        </div>
                        <div className="movie-info">
                            
                            <p>{selectedMedia.title || selectedMedia.name}</p>
                            <p>{selectedMedia.release_date?.slice(0, 4) || selectedMedia.first_air_date?.slice(0,4)}{" • "}
                                {type === "Movie"?<>{hours}<abbr title={t.hours}>h</abbr>
                                                          {minutes}<abbr title={t.minutes}>m</abbr>
                                                        </>
                                                        : <>
                                                        {movieDetails?.number_of_seasons}{" "}
                                                        {movieDetails?.number_of_seasons === 1 ? t.season : t.seasons}
                                                        </>}
                                </p>
                            {movieDetails?.tagline&& <p className="tagline">{movieDetails.tagline}</p>}
                            <p>{t.type}: {type === "Movie" ? t.movie : t.tvShow}</p>
                            <p>{t.genre}: {movieDetails?.genres
                            ?movieDetails.genres.map((genre) => genre.name).join(", ")
                            :selectedMedia.genre}</p>
                            {movieDetails?.vote_average != null && (
                            <p><Star className="star" fill="currentColor"/>{movieDetails?.vote_average.toFixed(1)} / 10</p>)}
                        </div>
                        </div>
                        {trailerVideo &&(<iframe className="trailer" src={`https://youtube.com/embed/${trailerVideo.key}`}></iframe>)}
                        <details className="modal-details"><summary>{t.description}: </summary>{movieDetails?.overview || selectedMedia.description}</details>
                        {!isInLibrary?(<button className="add-to-library-button" onClick={() => addToLibrary()}>{t.addToLibrary}</button>):(<p className="library-status">{t.inLibrary}</p>)}
                        {libraryMessage &&(<p>{libraryMessage}</p>)}
                    </div>
                </div>
        </div>
    );
};

export default MediaDetails;