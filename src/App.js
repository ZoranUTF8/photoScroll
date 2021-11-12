import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";
const clientID = `?client_id=${process.env.REACT_APP_UNSPLASH_API_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`; //? url to fetch photos
const searchUrl = `https://api.unsplash.com/search/photos/`; //? url for query use

function App() {
  //! states
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  //? used to enable infinite scroll
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState("");
  console.log(query);
  //! functions
  const fetchApi = async () => {
    let url;
    //? current page displayed from the api, we change it and we have infite scroll
    const urlPage = `&page=${page}`;
    //? query url
    const urlQuery = `&query=${query}`;

    //? check if query present and if not than fetch default photos
    if (query) {
      // search ulr  client id  scrollpage search
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }

    try {
      setLoading(true);
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(`ERROR =>${error}`);
    }
  };
  //? get images on app load and when page changes to have infinite scroll
  useEffect(() => {
    fetchApi();
    // eslint-disable-next-line
  }, [page]);

  //! set up scroll function
  useEffect(() => {
    //? remove event listener when we exit
    const event = window.addEventListener("scroll", () => {
      //? combine the innerheight and scrollY and if its bigger than the scrollheight
      //? than we call the function to fetch images again but dont do it if loading = true
      if (
        !loading &&
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 2
      ) {
        setPage((oldPage) => {
          return oldPage + 1;
        });
      }
    });

    return () => window.removeEventListener("scroll", event);
    // eslint-disable-next-line
  }, []);

  //? handler click
  const handleSubmit = (evt) => {
    evt.preventDefault();
    setPage(1);
  };

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
