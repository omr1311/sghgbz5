/* ============================================================
   HAVA DURUMU SİMÜLASYONU - script.js (Bölüm 1/3)
   ============================================================ */

/* API AYARLARI */
const apiKey = "46b0d0f9fd4363441ce3001b2c1e782c"; // kendi API anahtarını buraya ekle

/* GLOBAL DEĞİŞKENLER */
let canvas, ctx;
let drops = [];
let snowflakes = [];
let clouds = [];
let lightningActive = false;
let stars = [];
let aurora = [];
let rainbow = [];
let windArrows = [];

/* ============================================================
   CANVAS BAŞLATMA
   ============================================================ */
function initCanvas() {
  canvas = document.getElementById("weatherCanvas");
  ctx = canvas.getContext("2d");
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

/* ============================================================
   HAVA DURUMU VERİSİ ÇEKME
   ============================================================ */
async function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Lütfen bir şehir girin!");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=tr`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.cod !== "200") {
    alert("Şehir bulunamadı!");
    return;
  }

  // Anlık hava durumu
  const current = data.list[0];
  document.getElementById("weather-info").innerHTML =
    `${city} için anlık sıcaklık: ${current.main.temp}°C, ${current.weather[0].description}`;

  // 10 günlük tahmin tablosu
  const tbody = document.querySelector("#forecast tbody");
  tbody.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const forecast = data.list[i * 8]; // her gün için yaklaşık 8 veri var
    const row = `<tr>
      <td>${new Date(forecast.dt * 1000).toLocaleDateString("tr-TR")}</td>
      <td>${forecast.weather[0].description}</td>
      <td>${forecast.main.temp_min}°C</td>
      <td>${forecast.main.temp_max}°C</td>
    </tr>`;
    tbody.innerHTML += row;
  }

  // Animasyon tetikleme
  startAnimation(current.weather[0].main);
}

/* ============================================================
   ANİMASYONLAR
   ============================================================ */
function startAnimation(condition) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drops = [];
  snowflakes = [];
  clouds = [];
  lightningActive = false;
  stars = [];
  aurora = [];
  rainbow = [];
  windArrows = [];

  if (condition === "Rain") {
    createRain();
  } else if (condition === "Snow") {
    createSnow();
  } else if (condition === "Clear") {
    createSun();
    createRainbow();
  } else if (condition === "Clouds") {
    createClouds();
  } else if (condition === "Thunderstorm") {
    createRain();
    lightningActive = true;
  }
}

/* ============================================================
   YAĞMUR ANİMASYONU
   ============================================================ */
function createRain() {
  for (let i = 0; i < 1000; i++) {
    drops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 4 + Math.random() * 4,
      length: 10 + Math.random() * 10
    });
  }
  animateRain();
}

function animateRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 2;
  for (let i = 0; i < drops.length; i++) {
    let d = drops[i];
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x, d.y + d.length);
    ctx.stroke();
    d.y += d.speed;
    if (d.y > canvas.height) {
      d.y = -20;
      d.x = Math.random() * canvas.width;
    }
  }
  if (lightningActive) drawLightning();
  requestAnimationFrame(animateRain);
}

/* ============================================================
   KAR ANİMASYONU
   ============================================================ */
function createSnow() {
  for (let i = 0; i < 500; i++) {
    snowflakes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 2,
      speed: Math.random() + 0.5
    });
  }
  animateSnow();
}

function animateSnow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  for (let i = 0; i < snowflakes.length; i++) {
    let s = snowflakes[i];
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fill();
    s.y += s.speed;
    if (s.y > canvas.height) {
      s.y = -10;
      s.x = Math.random() * canvas.width;
    }
  }
  requestAnimationFrame(animateSnow);
}

/* ============================================================
   GÜNEŞ + GÖKKUŞAĞI
   ============================================================ */
function createSun() {
  animateSun();
}

function animateSun() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let gradient = ctx.createRadialGradient(
    canvas.width - 150,
    150,
    50,
    canvas.width - 150,
    150,
    200
  );
  gradient.addColorStop(0, "yellow");
  gradient.addColorStop(1, "orange");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(canvas.width - 150, 150, 80, 0, Math.PI * 2);
  ctx.fill();
  requestAnimationFrame(animateSun);
}

function createRainbow() {
  rainbow.push({x: canvas.width/2, y: canvas.height-200});
  animateRainbow();
}

function animateRainbow() {
  for (let i=0; i<rainbow.length; i++) {
    let r = rainbow[i];
    let gradient = ctx.createLinearGradient(r.x-200, r.y, r.x+200, r.y);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(0.2, "orange");
    gradient.addColorStop(0.4, "yellow");
    gradient.addColorStop(0.6, "green");
    gradient.addColorStop(0.8, "blue");
    gradient.addColorStop(1, "violet");
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(r.x, r.y, 200, Math.PI, 2*Math.PI);
    ctx.stroke();
  }
  requestAnimationFrame(animateRainbow);
}

