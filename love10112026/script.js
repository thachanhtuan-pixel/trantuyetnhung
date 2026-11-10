/* =========================================================
   LOVE 10112026 — main interactions
   Chỉnh nội dung mưa chữ trong RAIN_TEXTS và thông điệp cuối
   trong index.html. Các file media đặt cạnh 3 file chính.
   ========================================================= */

const CONFIG = {
  audioFadeDuration: 2400,
  centerSequenceStartDelay: 4000,
  centerSequenceItemDuration: 4000,
  centerSequenceFadeDuration: 650,
  rainSpawnInterval: 240,
  sparkleSpawnInterval: 330,
  maxRainItems: 75,
  textRainChance: 0.72,
  imageSources: ["image1.png", "image2.png"]
};

const RAIN_TEXTS = ["tuan", "nhung", "05.08"];
// Các dòng chữ lớn xuất hiện giữa màn hình, lần lượt cách nhau 4 giây.
const CENTER_SEQUENCE_TEXTS = ["anh hứa..", "dù trời có sập..", "người thương em nhất..", "vẫn sẽ là anh..", "anh thương em.."];
const SPARKLE_SYMBOLS = ["✦", "✧", "♡", "⋆", "✴"];

const elements = {
  envelope: document.getElementById("envelope"),
  letter: document.getElementById("letter"),
  openButton: document.getElementById("openButton"),
  envelopeSeal: document.getElementById("envelopeSeal"),
  hint: document.getElementById("letterHint"),
  scene: document.getElementById("letterScene"),
  surpriseButton: document.getElementById("surpriseButton"),
  surpriseScreen: document.getElementById("surpriseScreen"),
  surpriseMessage: document.getElementById("surpriseMessage"),
  centerSequence: document.getElementById("centerSequence"),
  centerSequenceText: document.getElementById("centerSequenceText"),
  rainLayer: document.getElementById("rainLayer"),
  imageTemplate: document.getElementById("imageRainTemplate"),
  audio1: document.getElementById("audio1"),
  audio2: document.getElementById("audio2")
};

const state = {
  isOpened: false,
  pullStep: 0,
  isSurpriseStarted: false,
  rainTimer: null,
  sparkleTimer: null,
  centerSequenceTimer: null
};

/** Chuyển âm lượng audio đến mức đích bằng setInterval. */
function fadeAudio(audio, targetVolume, duration = CONFIG.audioFadeDuration) {
  return new Promise((resolve) => {
    if (!audio) return resolve();

    const target = Math.min(1, Math.max(0, targetVolume));
    const startVolume = Number.isFinite(audio.volume) ? audio.volume : 0;
    const distance = target - startVolume;
    const steps = Math.max(1, Math.ceil(duration / 50));
    const stepAmount = distance / steps;
    let currentStep = 0;

    if (Math.abs(distance) < 0.01) {
      audio.volume = target;
      return resolve();
    }

    const timer = window.setInterval(() => {
      currentStep += 1;
      audio.volume = Math.min(1, Math.max(0, startVolume + stepAmount * currentStep));
      if (currentStep >= steps) {
        window.clearInterval(timer);
        audio.volume = target;
        resolve();
      }
    }, 50);
  });
}

/** Phát audio an toàn: trang vẫn chạy bình thường nếu bạn chưa thêm file mp3. */
async function playAudio(audio, initialVolume = 0) {
  if (!audio) return false;
  audio.volume = initialVolume;
  try {
    await audio.play();
    return true;
  } catch (error) {
    console.warn(`Không thể phát ${audio.getAttribute("src")}. Hãy thêm file âm thanh tương ứng.`, error);
    return false;
  }
}

async function startFirstSong() {
  const started = await playAudio(elements.audio1, 0);
  if (started) await fadeAudio(elements.audio1, 0.72);
}

function updateHint(message) {
  elements.hint.textContent = message;
}

/** Giai đoạn 1: mở nắp phong bì và bắt đầu nhạc nền đầu tiên. */
function openEnvelope() {
  if (state.isOpened || state.isSurpriseStarted) return;
  state.isOpened = true;
  elements.envelope.classList.add("is-opened");
  elements.letter.classList.add("is-opened");
  elements.letter.setAttribute("aria-label", "Lá thư. Nhấn thêm hai lần để rút thư ra, rồi nhấn lần nữa để đọc.");
  updateHint("Đó đó!!! em bấm lá thư tiếp điii");
  startFirstSong();
}

