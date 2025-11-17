import React from 'react';

export const Header = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Sora Video Downloader
        </span>
      </h1>
      <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
        Download any Sora-generated video in the highest quality, completely free and without any watermarks.
      </p>
    </header>
  );
};
