import {useEffect, useState} from "react";
import MediaForm from "../components/MediaForm";
import "./Library.css";
import {Star} from "lucide-react"

const Library = () => {
    const starCount = [1, 2, 3, 4, 5];
    const [media, setMedia] = useState([]);
    const [showMedia, setShowMedia] = useState(false);

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

  useEffect(() => {
  fetch("http://localhost:3000/media")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data)
    setMedia(data);
  });
  }, []);
    return (
        <div>
            <h1>My Library</h1>
            <button className="add-button" onClick={showMediaForm}>+ Add Media</button>
            {showMedia && <MediaForm hideMediaForm={hideMediaForm} addMedia={addMedia}/>}
            {media.map((item) => {
            return(
            <div className="movie-card" key={item.id}>    
            <div className="movie-card-body">
                <img className="library-poster" src={`https://image.tmdb.org/t/p/w200${item.poster_path}`} alt={item.title || item.name}/>
                <div className="movie-card-info">
                    <h2>{item.title}</h2>
                    <p>{item.release_date}</p>
                    <p>Type: {item.type}</p>
                    <p>Genre: {item.genre}</p>
                    <label htmlFor="typeSelect">Status:</label>
                    <select id="statusSelect" value={item.status} onChange={(event) => updateStatus(item.id, event.target.value)}>
                        <option value="Want to Watch">Want to Watch</option>
                        <option value="Watching">Watching</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Dropped">Dropped</option>
                    </select>
                    <div className="star-rating"> 
                        {starCount.map((star) => (
                            <Star key={star} onClick={() => updateRating(item.id, star)} fill={item.rating >= star ? "currentColor" : "none"} /> 
                        ))}
                        <p>Selected Rating: {item.rating}</p>
                    </div>
                    <button className="remove-button" onClick={() => deleteMedia(item.id)}>Remove from List</button>
                </div>
            </div>
            <details className="details"><summary>Description:</summary> {item.description}</details>
            </div>
            )
            })}
        </div>
    );
};

export default Library;