/** Giai đoạn 2–3: mỗi lần chạm thư sẽ tiến thêm một trạng thái. */
function advanceLetter() {
  if (!state.isOpened || state.isSurpriseStarted || state.pullStep >= 3) return;

  state.pullStep += 1;
  if (state.pullStep === 1) {
    elements.letter.classList.add("is-pulled-half");
    updateHint("Sắp được rồi đó!! bấm tiếp cho anhhh");
  } else if (state.pullStep === 2) {
    elements.letter.classList.remove("is-pulled-half");
    elements.letter.classList.add("is-pulled-full");
    updateHint("Lá thư đã được rút ra. Đọc tâm tư của anh đi nhee");
  } else {
    // Kích hoạt trạng thái sẵn sàng phóng to trước
    elements.letter.classList.add("is-fullscreen-prepare");
    elements.scene.classList.add("is-reading");
    
    // Đợi 50ms để trình duyệt bắt đầu hiệu ứng mượt mà rồi mới chuyển fixed fullscreen
    window.setTimeout(() => {
      if (elements.letter.parentElement !== document.body) {
        document.body.appendChild(elements.letter);
      }
      elements.letter.classList.remove("is-fullscreen-prepare");
      elements.letter.classList.add("is-fullscreen");
      elements.letter.setAttribute("role", "article");
      elements.letter.setAttribute("aria-label", "Nội dung thư sinh nhật");
      updateHint("Đọc thư thật chậm nhé ♡");
      
      window.setTimeout(() => {
        elements.letter.scrollTo({ top: 0, behavior: "smooth" });
      }, 80);
    }, 50);
  }
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function countRainItems() {
  return elements.rainLayer.children.length;
}

function appendFallingItem(node, options = {}) {
  const duration = randomBetween(options.minDuration || 7, options.maxDuration || 13);
  const left = randomBetween(0, 96);
  const drift = randomBetween(-110, 110);
  const rotation = randomBetween(-28, 28);
  const opacity = randomBetween(0.45, 0.95);

  node.style.setProperty("--left", `${left}%`);
  node.style.setProperty("--duration", `${duration}s`);
  node.style.setProperty("--drift", `${drift}px`);
  node.style.setProperty("--rotate", `${rotation}deg`);
  node.style.setProperty("--opacity", opacity.toFixed(2));
  elements.rainLayer.appendChild(node);

  // Tự dọn phần tử sau khi animation kết thúc để tránh tăng DOM liên tục.
  node.addEventListener("animationend", () => node.remove(), { once: true });
  window.setTimeout(() => node.remove(), (duration + 1) * 1000);
}

function createTextRain() {
  const item = document.createElement("div");
  item.className = "rain-item rain-item--text";
  item.textContent = RAIN_TEXTS[Math.floor(Math.random() * RAIN_TEXTS.length)];
  item.style.setProperty("--size", `${randomBetween(13, 25)}px`);
  appendFallingItem(item);
}

function createImageRain() {
  const template = elements.imageTemplate;
  if (!template) return createTextRain();

  const fragment = template.content.cloneNode(true);
  const wrapper = fragment.querySelector(".rain-item--image");
  const image = fragment.querySelector(".rain-item__img");
  const source = CONFIG.imageSources[Math.floor(Math.random() * CONFIG.imageSources.length)];
  image.src = source;
  image.alt = source === "image1.png" ? "Ảnh kỷ niệm thứ nhất" : "Ảnh kỷ niệm thứ hai";
  image.addEventListener("error", () => {
    image.classList.add("is-missing");
    image.alt = "Hãy thêm image1.png và image2.png vào thư mục";
    image.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='10' fill='%23402b3c'/%3E%3Ctext x='50' y='62' text-anchor='middle' font-size='42' fill='%23f5c4da'%3E%E2%99%A1%3C/text%3E%3C/svg%3E";
  }, { once: true });
  appendFallingItem(wrapper, { minDuration: 9, maxDuration: 15 });
}

function createSparkle() {
  const sparkle = document.createElement("span");
  sparkle.className = "rain-item rain-item--sparkle";
  sparkle.textContent = SPARKLE_SYMBOLS[Math.floor(Math.random() * SPARKLE_SYMBOLS.length)];
  sparkle.style.setProperty("--size", `${randomBetween(10, 22)}px`);
  appendFallingItem(sparkle, { minDuration: 6, maxDuration: 11 });
}

function startRainEffect() {
  if (state.rainTimer || state.sparkleTimer) return;

  state.rainTimer = window.setInterval(() => {
    if (countRainItems() >= CONFIG.maxRainItems) return;
    if (Math.random() < CONFIG.textRainChance) createTextRain();
    else createImageRain();
  }, CONFIG.rainSpawnInterval);

  state.sparkleTimer = window.setInterval(() => {
    if (countRainItems() < CONFIG.maxRainItems) createSparkle();
  }, CONFIG.sparkleSpawnInterval);
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

/**
 * Sau 4 giây, thay lời chào ban đầu bằng text4 → text8 ở chính giữa.
 * Mỗi dòng chiếm đúng 4 giây: reveal từ trái sang phải, giữ nhẹ, rồi fade.
 * Kết thúc sequence thì dọn chữ trung tâm; hiệu ứng mưa vẫn chạy độc lập.
 */
async function runCenterTextSequence() {
  if (!elements.centerSequence || !elements.centerSequenceText) return;

  elements.surpriseMessage?.classList.add("is-hidden");
  elements.centerSequence.classList.add("is-active");

  const fadeDuration = Math.min(
    CONFIG.centerSequenceFadeDuration,
    CONFIG.centerSequenceItemDuration
  );
  const visibleDuration = Math.max(0, CONFIG.centerSequenceItemDuration - fadeDuration);

  for (const message of CENTER_SEQUENCE_TEXTS) {
    elements.centerSequenceText.textContent = message;
    elements.centerSequenceText.classList.remove("is-entering", "is-leaving");
    // Kích hoạt lại keyframe cho mỗi dòng chữ.
    void elements.centerSequenceText.offsetWidth;
    elements.centerSequenceText.classList.add("is-entering");

    await wait(visibleDuration);
    elements.centerSequenceText.classList.remove("is-entering");
    elements.centerSequenceText.classList.add("is-leaving");
    await wait(fadeDuration);
  }

  elements.centerSequence.classList.remove("is-active");
  elements.centerSequence.classList.add("is-finished");
  elements.centerSequenceText.textContent = "";
}

function scheduleCenterTextSequence() {
  if (state.centerSequenceTimer || !CENTER_SEQUENCE_TEXTS.length) return;
  state.centerSequenceTimer = window.setTimeout(() => {
    state.centerSequenceTimer = null;
    runCenterTextSequence();
  }, CONFIG.centerSequenceStartDelay);
}

/** Giai đoạn 4: chuyển cảnh, đổi nhạc rồi khởi động mưa chữ/ảnh và hạt sáng. */
async function showBigSurprise() {
  if (state.isSurpriseStarted) return;
  state.isSurpriseStarted = true;
  elements.surpriseButton.disabled = true;
  elements.surpriseScreen.setAttribute("aria-hidden", "false");
  elements.surpriseScreen.classList.add("is-active");
  elements.letter.classList.add("is-leaving");

  await fadeAudio(elements.audio1, 0);
  if (elements.audio1) elements.audio1.pause();

  const secondSongStarted = await playAudio(elements.audio2, 0);
  if (secondSongStarted) await fadeAudio(elements.audio2, 0.82);
  startRainEffect();
  scheduleCenterTextSequence();
}

/* Tìm và thay thế hoàn toàn hàm bindEvents cũ trong file JS bằng đoạn này */
function bindEvents() {
  elements.openButton.addEventListener("click", openEnvelope);
  
  elements.letter.addEventListener("click", (event) => {
    // Nếu bấm trúng nút bất ngờ (hoặc các phần tử con bên trong nút), dừng ngay lập tức
    if (event.target.closest("#surpriseButton")) {
      event.stopPropagation();
      return;
    }
    advanceLetter();
  });
  
  elements.letter.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && state.isOpened && state.pullStep < 3) {
      event.preventDefault();
      advanceLetter();
    }
  });
  
  elements.surpriseButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation(); // Chặn đứng sự kiện click nổi bọt lên bức thư
    showBigSurprise();
  });
}


function init() {
  bindEvents();
  // Đưa hai audio về trạng thái an toàn trước tương tác đầu tiên.
  if (elements.audio1) elements.audio1.volume = 0;
  if (elements.audio2) elements.audio2.volume = 0;
}

document.addEventListener("DOMContentLoaded", init, { once: true });