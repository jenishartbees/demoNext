'use client'
import { useEffect, useRef, useState } from "react";
import '../../styles/index.css';
import '../../styles/App.css';
// import 'bootstrap-icons/icons/bootstrap-icons.css';

function Short({ short, shortContainerRef, index, video_id }) {
  const playPauseRef = useRef();
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState((localStorage.getItem('Muted') == 'true'));
  const [isLiked, setIsLiked] = useState(short.reaction.isLiked);
  const [videoLoaded, setVideoLoaded] = useState(false);
  useEffect(() => {
    localStorage.setItem('Muted', isMuted)
    shortContainerRef.current.querySelectorAll('video').forEach(video => {
      video.muted = isMuted;
    });
    shortContainerRef.current.querySelectorAll('i').forEach(icon => {
      if (isMuted == true) {
        icon.className = 'bi bi-volume-mute volume';
      } else {
        icon.className = 'bi bi-volume-up volume';
      }
    });
  }, [isMuted])
  useEffect(() => {
    shortContainerRef.current.addEventListener("scroll", handleVideo);
    setIsPlaying(!videoRef.current.paused);
    window.addEventListener("blur", () => {
      if (isActiveVideo(videoRef)) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    });

    window.addEventListener("focus", () => {
      if (isActiveVideo(videoRef)) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    });
  }, [shortContainerRef]);

  async function handleVideo() {
    const videoTop = videoRef.current.getBoundingClientRect().top;

    if (videoTop > 0 && videoTop <= 150) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        setIsPlaying(false);
        videoRef.current.pause();
      }
    } else {
      videoRef.current.currentTime = 0;
      videoRef.current.pause();
    }
  }
  function handleVideoLoad() {
    setVideoLoaded(true);
    alert("loading")
  }
  return (
    <div className="reel" style={{ height: "100%", width: "100%" }}>
      {videoLoaded == true ? <div className='loading-spinner'><i className="fa fa-spinner fa-spin fa-3x fa-fw"></i></div> : ''}
      <div className="reel-video" >
        <div className="video">
          <video
            id={video_id}
            ref={videoRef}
            onClick={function (e) {
              if (!isPlaying) {
                videoRef.current.play();
                setIsPlaying(true);
              } else {
                videoRef.current.pause();
                setIsPlaying(false);
              }
            }}
            disableRemotePlayback
            playsInline
            loop
            // src={short.videoUrl}
            autoPlay={index == 0 ? true : false}
            muted={isMuted}
            preload={'auto'}
          >
            <source src={short.videoUrl} label="auto" />
          </video>
          <div className="controls">
            <span
              onClick={() => {
                setIsMuted(!isMuted);
              }}
            >
              <i className={`bi bi-volume-${isMuted == true ? 'mute' : 'up'} volume`}></i>
            </span>
          </div>
        </div>
        <div className="reaction">
          <div
            className=""
            onClick={() => {
              setIsLiked(!isLiked);
            }}
          >
            {isLiked ? (
              <span className="like">
                <ion-icon name="heart"></ion-icon>
              </span>
            ) : (
              <span className="unlike">
                <ion-icon name="heart-outline"></ion-icon>
              </span>
            )}

            <span className="value">{short.reaction.likes}</span>
          </div>
          {/* <div>
            <ion-icon name="chatbubble-outline"></ion-icon>
            <span className="value">{short.reaction.comments}</span>
          </div> */}
          {/* <div>
            <ion-icon name="arrow-redo-outline"></ion-icon>
          </div> */}
          {/* <div>
            <ion-icon name="ellipsis-vertical-outline"></ion-icon>
          </div> */}
        </div>
      </div>
    </div>
  );
}

function isActiveVideo(videoRef) {
  const videoTop = videoRef.current.getBoundingClientRect().top;
  return videoTop > 0 && videoTop <= 150;
}

export default Short;
