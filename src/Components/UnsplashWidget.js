import React, { useState, useEffect } from "react";
import { Modal, FormControl } from "react-bootstrap";
import unsplash from "../Utils/unsplash";
import { toJson } from "unsplash-js";

export default function UnsplashWidget({
  title,
  background,
  setBackground,
  backgroundPicker,
}) {
  const [showModal, setShowModal] = useState(false);
  const [defaultPhotos, setDefaultPhotos] = useState([]);
  const [searchedPhotos, setSearchedPhotos] = useState([]);

  useEffect(() => {
    unsplash.photos
      .listPhotos(1, 8, "latest")
      .then(toJson)
      .then((res) => {
        setSearchedPhotos(res);
        setDefaultPhotos(res);
      })
      .catch((err) => console.log("unsplash error ", err));
    //eslint-disable-next-line
  }, []);

  const searchPhoto = (query) => {
    console.log("search field ", query);

    if (query === "") query = "screensaver";
    unsplash.search
      .photos(query, 1, 30)
      .then(toJson)
      .then((res) => {
        setSearchedPhotos(res.results);
        console.log("SEARCH PHOTOS ", res);
      })
      .catch((err) => console.log("unsplash error ", err));
  };

  const setNewBackground = (newBackground) => {
    setBackground(newBackground);
    if (backgroundPicker) setBackgroundPicker(newBackground);
  };

  const setBackgroundPicker = (newBackgroundTile) => {
    let { photos, setPhotos } = backgroundPicker;
    console.log("background picker: ", backgroundPicker);
    if (!photos.filter((photo) => photo.id === newBackgroundTile.id).length) {
      photos.splice(0, 1, newBackgroundTile);
      setPhotos(photos);
    }
  };

  const backgroundId = background !== null ? background.id : null;

  const searchedBackgrounds = searchedPhotos.map((photo) => (
    <li key={photo.id} className="boards-list-item unsplash-item">
      <button
        className={`background-grid-trigger${
          background && background.id === photo.id ? " selected" : ""
        }`}
        type="button"
        style={{
          backgroundImage: `url(${photo.urls.small})`,
        }}
        onClick={() => setNewBackground(photo)}
      >
        {backgroundId === photo.id && (
          <span
            className="material-icons md-light selected"
            style={{ lineHeight: "100px" }}
          >
            done
          </span>
        )}
      </button>
    </li>
  ));

  return (
    <>
      <span onClick={() => setShowModal(true)}>{title}</span>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Photos by&nbsp;
            <a
              href="https://unsplash.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="search-photos">
            <FormControl
              type="text"
              placeholder="Photos"
              onChange={(e) => searchPhoto(e.target.value)}
            />
            <span className="material-icons md-18">search</span>
          </div>
          <ul className="boards-list-container">
            {searchedBackgrounds.length
              ? searchedBackgrounds
              : "Sorry, your search didn't return any results. Please try again!"}
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
}
