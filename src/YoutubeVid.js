import React from 'react';
import './App.css';

export default function YoutubeVid(embedId) {
  return (
    <div className="video-responsive">
      <iframe
        title="YouTube video"
        width="853"
        height="480"
        src={`https://www.youtube.com/embed/${embedId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
