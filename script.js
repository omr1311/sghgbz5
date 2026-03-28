// HLS akışını yükle
if (Hls.isSupported()) {
  var video = document.getElementById('video');
  var hls = new Hls();
  hls.loadSource('stream.m3u8'); // FFmpeg ile ürettiğin dosya
  hls.attachMedia(video);
}

// Tarih/Saat overlay
function updateOverlay() {
  const now = new Date();
  document.getElementById("overlay").innerText =
    now.toLocaleDateString() + " " + now.toLocaleTimeString();
}
setInterval(updateOverlay, 1000);