/* ============================================================
   BULUT ANİMASYONU
   ============================================================ */
function createClouds() {
  for (let i = 0; i < 10; i++) {
    clouds.push({
      x: Math.random() * canvas.width,
      y: Math.random() * 200,
      size: 50 + Math.random() * 100,
      speed: 0.5 + Math.random()
    });
  }
  animateClouds();
}

function animateClouds() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  for (let i = 0; i < clouds.length; i++) {
    let c = clouds[i];
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
    ctx.fill();
    c.x += c.speed;
    if (c.x > canvas.width + 100) {
      c.x = -100;
      c.y = Math.random() * 200;
    }
  }
  requestAnimationFrame(animateClouds);
}/* ============================================================
   HAVA DURUMU SİMÜLASYONU - script.js (Bölüm 2/3)
   ============================================================ */

/* ============================================================
   FIRTINA / ŞİMŞEK
   ============================================================ */
function drawLightning() {
  if (Math.random() < 0.01) {
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

/* ============================================================
   YILDIZLI GECE ANİMASYONU
   ============================================================ */
function createStars() {
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2,
      twinkle: Math.random()
    });
  }
  animateStars();
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${Math.abs(Math.sin(Date.now()/500 + s.twinkle))})`;
    ctx.fill();
  }
  requestAnimationFrame(animateStars);
}

/* ============================================================
   AURORA BOREALIS (Kuzey Işıkları)
   ============================================================ */
function createAurora() {
  for (let i = 0; i < 5; i++) {
    aurora.push({
      x: Math.random() * canvas.width,
      y: Math.random() * 200,
      width: 300 + Math.random() * 200,
      height: 50 + Math.random() * 100,
      color: `hsla(${Math.random()*360},100%,70%,0.3)`
    });
  }
  animateAurora();
}

function animateAurora() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < aurora.length; i++) {
    let a = aurora[i];
    let gradient = ctx.createLinearGradient(a.x, a.y, a.x+a.width, a.y+a.height);
    gradient.addColorStop(0, a.color);
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(a.x, a.y, a.width, a.height);
    a.x += Math.sin(Date.now()/1000) * 0.5;
  }
  requestAnimationFrame(animateAurora);
}

/* ============================================================
   RÜZGAR OKLARI
   ============================================================ */
function createWindArrows(speed=5) {
  for (let i = 0; i < 50; i++) {
    windArrows.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: 20 + Math.random() * 30,
      speed: speed + Math.random()*2
    });
  }
  animateWindArrows();
}

function animateWindArrows() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 2;
  for (let i = 0; i < windArrows.length; i++) {
    let w = windArrows[i];
    ctx.beginPath();
    ctx.moveTo(w.x, w.y);
    ctx.lineTo(w.x + w.length, w.y);
    ctx.stroke();
    w.x += w.speed;
    if (w.x > canvas.width) {
      w.x = -w.length;
      w.y = Math.random() * canvas.height;
    }
  }
  requestAnimationFrame(animateWindArrows);
}

/* ============================================================
   SICAKLIK GRAFİĞİ
   ============================================================ */
function drawTemperatureGraph(data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "yellow";
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < data.length; i++) {
    let x = (i / data.length) * canvas.width;
    let y = canvas.height - (data[i] * 5);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
}

/* ============================================================
   KULLANICI ETKİLEŞİMLERİ
   ============================================================ */
document.addEventListener("keydown", (e) => {
  if (e.key === "r") startAnimation("Rain");
  if (e.key === "s") startAnimation("Snow");
  if (e.key === "c") startAnimation("Clear");
  if (e.key === "b") startAnimation("Clouds");
  if (e.key === "t") startAnimation("Thunderstorm");
  if (e.key === "n") {
    stars = [];
    createStars();
  }
  if (e.key === "a") {
    aurora = [];
    createAurora();
  }
  if (e.key === "w") {
    windArrows = [];
    createWindArrows();
  }
});

/* ============================================================
   EKSTRA MODLAR
   ============================================================ */
function createNightMode() {
  document.body.classList.add("night");
  stars = [];
  createStars();
}

function createDayMode() {
  document.body.classList.remove("night");
  rainbow = [];
  createRainbow();
}

/* ============================================================
   DEBUG / TEST
   ============================================================ */
function debugWeather() {
  console.log("Drops:", drops.length);
  console.log("Snowflakes:", snowflakes.length);
  console.log("Clouds:", clouds.length);
  console.log("Stars:", stars.length);
  console.log("Aurora:", aurora.length);
  console.log("Rainbow:", rainbow.length);
  console.log("WindArrows:", windArrows.length);
}

/* ============================================================
   BAŞLAT
   ============================================================ */
window.onload = () => {
  initCanvas();
  // Varsayılan olarak güneşli başlat
  startAnimation("Clear");
};
/* ============================================================
   HAVA DURUMU SİMÜLASYONU - script.js (Bölüm 3/3)
   Devamı: Ekstra efektler, detaylı kontrol, grafikler, performans optimizasyonu
   Bu bölüm önceki iki bölümün devamıdır. Tek dosyada birleştirildiğinde çalışır.
   ============================================================ */

/* ============================================================
   NOTLAR
   - Bu bölüm, önceki bölümlerde tanımlanan global değişkenleri kullanır.
   - Eğer önceki bölümlerle birleştirirken isim çakışması olursa
     fonksiyon isimlerini uygun şekilde güncelleyin.
   - Aşağıdaki kod, animasyonları zenginleştirir, performans kontrolleri,
     kullanıcı arayüzü kontrolleri, veri önbellekleme ve hata yönetimi ekler.
   ============================================================ */

/* ============================================================
   YARDIMCI FONKSİYONLAR
   ============================================================ */

/**
 * Rastgele sayı üretir (min dahil, max hariç)
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Dereceyi radyana çevirir
 * @param {number} deg 
 * @returns {number}
 */
function degToRad(deg) {
  return deg * Math.PI / 180;
}

/**
 * Renkleri karıştırmak için yardımcı (linear interpolation)
 * @param {string} a - başlangıç renk (hex veya rgba)
 * @param {string} b - bitiş renk
 * @param {number} t - 0..1
 * @returns {string}
 */
function lerpColor(a, b, t) {
  // Basit hex destekli karıştırma (örnek: "#ff0000")
  function hexToRgb(hex) {
    hex = hex.replace('#','');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }
  function rgbToHex(r,g,b) {
    return '#' + [r,g,b].map(v => {
      const s = Math.round(v).toString(16);
      return s.length === 1 ? '0' + s : s;
    }).join('');
  }
  try {
    const ca = hexToRgb(a);
    const cb = hexToRgb(b);
    const r = ca.r + (cb.r - ca.r) * t;
    const g = ca.g + (cb.g - ca.g) * t;
    const bl = ca.b + (cb.b - ca.b) * t;
    return rgbToHex(r,g,bl);
  } catch (e) {
    return a;
  }
}

/* ============================================================
   PERFORMANS & YÖNETİM
   ============================================================ */

let animationHandles = []; // requestAnimationFrame id'lerini tutar

/**
 * Tüm animasyonları durdurur (örneğin yeni animasyon başlatılmadan önce)
 */
function stopAllAnimations() {
  for (let id of animationHandles) {
    try { cancelAnimationFrame(id); } catch(e) {}
  }
  animationHandles = [];
}

/**
 * requestAnimationFrame wrapper: id'yi kaydeder
 * @param {Function} fn 
 */
function raf(fn) {
  const id = requestAnimationFrame(fn);
  animationHandles.push(id);
  return id;
}

/* ============================================================
   GELİŞMİŞ YAĞMUR (SPLASH, RAIN LAYERS)
   ============================================================ */

let rainLayers = []; // farklı yoğunluk ve hız katmanları

function createAdvancedRain(layers = 3) {
  rainLayers = [];
  const baseCount = 300;
  for (let i = 0; i < layers; i++) {
    const layer = {
      drops: [],
      count: baseCount * (i+1),
      speedMultiplier: 1 + i * 0.5,
      alpha: 0.3 + i * 0.2,
      width: 1 + i
    };
    for (let j = 0; j < layer.count; j++) {
      layer.drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: (2 + Math.random() * 6) * layer.speedMultiplier,
        length: 8 + Math.random() * 12,
        sway: Math.random() * 0.5
      });
    }
    rainLayers.push(layer);
  }
  animateAdvancedRain();
}

function animateAdvancedRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let li = 0; li < rainLayers.length; li++) {
    const layer = rainLayers[li];
    ctx.strokeStyle = `rgba(200,220,255,${layer.alpha})`;
    ctx.lineWidth = layer.width;
    for (let i = 0; i < layer.drops.length; i++) {
      const d = layer.drops[i];
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.sway, d.y + d.length);
      ctx.stroke();
      d.y += d.speed;
      d.x += Math.sin((d.y + i) / 50) * d.sway;
      if (d.y > canvas.height) {
        // splash efekti için kısa süreli bir parlama
        createSplash(d.x, canvas.height - 2);
        d.y = -rand(10, 200);
        d.x = Math.random() * canvas.width;
      }
    }
  }
  if (lightningActive) drawLightningFlash();
  raf(animateAdvancedRain);
}

/* Splash efektleri */
let splashes = [];

function createSplash(x, y) {
  const count = Math.floor(rand(3,8));
  for (let i = 0; i < count; i++) {
    splashes.push({
      x: x + rand(-10,10),
      y: y,
      vx: rand(-2,2),
      vy: rand(-4,-1),
      life: rand(20,40)
    });
  }
}

/* Animate splashes */
function animateSplashes() {
  for (let i = splashes.length - 1; i >= 0; i--) {
    const s = splashes[i];
    ctx.fillStyle = 'rgba(200,220,255,0.8)';
    ctx.beginPath();
    ctx.arc(s.x, s.y, 1.5, 0, Math.PI*2);
    ctx.fill();
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.2; // gravity
    s.life--;
    if (s.life <= 0) splashes.splice(i,1);
  }
}

/* ============================================================
   GELİŞMİŞ KAR (DRIFT, WIND EFFECT)
   ============================================================ */

let snowFields = [];

function createAdvancedSnow(fields = 3) {
  snowFields = [];
  for (let f = 0; f < fields; f++) {
    const field = {
      flakes: [],
      count: 100 + f * 50,
      drift: 0.2 + f * 0.3,
      sizeMultiplier: 1 + f * 0.3
    };
    for (let i = 0; i < field.count; i++) {
      field.flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: rand(1,3) * field.sizeMultiplier,
        speed: rand(0.2,1.2) * field.sizeMultiplier,
        angle: rand(0, Math.PI*2)
      });
    }
    snowFields.push(field);
  }
  animateAdvancedSnow();
}

function animateAdvancedSnow() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = 'white';
  for (let f = 0; f < snowFields.length; f++) {
    const field = snowFields[f];
    for (let i = 0; i < field.flakes.length; i++) {
      const fl = field.flakes[i];
      ctx.beginPath();
      ctx.arc(fl.x, fl.y, fl.radius, 0, Math.PI*2);
      ctx.fill();
      fl.x += Math.sin(fl.angle) * field.drift;
      fl.y += fl.speed;
      fl.angle += 0.01;
      if (fl.y > canvas.height) {
        fl.y = -rand(0,200);
        fl.x = Math.random() * canvas.width;
      }
      if (fl.x > canvas.width + 50) fl.x = -50;
      if (fl.x < -50) fl.x = canvas.width + 50;
    }
  }
  raf(animateAdvancedSnow);
}

/* ============================================================
   GELİŞMİŞ BULUTLAR (PARALLAX, LAYERED)
   ============================================================ */

let cloudLayers = [];

function createLayeredClouds(layers = 4) {
  cloudLayers = [];
  for (let i = 0; i < layers; i++) {
    const layer = {
      puffs: [],
      speed: 0.2 + i * 0.3,
      alpha: 0.2 + i * 0.15,
      yBase: rand(20, 200) + i * 30
    };
    const puffCount = 6 + i * 4;
    for (let p = 0; p < puffCount; p++) {
      layer.puffs.push({
        x: rand(-200, canvas.width + 200),
        y: layer.yBase + rand(-30,30),
        size: rand(60, 160) * (1 + i*0.2),
        sway: rand(0.2, 1.2)
      });
    }
    cloudLayers.push(layer);
  }
  animateLayeredClouds();
}

function animateLayeredClouds() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (let li = 0; li < cloudLayers.length; li++) {
    const layer = cloudLayers[li];
    ctx.fillStyle = `rgba(255,255,255,${layer.alpha})`;
    for (let p = 0; p < layer.puffs.length; p++) {
      const puff = layer.puffs[p];
      ctx.beginPath();
      ctx.ellipse(puff.x, puff.y, puff.size, puff.size*0.6, 0, 0, Math.PI*2);
      ctx.fill();
      puff.x += layer.speed * (0.5 + Math.sin(Date.now()/10000 + p) * 0.5);
      puff.y += Math.sin((puff.x + p) / 200) * 0.2;
      if (puff.x > canvas.width + 200) {
        puff.x = -200;
        puff.y = layer.yBase + rand(-30,30);
      }
    }
  }
  raf(animateLayeredClouds);
}

/* ============================================================
   ŞİMŞEK DETAYLARI (FORKED LIGHTNING)
   ============================================================ */

function drawLightningFlash() {
  // kısa parlama
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillRect(0,0,canvas.width, canvas.height);
  // forked lightning çizimi
  drawForkedLightning(canvas.width * rand(0.1,0.9), 0, 10);
}

function drawForkedLightning(x, y, depth) {
  // recursive-ish forked lightning
  const segments = 6 + Math.floor(rand(0,6));
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  let cx = x, cy = y;
  for (let i = 0; i < segments; i++) {
    const nx = cx + rand(-40,40);
    const ny = cy + rand(30,120);
    ctx.lineTo(nx, ny);
    if (Math.random() < 0.2 && depth > 0) {
      // fork
      drawForkedLightning(nx, ny, depth - 1);
    }
    cx = nx; cy = ny;
  }
  ctx.stroke();
}

/* ============================================================
   GÖKKUŞAĞI VARYASYONLARI (HALO, ARC, FADE)
   ============================================================ */

function createRainbowVariants() {
  rainbow = [];
  const centerX = canvas.width / 2;
  const baseY = canvas.height - 150;
  for (let i = 0; i < 3; i++) {
    rainbow.push({
      x: centerX + rand(-100,100),
      y: baseY + rand(-30,30),
      radius: 180 + i * 20,
      width: 12 + i * 4,
      alpha: 0.6 - i * 0.15
    });
  }
  animateRainbowVariants();
}

function animateRainbowVariants() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (let r = 0; r < rainbow.length; r++) {
    const item = rainbow[r];
    const colors = ['red','orange','yellow','green','blue','indigo','violet'];
    for (let c = 0; c < colors.length; c++) {
      ctx.beginPath();
      ctx.strokeStyle = colors[c];
      ctx.globalAlpha = item.alpha * (1 - c * 0.08);
      ctx.lineWidth = item.width;
      ctx.arc(item.x, item.y, item.radius - c * (item.width + 2), Math.PI, 2*Math.PI);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    item.x += Math.sin(Date.now()/2000 + r) * 0.2;
  }
  raf(animateRainbowVariants);
}

/* ============================================================
   AURORA GELİŞMELERİ (NOISE-BASED MOVEMENT)
   ============================================================ */

function perlinNoise(x) {
  // Basit pseudo-noise fonksiyonu (performans için)
  return Math.sin(x * 0.01) * 0.5 + Math.cos(x * 0.03) * 0.5;
}

function createAuroraAdvanced() {
  aurora = [];
  for (let i = 0; i < 6; i++) {
    aurora.push({
      x: rand(0, canvas.width),
      y: rand(20, 200),
      width: rand(200, 600),
      height: rand(40, 140),
      hue: rand(120, 200),
      phase: rand(0, Math.PI*2)
    });
  }
  animateAuroraAdvanced();
}

function animateAuroraAdvanced() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for (let i = 0; i < aurora.length; i++) {
    const a = aurora[i];
    const grad = ctx.createLinearGradient(a.x, a.y, a.x + a.width, a.y + a.height);
    const t = (Math.sin(Date.now()/1000 + a.phase) + 1) / 2;
    const color1 = `hsla(${a.hue}, 100%, ${40 + t*20}%, ${0.25 + t*0.25})`;
    const color2 = `hsla(${a.hue+40}, 100%, ${30 + t*20}%, ${0.05 + t*0.15})`;
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.beginPath();
    // dalgalı üst sınır
    ctx.moveTo(a.x, a.y);
    for (let px = 0; px <= a.width; px += 10) {
      const ny = a.y + Math.sin((px + Date.now()/50) / 50) * 20;
      ctx.lineTo(a.x + px, ny);
    }
    ctx.lineTo(a.x + a.width, a.y + a.height);
    ctx.lineTo(a.x, a.y + a.height);
    ctx.closePath();
    ctx.fill();
    a.x += Math.sin(Date.now()/2000 + i) * 0.2;
  }
  raf(animateAuroraAdvanced);
}

/* ============================================================
   SICAKLIK VE RÜZGAR GRAFİKLERİ (CANVAS-BASED MINI CHARTS)
   ============================================================ */

/**
 * Basit çizgi grafiği çizer
 * @param {number[]} values 
 * @param {number} x 
 * @param {number} y 
 * @param {number} w 
 * @param {number} h 
 * @param {string} color 
 */
function drawMiniLineChart(values, x, y, w, h, color = '#fff') {
  if (!values || values.length === 0) return;
  const max = Math.max(...values);
  const min = Math.min(...values);
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let i = 0; i < values.length; i++) {
    const vx = x + (i / (values.length - 1)) * w;
    const vy = y + h - ((values[i] - min) / (max - min || 1)) * h;
    if (i === 0) ctx.moveTo(vx, vy);
    else ctx.lineTo(vx, vy);
  }
  ctx.stroke();
  ctx.restore();
}

/* ============================================================
   VERİ ÖNBELLEKLEME (LOCALSTORAGE)
   ============================================================ */

const CACHE_KEY_PREFIX = 'weather_sim_cache_';

/**
 * Veriyi cache'ler (localStorage)
 * @param {string} city 
 * @param {object} data 
 */
function cacheWeather(city, data) {
  try {
    const key = CACHE_KEY_PREFIX + city.toLowerCase();
    const payload = {
      ts: Date.now(),
      data: data
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (e) {
    // localStorage dolu veya erişim yoksa sessizce geç
  }
}

/**
 * Cache'ten veri alır, geçerlilik süresi parametre olarak verilebilir
 * @param {string} city 
 * @param {number} maxAgeMs 
 * @returns {object|null}
 */
function getCachedWeather(city, maxAgeMs = 1000 * 60 * 10) { // default 10 dakika
  try {
    const key = CACHE_KEY_PREFIX + city.toLowerCase();
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (Date.now() - payload.ts > maxAgeMs) {
      localStorage.removeItem(key);
      return null;
    }
    return payload.data;
  } catch (e) {
    return null;
  }
}

/* ============================================================
   GELİŞMİŞ API ENTEGRASYONU (HATA YÖNETİMİ, RETRY)
   ============================================================ */

/**
 * Fetch wrapper with retry
 * @param {string} url 
 * @param {number} retries 
 * @param {number} backoffMs 
 */
async function fetchWithRetry(url, retries = 2, backoffMs = 500) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response not ok: ' + res.status);
      return await res.json();
    } catch (e) {
      if (i === retries) throw e;
      await new Promise(r => setTimeout(r, backoffMs * (i+1)));
    }
  }
}

/**
 * Gelişmiş getWeather: cache kontrolü, retry, detaylı veri işleme
 */
async function getWeatherAdvanced() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Lütfen bir şehir girin!");
    return;
  }

  // Cache kontrolü
  const cached = getCachedWeather(city, 1000 * 60 * 5); // 5 dakika
  if (cached) {
    processWeatherData(cached, city);
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=tr`;
  try {
    const data = await fetchWithRetry(url, 3, 700);
    cacheWeather(city, data);
    processWeatherData(data, city);
  } catch (e) {
    console.error('Hava durumu verisi alınamadı:', e);
    alert('Hava durumu verisi alınamadı. Lütfen daha sonra tekrar deneyin.');
  }
}

