# Media Tracker

Media Tracker is a full-stack web application that allows users to browse movies and TV shows using data provided by TMDB and save them to a personal library. Users can keep track of what they want to watch, what they're currently watching, what they've completed, and even what they've dropped. The application also allows users to rate their saved media and manually add titles that aren't available through TMDB search.

## Features

 ### Home Dashboard
 - Search for movies and TV shows using the TMDB database
 - Open detailed information for any search result
 - Add media directly to your personal library
 - View your 5 most recently added titles
 - Continue Watching section for media currently marked as "Watching"
 - Library statistics showing movie and TV show totals with a visual chart

### Browse Movies & TV Shows
- Browse movies and TV shows from TMDB
- Filter between movies and TV shows
- Filter by genre
- Browse popular, new release, and top-rated media
- Search within the browse catalog
- Pagination with 20 results per page
- Open detailed information for each title
- Add titles directly to your library

### Personal Library
- View your saved movies and TV shows
- Filter your library by media type and watch status
- Set statuses such as Want to Watch, Watching, Completed, On Hold, or Dropped
- Give saved media your own 1–5 star rating
- View additional information and trailers
- Remove media from your library
- Manually add titles that aren't available through TMDB search

### Media Details
- Posters and backdrop artwork
- Release dates
- Movie runtimes and TV season counts
- Genres
- TMDB ratings
- Descriptions
- YouTube trailers
- Graceful handling of manually added media without TMDB artwork or metadata

### Additional Features
- Full English and German interface
- Language preference saved between browser sessions
- Responsive layouts for desktop, tablet, and mobile devices
- Persistent library data stored with SQLite

## Technologies Used

### Frontend
- React
- JavaScript
- HTML
- CSS
- Vite
- React Router
- Lucide React

### Backend
- Node.js
- Express.js

### Database
- SQLite

### APIs
- TMDB API

### Other
- Web Fetch API
- Local Storage
- Git & GitHub

## Concepts & Techniques
- RESTful API requests using GET, POST, PATCH, and DELETE
- React Hooks and Context API
- Client-side routing with React Router
- CRUD operations
- Responsive design with CSS media queries
- External API integration
- SQLite database persistence
- Localization (English/German)
- Browser persistence using localStorage

## Screenshots

### Home
![Media Tracker Home](screenshots/home.png)

### Browse
![Media Tracker Browse](screenshots/browse.png)

### Library
![Media Tracker Library](screenshots/library.png)

### Media Details
![Media Details](screenshots/media-details.png)

### Responsive Mobile Design
![Media Tracker Mobile](screenshots/mobile.png)

### Mobile Navigation
![Media Tracker Mobile Navigation](screenshots/mobile-menu.png)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/NickLoof/media-tracker.git
cd media-tracker
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Set up environment variables

Create a `.env` file inside the `backend` folder:

```env
TMDB_TOKEN=your_tmdb_api_token
```
A TMDB API token is required to retrieve movie and Tv Show data.

### 5. Start the backend

From the `backend` folder:

```bash
node server.js
```

The backend will run on:

```text
http://localhost:3000
```

### 6. Start the frontend

From the `frontend` folder:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.



