import React, { createContext, useState } from "react";
import axios from "axios";

const MusicContext = createContext();

const MusicProvider = ({ children }) => {
  const [track, setTrack] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const fetchTracks = async () => {
    try {
      const response = await axios.get("https://cms.samespace.com/items/songs");
      setTrack(response.data.data);
      setSelectedTrack(response.data.data[0]);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <MusicContext.Provider
      value={{ fetchTracks, selectedTrack, setSelectedTrack, track }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export { MusicContext, MusicProvider };