/**
 * API'den gelen veriyi işler ve UI + animasyonları tetikler
 * @param {object} data 
 * @param {string} city 
 */
function processWeatherData(data, city) {
  if (!data || !data.list || data.list.length === 0) {
    alert('Geçersiz veri alındı.');
    return;
  }
  const current = data.list[0];
  document.getElementById("weather-info").innerHTML =
    `${city} için anlık sıcaklık: <strong>${current.main.temp}°C</strong>, ${current.weather[0].description}`;

  // 10 günlük özet oluştur (OpenWeatherMap 3 saatlik veriler döner; günlük özet için gruplama)
  const daily = {};
  for (let i = 0; i < data.list.length; i++) {
    const item = data.list[i];
    const dateKey = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!daily[dateKey]) daily[dateKey] = { temps: [], weather: [] };
    daily[dateKey].temps.push(item.main.temp);
    daily[dateKey].weather.push(item.weather[0].main);
  }
  const days = Object.keys(daily).slice(0, 10);
  const tbody = document.querySelector("#forecast tbody");
  tbody.innerHTML = '';
  const tempSeries = [];
  for (let d of days) {
    const info = daily[d];
    const min = Math.min(...info.temps).toFixed(1);
    const max = Math.max(...info.temps).toFixed(1);
    const modeWeather = mode(info.weather);
    const row = `<tr>
      <td>${new Date(d).toLocaleDateString('tr-TR')}</td>
      <td>${modeWeather}</td>
      <td>${min}°C</td>
      <td>${max}°C</td>
    </tr>`;
    tbody.innerHTML += row;
    tempSeries.push((parseFloat(min) + parseFloat(max)) / 2);
  }

  // Mini grafik çiz
  drawMiniCharts(tempSeries);

  // Animasyon seçimi
  const condition = current.weather[0].main;
  startAnimation(condition);

  // Eğer yağmursa gelişmiş yağmur, kar ise gelişmiş kar, açık ise güneş+gökkuşağı
  if (condition === 'Rain' || condition === 'Drizzle') {
    stopAllAnimations();
    createAdvancedRain(3);
    raf(loopWithSplashes);
  } else if (condition === 'Snow') {
    stopAllAnimations();
    createAdvancedSnow(3);
  } else if (condition === 'Clear') {
    stopAllAnimations();
    createSun();
    createRainbowVariants();
  } else if (condition === 'Clouds') {
    stopAllAnimations();
    createLayeredClouds(4);
  } else if (condition === 'Thunderstorm') {
    stopAllAnimations();
    createAdvancedRain(3);
    lightningActive = true;
    raf(loopWithLightning);
  } else {
    // default
    stopAllAnimations();
    createLayeredClouds(3);
    createSun();
  }
}

