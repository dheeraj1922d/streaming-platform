"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "../components/navbar";
import VideoPlayer from "./player";


const YouTubeHome = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [signedUrl, setSignedUrl] = useState(null);
  const [loadingVideo, setLoadingVideo] = useState(false);

  useEffect(() => {
    const getVideos = async () => {
      try {
        const res = await axios.get("http://localhost:8082/watch/home");
        setVideos(res.data);
      } catch (error) {
        console.error("Error in fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    getVideos();
  }, []);

  const handleVideoClick = async (video) => {
    setLoadingVideo(true);
    setSelectedVideo(video);

    try {
      // Assuming your backend expects a 'key' query param with the video path
      const res = await axios.get(
        `http://localhost:8082/watch?key=${encodeURIComponent(video.url)}`
      );

      setSignedUrl(res.data.videoUrl);
      console.log("Signed URL:", res.data.videoUrl);
    } catch (error) {
      console.error("Error fetching signed URL:", error);
      setSignedUrl(null);
    } finally {
      setLoadingVideo(false);
    }
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setSignedUrl(null);
  };

  return (
    <div>
      <NavBar />
      <div>
        {loading ? (
          <div className="container mx-auto flex justify-center items-center h-screen">
            Loading...
          </div>
        ) : videos.length === 0 ? (
          <div className="container mx-auto flex justify-center items-center h-screen text-xl font-semibold text-gray-500">
            No videos found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 m-10">
            {videos.map((video) => (
              <div
                key={video.id}
                className="border rounded-md overflow-hidden cursor-pointer"
                onClick={() => handleVideoClick(video)}
              >
                <div className="aspect-video bg-black" />
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{video.title}</h2>
                  <p className="text-gray-700">
                    <strong>Author:</strong> {video.author}
                  </p>
                  <p className="text-gray-700">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded w-[80%] max-w-3xl relative">
              <button
                className="absolute top-2 right-2 text-black text-xl font-bold"
                onClick={closeModal}
              >
                &times;
              </button>

              {loadingVideo ? (
                <div className="flex justify-center items-center h-64">
                  Loading video...
                </div>
              ) : signedUrl ? (
                <VideoPlayer src={signedUrl} />
              ) : (
                <div className="text-center text-red-600">
                  Failed to load video URL.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeHome;
