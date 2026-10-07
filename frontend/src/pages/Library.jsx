import {useEffect, useState} from "react";
import MediaForm from "../components/MediaForm";
import "./Library.css";
import {Star} from "lucide-react"
import { useContext } from "react";
import { LanguageContext } from "../context/languageContext.js";
import { translations } from "../../translations/translations";
import MediaDetails from "../components/MediaDetails";
import { useSearchParams } from "react-router-dom";

const Library = () => {
    const starCount = [1, 2, 3, 4, 5];
    const [media, setMedia] = useState([]);
    const [showMedia, setShowMedia] = useState(false);
    const [typeFilter, setTypeFilter] = useState("All");
    const [searchParams] = useSearchParams();
    const statusFromUrl = searchParams.get("status");
    const [statusFilter, setStatusFilter] = useState(statusFromUrl || "All");
    const {language} = useContext(LanguageContext);
    const t = translations[language];
    const [selectedMedia, setSelectedMedia] = useState(null);

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
        <>
        <div className="library-title-container">
                <h1>{t.myLibrary}</h1>
        </div>
        <div className="library-layout">
            <button className="add-button" onClick={showMediaForm}>+ {t.addMedia}</button>
            <div className="type-filter">
                <button className={typeFilter === "All" ? "filter-button-active":"filter-button"} onClick={() => setTypeFilter("All")}>{t.all}</button>
                <button className={typeFilter === "Movie" ? "filter-button-active":"filter-button"} onClick={() => setTypeFilter("Movie")}>{t.movies}</button> 
                <button className={typeFilter === "Tv Show" ? "filter-button-active":"filter-button"} onClick={() => setTypeFilter("Tv Show")}>{t.tvShows}</button>
            </div>
            <div className="status-filter">
                <button className={statusFilter === "All" ? "filter-button-active":"filter-button"} onClick={() => setStatusFilter("All")}>{t.all}</button> 
                <button className={statusFilter === "Want to Watch"?"filter-button-active":"filter-button"} onClick={() => setStatusFilter("Want to Watch")}>{t.wantToWatch}</button> 
                <button className={statusFilter === "Watching"?"filter-button-active":"filter-button"} onClick={() => setStatusFilter("Watching")}>{t.watching}</button>
                <button className={statusFilter === "Completed"?"filter-button-active":"filter-button"} onClick={() => setStatusFilter("Completed")}>{t.completed}</button> 
                <button className={statusFilter === "On Hold"?"filter-button-active":"filter-button"} onClick={() => setStatusFilter("On Hold")}>{t.onHold}</button>
                <button className={statusFilter === "Dropped"?"filter-button-active":"filter-button"} onClick={() => setStatusFilter("Dropped")}>{t.dropped}</button>
            </div>
            {showMedia && <MediaForm hideMediaForm={hideMediaForm} addMedia={addMedia}/>}
            {filteredMedia.length === 0 && <p>{t.noMediaMatches}</p>}
            {selectedMedia && <MediaDetails selectedMedia={selectedMedia} type={selectedMedia.type} onClose={() => setSelectedMedia(null)} fromLibrary={true}/>}
            <div className="library-grid">
            {filteredMedia.map((item) => {
            return(
            <div onClick={() => setSelectedMedia(item)} className="library-card" key={item.id}>    
            <div className="library-card-body">
                <img className="library-poster" src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name}/>
                <div className="library-card-info">
                    <h2>{item.title}{" "}({item.release_date?.slice(0, 4)})</h2>
                    <p><select className="status-select" value={item.status} onClick={(event) => event.stopPropagation()} onChange={(event) => updateStatus(item.id, event.target.value)}>
                        <option value="Want to Watch">{t.wantToWatch}</option>
                        <option value="Watching">{t.watching}</option>
                        <option value="Completed">{t.completed}</option>
                        <option value="On Hold">{t.onHold}</option>
                        <option value="Dropped">{t.dropped}</option>
                    </select></p>
                    <div className="library-card-bottom">
                        <div className="star-rating"> 
                            {starCount.map((star) => (
                            <Star className="star" key={star} onClick={(event) => {event.stopPropagation(); updateRating(item.id, star);}} fill={item.rating >= star ? "currentColor" : "none"} />
                             
                            ))}
                        </div>
                        <button className="remove-button" onClick={(event) => {event.stopPropagation(); deleteMedia(item.id)}}>{t.remove}</button>
                    </div>
                </div>
            </div>
            </div>
            )
            })}
            </div>
        </div>
        </>
    );
};
                    {/*<p>{t.type}: {item.type}</p>
                    <p>{t.genre}: {item.genre}</p>
                    <label htmlFor="typeSelect">{t.status}:</label>
                    
                    
                    <button className="remove-button" onClick={() => deleteMedia(item.id)}>{t.remove}</button>*/}
                
            {/*<details className="details"><summary>{t.description}:</summary> {item.description}</details>*/}
            

export default Library;