/* ============================================================
   YARDIMCI: MOD (en sık görülen öğeyi bul)
   ============================================================ */
function mode(arr) {
  const freq = {};
  let max = 0, result = null;
  for (let v of arr) {
    freq[v] = (freq[v] || 0) + 1;
    if (freq[v] > max) { max = freq[v]; result = v; }
  }
  return result;
}

/* ============================================================
   MINI CHARTS ÇİZİMİ (UI ÜZERİNDEKİ KÜÇÜK GRAFİKLER)
   ============================================================ */

function drawMiniCharts(tempSeries) {
  // Canvas'ı temizlemeden önce mevcut animasyonları korumak için ayrı bir overlay canvas kullanılabilir.
  // Bu örnekte ana canvas üzerinde küçük bir köşede grafik çiziyoruz.
  const margin = 20;
  const w = 300;
  const h = 80;
  const x = canvas.width - w - margin;
  const y = canvas.height - h - margin;
  // hafif arka plan
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(x - 8, y - 8, w + 16, h + 16);
  drawMiniLineChart(tempSeries, x, y, w, h, '#ffd54f');
  // etiket
  ctx.fillStyle = '#fff';
  ctx.font = '12px Arial';
  ctx.fillText('10 Gün Ortalama Sıcaklık', x, y - 10);
}

