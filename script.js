
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
    message: "5칸 이동"
  },
  1: {
    name: "도",
    emoji: "🍀",
    steps: 1,
    extra: false,
    message: "1칸 이동"
  },
  2: {
    name: "개",
    emoji: "🌟",
    steps: 2,
    extra: false,
    message: "2칸 이동"
  },
  3: {
    name: "걸",
    emoji: "✨",
    steps: 3,
    extra: false,
    message: "3칸 이동"
  },
  4: {
    name: "윷",
    emoji: "🎊",
    steps: 4,
    extra: true,
    message: "4칸 이동"
  }
};

let isThrowing = false;
let animationTimers = [];

function clearAnimationTimers() {
  animationTimers.forEach(clearTimeout);
  animationTimers = [];
}

/*
 * 애니메이션의 마지막 각도와 동일한 각도로 고정한다.
 * 면을 CSS 클래스 교체로 바꾸지 않고 3D 회전으로 결정한다.
 */
function setFinalRotation(stick, flipped, index) {
  const body = stick.querySelector(".yut-3d");

  stick.classList.remove("throwing");
  body.style.animation = "none";

  const finalAngles = [
    { x: 720, y: 900, z: 420 },
    { x: 720, y: 900, z: 420 },
    { x: 720, y: 900, z: 420 },
    { x: 720, y: 900, z: 420 }
  ];

  const angle = finalAngles[index];

  /*
   * 점 3개 면이 앞을 향하는 기본 각도에서
   * 갈색 면은 Y축으로 180도를 더 회전한다.
   */
  const finalY = angle.y + (flipped ? 180 : 0);

  body.style.transform =
    `rotateX(${angle.x}deg) ` +
    `rotateY(${finalY}deg) ` +
    `rotateZ(${angle.z}deg)`;

  void body.offsetWidth;
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

  // 던지기 시작 시 결과를 정한다.
  // true = 갈색 면, false = 점 3개 면
  const results = sticks.map(() => Math.random() < 0.5);

  sticks.forEach((stick, index) => {
    const body = stick.querySelector(".yut-3d");

    stick.classList.remove("throwing");
    body.style.animation = "none";
    body.style.transform = "";

    void body.offsetWidth;

    const delay = index * 70;

    const timer = setTimeout(() => {
      stick.classList.add("throwing");

      /*
       * 각 윷이 던지는 동안 여러 번 회전한다.
       * 최종 면은 결과에 맞춰 마지막 회전에서 향하도록 한다.
       */
      const flipped = results[index];

      const endY = flipped ? 1080 : 900;
      const direction = index % 2 === 0 ? 1 : -1;
      const endZ = 420 * direction;

      body.style.animation = "none";
      void body.offsetWidth;

      body.style.animation =
        `yut-spin 1.5s cubic-bezier(0.2, 0.7, 0.25, 1) both`;

      body.style.setProperty("--end-y", `${endY}deg`);
      body.style.setProperty("--end-z", `${endZ}deg`);
    }, delay);

    animationTimers.push(timer);
  });

  const finishTimer = setTimeout(() => {
    let flippedCount = 0;

    sticks.forEach((stick, index) => {
      const flipped = results[index];

      if (flipped) flippedCount++;

      /*
       * 애니메이션이 끝난 뒤 최종 각도를 그대로 유지한다.
       * 마지막 순간에 색깔이나 면을 교체하지 않는다.
       */
      setFinalRotation(stick, flipped, index);
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
