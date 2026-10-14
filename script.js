
const sticks = Array.from(document.querySelectorAll(".yut-stick"));
const throwButton = document.getElementById("throwButton");

const resultEmoji = document.getElementById("resultEmoji");
const resultName = document.getElementById("resultName");
const resultMessage = document.getElementById("resultMessage");
const extraNote = document.getElementById("extraNote");
const floorShadow = document.getElementById("floorShadow");

const outcomes = {
  0: {
    name: "모",
    emoji: "🎉",
    steps: 5,
    extra: true,
    message: "5칸 이동",
  },
  1: {
    name: "도",
    emoji: "🍀",
    steps: 1,
    extra: false,
    message: "1칸 이동",
  },
  2: {
    name: "개",
    emoji: "🌟",
    steps: 2,
    extra: false,
    message: "2칸 이동",
  },
  3: {
    name: "걸",
    emoji: "✨",
    steps: 3,
    extra: false,
    message: "3칸 이동",
  },
  4: {
    name: "윷",
    emoji: "🎊",
    steps: 4,
    extra: true,
    message: "4칸 이동",
  },
};

let isThrowing = false;
let animationTimers = [];

function clearAnimationTimers() {
  animationTimers.forEach(clearTimeout);
  animationTimers = [];
}

function setStickFace(stick, flipped, rotation = {}) {
  const body = stick.querySelector(".yut-3d");

  stick.classList.remove("throwing");
  body.classList.remove("spinning");

  // 이전 회전값 제거
  body.style.animation = "none";
  body.style.transform = "";

  // 브라우저가 초기 상태를 적용하도록 함
  void body.offsetWidth;

  // 앞면은 점 3개, 뒷면은 갈색
  if (flipped) {
    body.style.transform =
      `rotateX(${rotation.x ?? 0}deg) ` +
      `rotateY(${180 + (rotation.y ?? 0)}deg) ` +
      `rotateZ(${rotation.z ?? 0}deg)`;
  } else {
    body.style.transform =
      `rotateX(${rotation.x ?? 0}deg) ` +
      `rotateY(${rotation.y ?? 0}deg) ` +
      `rotateZ(${rotation.z ?? 0}deg)`;
  }

  body.style.animation = "";
}

function tossYuts() {
  if (isThrowing) return;

  isThrowing = true;
  throwButton.disabled = true;
  throwButton.textContent = "🪵 윷 던지는 중...";

  resultEmoji.textContent = "🎲";
  resultName.textContent = "던지는 중...";
  resultMessage.textContent = "윷이 공중에서 회전하고 있어요!";
  extraNote.textContent = "";

  if (floorShadow) {
    floorShadow.style.transform = "scale(0.7)";
    floorShadow.style.opacity = "0.35";
  }

  clearAnimationTimers();

  // 각 윷의 뒤집힘을 개별적으로 결정
  const results = sticks.map(() => Math.random() < 0.5);

  sticks.forEach((stick, index) => {
    const body = stick.querySelector(".yut-3d");

    stick.classList.remove("throwing");
    body.style.animation = "none";
    body.style.transform = "";

    void body.offsetWidth;

    // 윷마다 서로 다른 회전 타이밍과 방향을 줌
    const delay = index * 85;

    const timer = setTimeout(() => {
      stick.classList.add("throwing");

      body.style.animation = "yut-spin 1.5s cubic-bezier(0.2, 0.7, 0.25, 1) both";

      // 윷마다 다른 회전 방향을 사용
      body.style.animationDelay = "0s";

      const direction = index % 2 === 0 ? 1 : -1;
      body.style.transformOrigin = "center center";
      body.style.setProperty("--spin-direction", direction);
    }, delay);

    animationTimers.push(timer);
  });

  const finishTimer = setTimeout(() => {
    let flippedCount = 0;

    sticks.forEach((stick, index) => {
      const body = stick.querySelector(".yut-3d");

      stick.classList.remove("throwing");
      body.style.animation = "none";

      const flipped = results[index];

      if (flipped) {
        flippedCount++;
      }

      // 최종 면이 보이도록 실제 회전 각도를 설정
      const rotations = [
        { x: 0, y: 0, z: -7 },
        { x: 8, y: 0, z: 5 },
        { x: -6, y: 0, z: 9 },
        { x: 4, y: 0, z: -4 },
      ];

      setStickFace(stick, flipped, rotations[index]);
    });

    const outcome = outcomes[flippedCount];

    resultEmoji.textContent = outcome.emoji;
    resultName.textContent =
      `${outcome.name} (${outcome.steps}칸 이동)`;
    resultMessage.textContent = outcome.message;

    extraNote.textContent = outcome.extra
      ? "🎉 한 번 더 던지세요!"
      : "";

    if (floorShadow) {
      floorShadow.style.transform = "scale(1)";
      floorShadow.style.opacity = "1";
    }

    throwButton.disabled = false;
    throwButton.textContent = "🎲 윷 던지기";
    isThrowing = false;
  }, 1900);

  animationTimers.push(finishTimer);
}

throwButton.addEventListener("click", tossYuts);