/* ============================================================
   ANA DÖNGÜLER (SPLASH VE LIGHTNING İÇİN)
   ============================================================ */

function loopWithSplashes() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // yağmur katmanlarını çiz
  for (let li = 0; li < rainLayers.length; li++) {
    const layer = rainLayers[li];
    ctx.strokeStyle = `rgba(200,220,255,${layer.alpha})`;
    ctx.lineWidth = layer.width;
    for (let i = 0; i < layer.drops.length; i++) {
      const d = layer.drops[i];
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.sway, d.y + d.length);
      ctx.stroke();
      d.y += d.speed;
      d.x += Math.sin((d.y + i) / 50) * d.sway;
      if (d.y > canvas.height) {
        createSplash(d.x, canvas.height - 2);
        d.y = -rand(10, 200);
        d.x = Math.random() * canvas.width;
      }
    }
  }
  animateSplashes();
  raf(loopWithSplashes);
}

function loopWithLightning() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // yağmur
  for (let li = 0; li < rainLayers.length; li++) {
    const layer = rainLayers[li];
    ctx.strokeStyle = `rgba(200,220,255,${layer.alpha})`;
    ctx.lineWidth = layer.width;
    for (let i = 0; i < layer.drops.length; i++) {
      const d = layer.drops[i];
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.sway, d.y + d.length);
      ctx.stroke();
      d.y += d.speed;
      if (d.y > canvas.height) {
        createSplash(d.x, canvas.height - 2);
        d.y = -rand(10, 200);
        d.x = Math.random() * canvas.width;
      }
    }
  }
  animateSplashes();
  if (Math.random() < 0.005) {
    drawForkedLightning(rand(0, canvas.width), 0, 3);
  }
  raf(loopWithLightning);
}

