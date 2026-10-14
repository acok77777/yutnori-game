
const sticks = Array.from(document.querySelectorAll(".yut-stick"));
const throwButton = document.getElementById("throwButton");

const resultEmoji = document.getElementById("resultEmoji");
const resultName = document.getElementById("resultName");
const resultMessage = document.getElementById("resultMessage");
const extraNote = document.getElementById("extraNote");

const outcomes = {
  0: {
    name: "모",
    emoji: "🎉",
    steps: 5,
    extra: true,
    message: "5칸 이동 · 한 번 더 던지기!"
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
    message: "4칸 이동 · 한 번 더 던지기!"
  }
};

let isThrowing = false;
let animationTimers = [];

function clearAnimationTimers() {
  animationTimers.forEach(clearTimeout);
  animationTimers = [];
}

function setStickFace(stick, flipped) {
  stick.classList.remove("face-dots", "face-brown", "throwing");
  stick.classList.add(flipped ? "face-brown" : "face-dots");

  stick.style.removeProperty("translate");
  stick.style.removeProperty("rotate");
  stick.style.removeProperty("scale");
}

function tossYuts() {
  if (isThrowing) return;

  isThrowing = true;
  throwButton.disabled = true;
  throwButton.textContent = "🪵 윷 던지는 중...";

  extraNote.textContent = "";
  resultEmoji.textContent = "🎲";
  resultName.textContent = "던지는 중...";
  resultMessage.textContent = "윷이 바닥에 떨어지고 있어요!";

  clearAnimationTimers();

  // true = 갈색으로 뒤집힘, false = 점 3개 면
  const results = sticks.map(() => Math.random() < 0.5);

  sticks.forEach((stick, index) => {
    stick.classList.remove("throwing");
    setStickFace(stick, false);

    // 애니메이션 시작 전 초기 상태 적용
    void stick.offsetWidth;

    const timer = setTimeout(() => {
      stick.classList.add("throwing");
    }, index * 65);

    animationTimers.push(timer);
  });

  const finishTimer = setTimeout(() => {
    let flippedCount = 0;

    sticks.forEach((stick, index) => {
      stick.classList.remove("throwing");
      setStickFace(stick, results[index]);

      if (results[index]) {
        flippedCount++;
      }
    });

    const outcome = outcomes[flippedCount];

    resultEmoji.textContent = outcome.emoji;
    resultName.textContent =
      `${outcome.name} (${flippedCount}개 뒤집힘)`;
    resultMessage.textContent = outcome.message;

    extraNote.textContent = outcome.extra
      ? "🎉 한 번 더 던질 수 있어요!"
      : "";

    throwButton.disabled = false;
    throwButton.textContent = "🎲 윷 던지기";
    isThrowing = false;
  }, 1500);

  animationTimers.push(finishTimer);
}

throwButton.addEventListener("click", tossYuts);
