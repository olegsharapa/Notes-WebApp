import React, { useEffect, useState } from "react";
import UnsplashWidget from "./UnsplashWidget";
import unsplash from "../Utils/unsplash";
import { toJson } from "unsplash-js";

export default function BackgroundsPicker({ background, setBackground }) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    unsplash.photos
      .listPhotos(1, 8, "latest")
      .then(toJson)
      .then((res) => {
        setBackground(res[0]);
        setPhotos(res);
      })
      .catch((err) => console.log("unsplash error ", err));
    //eslint-disable-next-line
  }, []);

  const backgrounds = photos.map((photo) => (
    <li key={photo.id} className="background-grid-item">
      <button
        style={{ backgroundImage: `url(${photo.urls.small})` }}
        className={`background-grid-trigger${
          background.id === photo.id ? " selected" : ""
        }`}
        onClick={() => setBackground(photo)}
        type="button"
      >
        {background.id === photo.id && (
          <span className="material-icons md-light md-18 selected">done</span>
        )}
      </button>
    </li>
  ));

  return (
    <>
      <ul className="background-grid">
        {backgrounds}
        <li className="background-grid-item">
          <button className="background-grid-trigger" type="button">
            <UnsplashWidget
              title={
                <span className="material-icons md-18 selected">
                  more_horiz
                </span>
              }
              background={background}
              setBackground={setBackground}
              backgroundPicker={{ photos, setPhotos }}
            />
          </button>
        </li>
      </ul>
    </>
  );
}