/* ============================================================
   KULLANICI ARAYÜZÜ KONTROLLERİ (SLIDER, BUTONLAR)
   ============================================================ */

/**
 * Basit UI oluşturucu: sayfaya kontrol paneli ekler
 * Bu fonksiyon index.html'de zaten bir header/search varsa ek kontroller ekler.
 */
function createControlPanel() {
  const panel = document.createElement('div');
  panel.id = 'controlPanel';
  panel.style.position = 'fixed';
  panel.style.left = '10px';
  panel.style.bottom = '10px';
  panel.style.background = 'rgba(0,0,0,0.4)';
  panel.style.padding = '12px';
  panel.style.borderRadius = '8px';
  panel.style.color = '#fff';
  panel.style.zIndex = 9999;
  panel.style.fontFamily = 'Arial, sans-serif';
  panel.style.fontSize = '13px';
  panel.innerHTML = `
    <div style="margin-bottom:8px;"><strong>Animasyon Kontrolleri</strong></div>
    <div style="margin-bottom:6px;">
      <label>Yağmur Yoğunluğu: <span id="rainVal">3</span></label><br>
      <input id="rainSlider" type="range" min="0" max="5" value="3" />
    </div>
    <div style="margin-bottom:6px;">
      <label>Kar Yoğunluğu: <span id="snowVal">2</span></label><br>
      <input id="snowSlider" type="range" min="0" max="5" value="2" />
    </div>
    <div style="margin-bottom:6px;">
      <label>Rüzgar: <span id="windVal">5</span></label><br>
      <input id="windSlider" type="range" min="0" max="20" value="5" />
    </div>
    <div style="display:flex;gap:6px;margin-top:8px;">
      <button id="btnDay">Gündüz</button>
      <button id="btnNight">Gece</button>
      <button id="btnClear">Temizle</button>
    </div>
  `;
  document.body.appendChild(panel);

  // Event bağlama
  document.getElementById('rainSlider').addEventListener('input', (e) => {
    const v = parseInt(e.target.value,10);
    document.getElementById('rainVal').innerText = v;
    // yeniden oluştur
    stopAllAnimations();
    if (v > 0) createAdvancedRain(v);
  });
  document.getElementById('snowSlider').addEventListener('input', (e) => {
    const v = parseInt(e.target.value,10);
    document.getElementById('snowVal')?.remove();
    document.getElementById('snowVal')?.innerText = v;
    // yeniden oluştur
    stopAllAnimations();
    if (v > 0) createAdvancedSnow(v);
  });
  document.getElementById('windSlider').addEventListener('input', (e) => {
    const v = parseInt(e.target.value,10);
    document.getElementById('windVal').innerText = v;
    // rüzgar oklarını güncelle
    windArrows = [];
    createWindArrows(v);
  });

  document.getElementById('btnDay').addEventListener('click', () => {
    createDayMode();
  });
  document.getElementById('btnNight').addEventListener('click', () => {
    createNightMode();
  });
  document.getElementById('btnClear').addEventListener('click', () => {
    stopAllAnimations();
    ctx.clearRect(0,0,canvas.width,canvas.height);
  });
}

