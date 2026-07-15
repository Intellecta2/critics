/**
 * VideoPlayer.jsx — HLS Adaptive Video Player Component
 *
 * Uses react-player/lazy to load the player library only when the
 * component is rendered (code-splitting for performance).
 *
 * Props:
 *   - streamUrl (string): The .m3u8 HLS manifest URL (from CDN/CloudFront)
 *   - onEnd (function): Callback when video playback ends
 *
 * Architecture:
 *   - The player is wrapped in a 100vw x 100vh container for fullscreen playback
 *   - forceHLS: true ensures the HLS.js library is loaded for .m3u8 streams
 *   - A "Back" button overlays the player to exit playback mode
 *   - The parent App.jsx controls visibility via the `isPlaying` state
 */

import React from 'react';
import ReactPlayer from 'react-player/lazy';
import { ArrowLeft } from 'lucide-react';

const VideoPlayer = ({ streamUrl, onEnd }) => {
  return (
    <div className="video-player-container">
      {/* Back button overlay — exits playback mode */}
      <button className="video-player__back-btn" onClick={onEnd}>
        <ArrowLeft style={{ width: 20, height: 20 }} />
        Back to Browse
      </button>

      {/* Responsive player wrapper — fills the entire viewport */}
      <div className="video-player__wrapper">
        <ReactPlayer
          url={streamUrl}
          width="100%"
          height="100%"
          controls={true}
          playing={true}
          config={{
            file: {
              // forceHLS tells react-player to use hls.js for .m3u8 streams.
              // This is required for HLS playback in browsers that don't
              // natively support HLS (i.e., everything except Safari).
              forceHLS: true,
              attributes: {
                // Poster image while the stream is buffering
                style: { backgroundColor: '#000' },
              },
            },
          }}
          onEnded={onEnd}
          onError={(error) => {
            console.error('VideoPlayer error:', error);
          }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
