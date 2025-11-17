import React, { useState } from 'react';
import { LinkIcon, DownloadIcon, LoadingSpinnerIcon, ClipboardIcon, ClearIcon, CopyIcon, CheckIcon } from './IconComponents';

interface VideoResult {
  thumbnailUrl: string;
  title: string;
  downloadUrl: string;
}

export const VideoDownloader = () => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      setError('Please paste a video URL to start.');
      return;
    }
    if (!isValidUrl(url)) {
      setError('The URL you entered is not valid.');
      return;
    }

    setError(null);
    setVideoResult(null);
    setIsLoading(true);

    // Simulate API call and processing
    setTimeout(() => {
      // In a real application, this would be an API call to a backend service.
      // Here, we simulate a successful result.
      const mockResult: VideoResult = {
        thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(url)}/1280/720`,
        title: 'Your amazing Sora video is ready!',
        downloadUrl: `https://picsum.photos/seed/${encodeURIComponent(url)}/1920/1080`,
      };

      setVideoResult(mockResult);
      setIsLoading(false);
    }, 2500);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleDownload();
    }
  };

  const handlePaste = async () => {
    if (isLoading) return;
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setError(null); // Clear previous errors on successful paste
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      setError('Could not paste from clipboard. Please paste manually.');
    }
  };
  
  const handleClear = () => {
    setUrl('');
    setError(null);
    setVideoResult(null);
  };

  const handleCopyLink = () => {
    if (!videoResult) return;
    navigator.clipboard.writeText(videoResult.downloadUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Revert after 2 seconds
    });
  };


  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-gray-700 shadow-2xl shadow-purple-900/20">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <LinkIcon className="h-6 w-6 text-gray-400" />
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste Sora video link here..."
          className="w-full bg-gray-900/50 border border-gray-600 rounded-lg py-4 pl-12 pr-56 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-300 ease-in-out"
          disabled={isLoading}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
            {url && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 mr-1 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-colors"
                aria-label="Clear input"
                title="Clear input"
              >
                <ClearIcon className="h-5 w-5" />
              </button>
            )}
            <button
                type="button"
                onClick={handlePaste}
                disabled={isLoading}
                className="p-2 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-colors disabled:opacity-50"
                aria-label="Paste from clipboard"
                title="Paste from clipboard"
            >
                <ClipboardIcon className="h-6 w-6"/>
            </button>
            <button
                onClick={handleDownload}
                disabled={isLoading}
                className="ml-1 px-6 h-[calc(100%-0.75rem)] flex items-center justify-center font-semibold bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
            >
                {isLoading ? (
                    <LoadingSpinnerIcon className="h-5 w-5" />
                ) : (
                    'Download'
                )}
            </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 text-center text-red-400">{error}</p>
      )}

      {isLoading && (
         <div className="mt-8 text-center text-gray-400 flex items-center justify-center space-x-3">
            <LoadingSpinnerIcon className="h-6 w-6" />
            <span>Analyzing link and preparing your video...</span>
        </div>
      )}

      {videoResult && (
        <div className="mt-8 p-4 bg-gray-900/60 rounded-lg border border-gray-700 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <img 
                    src={videoResult.thumbnailUrl} 
                    alt="Video thumbnail"
                    className="w-full sm:w-48 h-auto object-cover rounded-md shadow-lg"
                />
                <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-white">{videoResult.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">High Quality - No Watermark</p>
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                      <a
                          href={videoResult.downloadUrl}
                          download="sora-video.mp4"
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 ease-in-out w-full sm:w-auto transform hover:scale-105"
                      >
                          <DownloadIcon className="h-5 w-5" />
                          Download Video (HD)
                      </a>
                      <button
                        onClick={handleCopyLink}
                        className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all duration-300 ease-in-out w-full sm:w-auto transform hover:scale-105 ${
                          isCopied
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <CheckIcon className="h-5 w-5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <CopyIcon className="h-5 w-5" />
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