/* ============================================================
   İNİTİALİZASYON (TÜM BÖLÜMLER BİRLEŞTİRİLDİĞİNDE ÇALIŞIR)
   ============================================================ */

function initializeAll() {
  initCanvas();
  createControlPanel();
  // Varsayılan animasyon
  createLayeredClouds(3);
  createSun();
  // UI butonunu index.html'deki "Göster" butonuna bağla (eğer varsa)
  const showBtn = document.querySelector('header .search-bar button') || document.querySelector('button[onclick="getWeather()"]');
  if (showBtn) {
    showBtn.addEventListener('click', (e) => {
      // gelişmiş getWeather çağrısı
      getWeatherAdvanced();
    });
  }
  // Enter ile arama
  const cityInput = document.getElementById('cityInput');
  if (cityInput) {
    cityInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') getWeatherAdvanced();
    });
  }
  // Başlangıçta kontrol panel değerlerini uygula
  const rainVal = document.getElementById('rainSlider')?.value || 3;
  if (rainVal > 0) createAdvancedRain(parseInt(rainVal,10));
  // performans için animasyon döngüsü: splashes ve diğer overlay'leri çiz
  function overlayLoop() {
    // overlay çizimleri: splashes, mini grafik etiketleri vb.
    animateSplashes();
    raf(overlayLoop);
  }
  raf(overlayLoop);
}

