const PLAYLIST_ID = "PLcw7Q5zInFfE";
let player;
let ready = false;
let timer = null;

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const volume = document.getElementById("volume");
const progress = document.getElementById("progress");
const current = document.getElementById("current");
const duration = document.getElementById("duration");
const trackLabel = document.getElementById("track-label");

function fmt(sec){
  sec = Math.max(0, Math.floor(sec || 0));
  const m = Math.floor(sec/60);
  const s = String(sec%60).padStart(2,"0");
  return `${m}:${s}`;
}

function loadYouTubeAPI(){
  const s = document.createElement("script");
  s.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(s);
}

window.onYouTubeIframeAPIReady = function(){
  player = new YT.Player("youtube-player", {
    width: "1",
    height: "1",
    playerVars: {
      listType: "playlist",
      list: PLAYLIST_ID,
      autoplay: 0,
      controls: 0,
      playsinline: 1,
      rel: 0
    },
    events: {
      onReady: onReady,
      onStateChange: onStateChange,
      onError: onError
    }
  });
};

function onReady(){
  ready = true;
  player.setVolume(Number(volume.value));
  trackLabel.textContent = "READY — PRESS PLAY";
  updateTrackInfo();
}

function onStateChange(e){
  if(e.data === YT.PlayerState.PLAYING){
    playBtn.textContent = "❚❚";
    trackLabel.textContent = getTitle() || "NOW PLAYING";
    startProgress();
  } else if(e.data === YT.PlayerState.PAUSED){
    playBtn.textContent = "▶";
    stopProgress();
  } else if(e.data === YT.PlayerState.ENDED){
    stopProgress();
  }
}

function onError(){
  trackLabel.textContent = "PLAYLIST COULD NOT LOAD";
}

function getTitle(){
  try {
    return player.getVideoData().title || "";
  } catch(e){ return ""; }
}

function updateTrackInfo(){
  if(!ready) return;
  const title = getTitle();
  if(title) trackLabel.textContent = title;
}

playBtn.addEventListener("click", ()=>{
  if(!ready) return;
  const state = player.getPlayerState();
  if(state === YT.PlayerState.PLAYING) player.pauseVideo();
  else player.playVideo();
});

prevBtn.addEventListener("click", ()=>{
  if(!ready) return;
  player.previousVideo();
  setTimeout(updateTrackInfo, 500);
});

nextBtn.addEventListener("click", ()=>{
  if(!ready) return;
  player.nextVideo();
  setTimeout(updateTrackInfo, 500);
});

volume.addEventListener("input", ()=>{
  if(ready) player.setVolume(Number(volume.value));
});

function startProgress(){
  stopProgress();
  timer = setInterval(()=>{
    if(!ready) return;
    const cur = player.getCurrentTime() || 0;
    const dur = player.getDuration() || 0;
    progress.style.width = dur ? `${(cur/dur)*100}%` : "0%";
    current.textContent = fmt(cur);
    duration.textContent = fmt(dur);
    const title = getTitle();
    if(title) trackLabel.textContent = title;
  }, 500);
}

function stopProgress(){
  if(timer){ clearInterval(timer); timer = null; }
}

loadYouTubeAPI();
