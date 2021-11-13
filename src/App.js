import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";
const clientID = `?client_id=${process.env.REACT_APP_UNSPLASH_API_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`; //? url to fetch photos
const searchUrl = `https://api.unsplash.com/search/photos/`; //? url for query use

function App() {
  //! states
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [newImages, setNewImages] = useState(false);
  //? used to enable infinite scroll
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const mounted = useRef(false);
  //! functions
  const fetchApi = async () => {
    setLoading(true);
    let url;
    //? current page displayed from the api, we change it and we have infite scroll
    const urlPage = `&page=${page}`;
    //? query url
    const urlQuery = `&query=${query}`;

    //? check if query present and if not than fetch default photos
    if (query) {
      //     search ulr  client id  scrollpage searchQuery
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();

      //? add the new photos to the old photos
      setPhotos((oldPhotos) => {
        if (query && page === 1) {
          //? if page equalt to 1 delete old values becouse we changed the search query
          return data.results;
        } else if (query) {
          return [...oldPhotos, ...data.results]; //? query gives differnet return than no query
        } else {
          return [...oldPhotos, ...data];
        }
      });
      setNewImages(false);
      setLoading(false);
    } catch (error) {
      console.log(`ERROR =>${error}`);
      setNewImages(false);
      setLoading(false);
    }
  };
  //? get images on app load and when page changes to have infinite scroll
  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line
  }, [page]);

  //? only run on 2 and more renders, not the initial one. so we use  useRef that doesnt trigger rerender
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!newImages) return;
    if (loading) return;
    setPage((oldPage) => oldPage + 1);
  }, [newImages]);
  //? scroll setup
  const event = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setNewImages(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", event);
    return () => window.removeEventListener("scroll", event);
  }, []);

  //? handler click
  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!query) return;
    if (page === 1) {
      fetchApi();
      return;
    }
    setPage(1);
  };
  //! main return
  return (
    <main>
      <section className="search">
        <form className="search-form">
          <input
            type="text"
            placeholder="Search..."
            className="form-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {photos.map((photo) => {
            return <Photo key={photo.id} {...photo} />;
          })}
        </div>
        {loading && <h2 className="loading">Loading...</h2>}
      </section>
    </main>
  );
}

export default App;
