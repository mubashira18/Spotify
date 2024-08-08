import React, { useContext, useEffect, useRef, useState } from "react";
import Snowfall from "react-snowfall";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { AiFillSound, AiOutlineSearch } from "react-icons/ai";
import './App.css'
import {
  IoPlayCircle,
  IoPlayBackSharp,
  IoPlayForwardSharp,
  IoPauseCircleSharp,
} from "react-icons/io5";
import { MusicContext } from "./Context";
import { ClipLoader } from "react-spinners";

const Music = () => {
  const { fetchTracks, track, selectedTrack, setSelectedTrack } =
    useContext(MusicContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const audioRef = useRef(null);
  const [isTopTrack, setIsTopTrack] = useState(false);
  const [trackDurations, setTrackDurations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await fetchTracks();
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const calculateDurations = async () => {
      const durations = {};
      for (const trackItem of track) {
        const audio = new Audio(trackItem.url);
        await new Promise((resolve) => {
          audio.onloadedmetadata = () => {
            durations[trackItem.name] = audio.duration;
            resolve();
          };
        });
      }
      setTrackDurations(durations);
    };
    if (track.length > 0) {
      calculateDurations();
    }
  }, [track]);

  useEffect(() => {
    if (selectedTrack) {
      setProgress(0);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.load();
        audioRef.current.play();
      }
    }
  }, [selectedTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isTopTrack]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleForward = () => {
    const currentIndex = track.findIndex(
      (trackItem) => trackItem.name === selectedTrack.name
    );
    const nextIndex = (currentIndex + 1) % track.length;
    setSelectedTrack(track[nextIndex]);
  };

  const handleBackward = () => {
    const currentIndex = track.findIndex(
      (trackItem) => trackItem.name === selectedTrack.name
    );
    const prevIndex = (currentIndex - 1 + track.length) % track.length;
    setSelectedTrack(track[prevIndex]);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toptracks = track.filter((track) => track.top_track === true);
  const filteredTracks = (isTopTrack ? toptracks : track).filter(
    (trackItem) =>
      trackItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trackItem.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dynamicGradient = selectedTrack
    ? `linear-gradient(to top, ${selectedTrack.accent}, #000)`
    : "linear-gradient(to top, #000, #000)";

  return (
    <div
      className="h-screen text-white flex flex-col md:flex-row sm:flex-row App"
      style={{ background: dynamicGradient }}
    >
      <Snowfall snowflakeCount={200} />
      {/* Navbar */}
      <div
        className="w-full fixed top-0 left-0 right-0 p-4 flex gap-x-16 md:gap-x-28 items-center"
        style={{ background: dynamicGradient }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
          alt="Spotify Logo"
          className="h-10 ml-4"
        />
        <div className="flex justify-start space-x-8 text-gray-500 md:space-x-4 sm:space-x-2">
          <button
            className={`focus:outline-none sm:text-sm md:text-xl ${
              !isTopTrack ? "text-white" : "text-gray-500"
            }`}
            onClick={() => setIsTopTrack(false)}
          >
            For You
          </button>
          <button
            className={`focus:outline-none sm:text-sm md:text-xl ${
              isTopTrack ? "text-white" : "text-gray-500"
            }`}
            onClick={() => setIsTopTrack(true)}
          >
            Top Tracks
          </button>
        </div>
      </div>
      {/* Side_bar in middle left*/}
      <div
        className="w-full md:w-1/2 p-4 relative mt-20 pl-8 md:pl-60"
        style={{ background: dynamicGradient }}
      >
        {/* Search_Box , for music */}
        <div className="relative mb-4 flex items-center">
          <input
            type="text"
            placeholder="Search Song, Artist"
            className="text-zinc-600 bg-gray-700 w-full pr-10 pl-3 py-2 rounded-lg focus:outline-none"
            value={searchTerm}
            onChange={handleSearch}
          />
          <AiOutlineSearch className="absolute text-2xl right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {loading ? (
          <div className="flex justify-center items-center mt-56">
            <ClipLoader color="#36D7B7" loading={loading} size={80} />
          </div>
        ) : (
          <ul>
            {filteredTracks.map((trackItem, index) => (
              <li
                key={index}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                  selectedTrack?.name === trackItem.name
                    ? "bg-gray-700"
                    : "hover:bg-gray-700"
                } mb-2 transition-all duration-300 hover:scale-110`}
                onClick={() => setSelectedTrack(trackItem)}
              >
                <div className="flex items-center w-full">
                  <img
                    src={`https://cms.samespace.com/assets/${trackItem.cover}`}
                    alt={trackItem.name}
                    className="w-10 h-10 rounded-full bg-gray-500 mr-4"
                  />
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between">
                      <div>{trackItem.name}</div>
                      <div className="text-gray-400 text-sm">
                        {formatDuration(trackDurations[trackItem.name])}
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {trackItem.artist}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <img
          src="https://c.ndtvimg.com/2024-08/su200l78_vinesh-phogat-afp_625x300_07_August_24.jpg?im=FeatureCrop,algorithm=dnn,width=806,height=605"
          alt="Profile"
          className="w-10 h-10 rounded-full fixed bottom-4 left-4"
        />
      </div>
      {/* Main content */}
      <div
        className="w-full md:w-2/3 p-4 flex flex-col items-center md:items-start md:pl-40 lg:pl-56 mt-20 "
        style={{ background: dynamicGradient }}
      >
        {selectedTrack && (
          <>
            <div className="text-2xl mb-2">{selectedTrack.name}</div>
            <div className="text-gray-400 mb-4">{selectedTrack.artist}</div>
            <img
              src={`https://cms.samespace.com/assets/${selectedTrack.cover}`}
              alt={selectedTrack.name}
              className="w-96 h-96 mb-4 "
            />
          </>
        )}
        <div className="flex items-center mb-4">
          <div className="bg-gray-800 w-96 h-1 rounded-full relative overflow-hidden">
            <div
              className="bg-white h-1 rounded-full"
              style={{ width: `${progress}%,` }}
            ></div>
          </div>
        </div>
        <div className="flex items-center justify-center pl-6 space-x-6 mb-4">
          <button className="bg-gray-600 p-3 rounded-full focus:outline-none text-1xl">
            <PiDotsThreeOutlineFill />
          </button>
          <button
            className="p-3 rounded-full focus:outline-none text-2xl scale-110 transition-all duration-300 hover:scale-100"
            onClick={handleBackward}
          >
            <IoPlayBackSharp />
          </button>
          <button
            className="p-3 rounded-full focus:outline-none text-4xl transition-all duration-300 hover:scale-110"
            onClick={handlePlayPause}
          >
            {isPlaying ? <IoPauseCircleSharp /> : <IoPlayCircle />}
          </button>
          <button
            className="p-3 rounded-full focus:outline-none text-2xl scale-110 transition-all duration-300 hover:scale-100"
            onClick={handleForward}
          >
            <IoPlayForwardSharp />
          </button>
          <button className="bg-gray-600 p-3 rounded-full focus:outline-none text-1xl">
            <AiFillSound />
          </button>
        </div>
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleForward}
        >
          <source src={selectedTrack?.url} type="audio/mp3" />
        </audio>
      </div>
    </div>
  );
};

export default Music;
