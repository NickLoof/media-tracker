const express = require("express");
const sqlite3 = require("sqlite3");
require("dotenv").config();
const cors = require("cors");
const app = express();
const db = new sqlite3.Database("media.db")
const port = 3000;

app.use(express.json());
app.use(cors());


db.run(`
    CREATE TABLE IF NOT EXISTS media(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    type TEXT,
    genre TEXT,
    status TEXT,
    rating INTEGER,
    poster_path TEXT,
    description TEXT,
    release_date TEXT,
    tmdb_id INTEGER
    );
`);

app.get("/media-details/:id", (req, res) => {
    const id = req.params.id;
    const type= req.query.type;
    const language = req.query.language;
    const tmdbLanguage = language === "de"? "de-DE":"en-US";
    const mediaType = (type === "Movie") ? "movie" : "tv";
    const url = (`https://api.themoviedb.org/3/${mediaType}/${id}?language=${tmdbLanguage}`);
    fetch(url, {
        headers: {Authorization: `Bearer ${process.env.TMDB_TOKEN}`
    } 
    })
    .then((response) => response.json())
    .then((data) => {
        res.send(data);
    })
})

app.get("/media-videos/:id", (req, res) => {
    const id = req.params.id;
    const type = req.query.type;
    const mediaType = (type === "Movie")? "movie" : "tv";
    const url = (`https://api.themoviedb.org/3/${mediaType}/${id}/videos`);
    fetch(url, {
        headers: {Authorization: `Bearer ${process.env.TMDB_TOKEN}`}
    })
    .then((response) => response.json())
    .then((data) => {
        res.send(data);
    })
})

app.get("/", (req, res) => {
    res.send("Hello!");
});
app.get("/media", (req, res) => {
    db.all("SELECT * FROM media", (error, rows) => {
        res.send(rows);
    });
});

app.get("/genres", (req, res) => {
    const type = req.query.type;
    const mediaType = (type === "Movie")?"movie":"tv"
    const url = `https://api.themoviedb.org/3/genre/${mediaType}/list`;
    fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        }
    })
    .then((response) => response.json()
    ).then((data) => { 
        res.send(data);
    });
})
app.get("/browse-movies", (req, res) => {
    const page = req.query.page;
    const type = req.query.type;
    const category = req.query.category;
    const genre = req.query.genre;
    const title = req.query.title;
    const language = req.query.language;
    const tmdbLanguage = language === "de"? "de-DE":"en-US";
    const mediaType = (type==="Movie")?"movie":"tv" 
    const dateType = (type==="Movie")?"primary_release_date":"first_air_date";
    const today = new Date();
    const todayFormatted = today.toISOString().slice(0, 10);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate()-90);
    const ninetyDaysAgoFormatted = ninetyDaysAgo.toISOString().slice(0, 10);
    let url= title
            ? `https://api.themoviedb.org/3/search/${mediaType}?query=${encodeURIComponent(title)}`
            :`https://api.themoviedb.org/3/discover/${mediaType}?page=${page}`;
            url += `&language=${tmdbLanguage}`;
    if(!title){
        if(category === "Popular"){ url += "&sort_by=popularity.desc"};
        if(category === "Top Rated"){url += "&sort_by=vote_average.desc"
            url += "&vote_count.gte=500";};
        if(category === "New Releases"){
            url += `&sort_by=${dateType}.desc`;
            url += `&${dateType}.gte=${ninetyDaysAgoFormatted}`;
            url += `&${dateType}.lte=${todayFormatted}`};
         if(genre){
            url += `&with_genres=${genre}`;
        };
    }
    
    fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        }
    })
    .then((response) => response.json()
    ).then((data) => { 
        res.send(data);
    });
});

app.post("/media", (req, res) => {
    const {title, type, genre, status, rating, poster_path, description, release_date, tmdb_id} = req.body;
    if (title === "" || type === "" || status === "" || rating === 0){
        return res.status(400).send("Bad Request");
    }
    db.get(
        "SELECT * FROM media WHERE tmdb_id = ? AND type = ?",
        [tmdb_id, type],
        function(error, row) {
            if (error) {
        return res.status(500).send("Error");
            }

            if (row) {
                return res.status(409).json({
                    message: "Already in library"
                });
            }

            const genreText = genre.join(", ");
    db.run("INSERT INTO media (title, type, genre, status, rating, poster_path, description, release_date, tmdb_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", 
        [title, type, genreText, status, rating, poster_path, description, release_date, tmdb_id], function(error){
        if(error){
            return res.status(500).send("Error");
        }

        res.status(201).send({id: this.lastID, ...req.body, genre: genreText});
    });
});
        }
    );


    


app.delete("/media/:id", (req, res) => {
    const{id} = req.params;
    db.run("DELETE FROM media WHERE id = ?", [id], function(error) {
        if(error){
            return res.status(500).send("Error");
        }
        if(this.changes === 0){
            return res.status(404).send("Media not found");
        }
        if(this.changes !== 0){
            return res.status(204).send();
        }
    })
})
app.patch("/media/:id", (req, res) => {
    const {id} = req.params;
    const {status, rating} = req.body;
    if(status !== undefined){
    db.run("UPDATE media SET status = ? WHERE id = ?", 
        [status, id], function(error){
            if(error){
            return res.status(500).send("Error");
            }
            if(this.changes === 0){
            return res.status(404).send("Media not found");
            }
            if(this.changes !== 0){
            return res.status(204).send();
            }
        })}else if(rating !== undefined) {
            db.run("UPDATE media SET rating = ? WHERE id = ?", 
        [rating, id], function(error){
            if(error){
            return res.status(500).send("Error");
            }
            if(this.changes === 0){
            return res.status(404).send("Media not found");
            }
            if(this.changes !== 0){
            return res.status(204).send();
            }else{
                return res.status(400).send("No valid update provided");
            }
        })
        }
})
app.get("/search", (req, res) => {
    const title = req.query.title;
    const url = `https://api.themoviedb.org/3/search/multi?query=
        ${encodeURIComponent(title)}`;
    fetch(url, {
        headers: {
            Authorization: `Bearer ${process.env.TMDB_TOKEN}`
        }
    })
    .then((response) => {
        return response.json();
    }).then((data) => {
        const filteredResults = data.results.filter((item) => {
            return item.media_type !== "person";
        });
    res.send(filteredResults);
})
})

app.listen(port, () => {
    console.log("Server is running!");
})