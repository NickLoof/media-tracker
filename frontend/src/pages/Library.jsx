import {useEffect, useState} from "react";
import MediaForm from "../components/MediaForm";
import "./Library.css";

const Library = () => {
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
            <button className="button" onClick={showMediaForm}>+ Add Media</button>
            {showMedia && <MediaForm hideMediaForm={hideMediaForm} addMedia={addMedia}/>}
            {media.map((item) => {
            return(
            <div className="movie-card" key={item.id}>
                <h2>Title: {item.title}</h2>
                <p>Type: {item.type}</p>
                <p>Genre: {item.genre}</p>
                <p>Status: {item.status}</p>
                <p>Rating: {item.rating}</p>
                <button className="button" onClick={() => deleteMedia(item.id)}>Remove from List</button>
            </div>
            )
            })}
        </div>
    );
};

export default Library;