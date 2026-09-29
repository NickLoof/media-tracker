import {useEffect, useState} from "react";
import MediaForm from "../components/MediaForm";
import "./Library.css";
import {Star} from "lucide-react"
import { useContext } from "react";
import { LanguageContext } from "../context/languageContext";
import { translations } from "../../translations/translations";

const Library = () => {
    const starCount = [1, 2, 3, 4, 5];
    const [media, setMedia] = useState([]);
    const [showMedia, setShowMedia] = useState(false);
    const [typeFilter, setTypeFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const {language, setLanguage} = useContext(LanguageContext);
    const t = translations[language];

    const showMediaForm = () => {
        setShowMedia(true);
    }
    const hideMediaForm = () => {
        setShowMedia(false);
    }
    const addMedia = (newMedia) => {
        setMedia([...media, newMedia]);
    }
    const deleteMedia = (id) => {
        fetch(`http://localhost:3000/media/${id}`,{
            method: "DELETE"
        }).then(() => {
            const updatedMedia = media.filter((item) => item.id !== id)
        setMedia(updatedMedia);
        });
    }
    const updateStatus = (id, newStatus) => {
        const updatedMedia = media.map((item) => {
            if(item.id === id){
            return {...item, status: newStatus}
        }else{
            return item;
        }
        });
        setMedia(updatedMedia);
        fetch(`http://localhost:3000/media/${id}`, {
            method: "PATCH", headers:{"Content-Type": "application/json"}, body: JSON.stringify({status: newStatus})
        });
    };

    const updateRating = (id, newRating) => {
        const updatedMedia = media.map((item) => {
            if(item.id === id){
            return {...item, rating: newRating}
        }else{
            return item;
        }
        });
        setMedia(updatedMedia);
        fetch(`http://localhost:3000/media/${id}`, {
            method: "PATCH", headers:{"Content-Type": "application/json"}, body: JSON.stringify({rating: newRating})
        });
    };
    
    const filteredMedia = media.filter((item) => {
        return (typeFilter === "All" || item.type === typeFilter) && (statusFilter === "All" || item.status === statusFilter);
    })
    

  useEffect(() => {
  fetch("http://localhost:3000/media")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    setMedia(data);
  });
  }, []);
    return (
        <div>
            <h1>{t.myLibrary}</h1>
            <button className="add-button" onClick={showMediaForm}>+ {t.addMedia}</button>
            <div className="type-filter">
                <button className={typeFilter === "All" ? "filter-button-active":"filter-button"} onClick={() => setTypeFilter("All")}>{t.all}</button> | 
                <button className={typeFilter === "Movie" ? "filter-button-active":"filter-button"} onClick={() => setTypeFilter("Movie")}>{t.movies}</button> | 
                <button className={typeFilter === "Tv Show" ? "filter-button-active":"filter-button"} onClick={() => setTypeFilter("Tv Show")}>{t.tvShows}</button>
            </div>
            <div className="status-filter">
                <button className={statusFilter === "All" ? "filter-button-active":"filter-button"} onClick={() => setStatusFilter("All")}>{t.all}</button> | 
                <button className={statusFilter === "Want to Watch"?"filter-button-active":"filter-button"} onClick={() => setStatusFilter("Want to Watch")}>{t.wantToWatch}</button> | 
                <button className={statusFilter === "Watching"?"filter-button-active":"filter-button"} onClick={() => setStatusFilter("Watching")}>{t.watching}</button>
                <button className={statusFilter === "Completed"?"filter-button-active":"filter-button"} onClick={() => setStatusFilter("Completed")}>{t.completed}</button> | 
                <button className={statusFilter === "On Hold"?"filter-button-active":"filter-button"} onClick={() => setStatusFilter("On Hold")}>{t.onHold}</button> |
                <button className={statusFilter === "Dropped"?"filter-button-active":"filter-button"} onClick={() => setStatusFilter("Dropped")}>{t.dropped}</button>
            </div>
            {showMedia && <MediaForm hideMediaForm={hideMediaForm} addMedia={addMedia}/>}
            {filteredMedia.length === 0 && <p>{t.noMediaMatches}</p>}
            {filteredMedia.map((item) => {
            return(
            <div className="movie-card" key={item.id}>    
            <div className="movie-card-body">
                <img className="library-poster" src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name}/>
                <div className="movie-card-info">
                    <h2>{item.title}</h2>
                    <p>{item.release_date}</p>
                    <p>{t.type}: {item.type}</p>
                    <p>{t.genre}: {item.genre}</p>
                    <label htmlFor="typeSelect">{t.status}:</label>
                    <select id="statusSelect" value={item.status} onChange={(event) => updateStatus(item.id, event.target.value)}>
                        <option value="Want to Watch">{t.wantToWatch}</option>
                        <option value="Watching">{t.watching}</option>
                        <option value="Completed">{t.completed}</option>
                        <option value="On Hold">{t.onHold}</option>
                        <option value="Dropped">{t.dropped}</option>
                    </select>
                    <div className="star-rating"> 
                        {starCount.map((star) => (
                            <Star key={star} onClick={() => updateRating(item.id, star)} fill={item.rating >= star ? "currentColor" : "none"} /> 
                        ))}
                        <p>{t.selectedRating}: {item.rating}</p>
                    </div>
                    <button className="remove-button" onClick={() => deleteMedia(item.id)}>{t.remove}</button>
                </div>
            </div>
            <details className="details"><summary>{t.description}:</summary> {item.description}</details>
            </div>
            )
            })}
        </div>
    );
};

export default Library;