/* ============================================================
   EKSTRA: EXPORT / PAYLAŞIM İÇİN KISA BİLGİ (SADECE METİN)
   ============================================================ */

/**
 * Kullanıcıya gösterilecek kısa paylaşım metni oluşturur
 * (GitHub README veya sosyal paylaşım için)
 */
function generateShareText(city) {
  const now = new Date();
  return `Hava Durumu Simülasyonu - ${city}\nTarih: ${now.toLocaleString('tr-TR')}\nBu simülasyon OpenWeatherMap verileriyle anlık ve 10 günlük tahminleri gösterir.`;
}

/* ============================================================
   SON DOKUNUŞLAR: OTOMATİK BAŞLATMA
   ============================================================ */

window.addEventListener('load', () => {
  try {
    initializeAll();
  } catch (e) {
    console.error('Başlatma sırasında hata:', e);
  }
});

/* ============================================================
   UZUN YORUMLAR VE EK AÇIKLAMALAR
   - Bu dosya üç parçaya bölünmüş şekilde üretildi: Bölüm 1, Bölüm 2, Bölüm 3.
   - Birleştirme sırasında fonksiyon isimleri çakışmamalıdır. Eğer çakışma olursa
     fonksiyon isimlerini benzersiz hale getirmeniz gerekir.
   - Performans: Çok sayıda animasyon aynı anda çalıştırmak tarayıcıyı zorlayabilir.
     Bu yüzden stopAllAnimations() ile gereksiz animasyonları durdurmak önemlidir.
   - API anahtarı: apiKey değişkenine OpenWeatherMap API anahtarınızı ekleyin.
   - Güvenlik: API anahtarını istemci tarafında tutmak basit projeler için kabul edilebilir,
     ancak üretim projelerinde sunucu tarafı proxy veya gizleme yöntemleri kullanın.
   - Geliştirme: Daha iyi yapı için modüler ES6 import/export, Webpack veya Vite kullanılabilir.
   ============================================================ */

/* EOF - Bölüm 3/3 */
