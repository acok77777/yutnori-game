
const sticks = [...document.querySelectorAll(".stick")];

const button = document.getElementById("throwButton");
const emoji = document.getElementById("emoji");
const name = document.getElementById("name");
const message = document.getElementById("message");
const extra = document.getElementById("extra");
const arenaCaption = document.getElementById("arenaCaption");

const STAR_INDEX = 1; // 두 번째 윷이 별 표시 윷

let busy = false;
let timers = [];

function clearTimers() {
  timers.forEach(timer => clearTimeout(timer));
  timers = [];
}

function getOutcome(results) {
  // true = 뒷면, false = 앞면
  const backCount = results.filter(Boolean).length;

  // 별 표시 윷만 뒷면인 경우 백도
  if (
    backCount === 1 &&
    results[STAR_INDEX] === true
  ) {
    return {
      name: "백도",
      emoji: "⭐",
      steps: -1,
      extra: false
    };
  }

  // 뒷면 개수에 따른 결과
  const outcomes = {
    0: {
      name: "모",
      emoji: "🎉",
      steps: 5,
      extra: true
    },
    1: {
      name: "도",
      emoji: "🍀",
      steps: 1,
      extra: false
    },
    2: {
      name: "개",
      emoji: "🌟",
      steps: 2,
      extra: false
    },
    3: {
      name: "걸",
      emoji: "✨",
      steps: 3,
      extra: false
    },
    4: {
      name: "윷",
      emoji: "🎊",
      steps: 4,
      extra: true
    }
  };

  return outcomes[backCount];
}

function updateStickFace(stick, isBack, isStar) {
  const dots = stick.querySelector(".dots");

  stick.classList.toggle("flipped", isBack);

  if (isBack && isStar) {
    dots.textContent = "★";
    stick.setAttribute(
      "aria-label",
      "별 표시 윷: 뒷면"
    );
  } else if (isBack) {
    dots.textContent = "● ●";
    stick.setAttribute(
      "aria-label",
      "일반 윷: 뒷면"
    );
  } else {
    dots.textContent = "● ●";
    stick.setAttribute(
      "aria-label",
      isStar
        ? "별 표시 윷: 앞면"
        : "일반 윷: 앞면"
    );
  }
}

function tossYuts() {
  if (busy) return;

  if (sticks.length !== 4) {
    name.textContent = "윷 화면을 확인해 주세요.";
    return;
  }

  busy = true;
  button.disabled = true;
  button.textContent = "🪵 윷 던지는 중...";

  emoji.textContent = "🎲";
  name.textContent = "던지는 중...";
  message.textContent = "윷이 빙글빙글 돌아요!";
  extra.textContent = "";
  arenaCaption.textContent = "윷이 날아갑니다!";

  clearTimers();

  // 네 개의 윷 결과를 각각 무작위로 결정
  const results = sticks.map(() => Math.random() < 0.5);

  // 애니메이션을 시작하기 전에 이전 상태 초기화
  sticks.forEach((stick, i) => {
    stick.classList.remove("tossing", "flipped");

    const dots = stick.querySelector(".dots");
    dots.textContent = "● ●";

    stick.setAttribute(
      "aria-label",
      i === STAR_INDEX ? "별 표시 윷" : `${i + 1}번째 윷`
    );

    void stick.offsetWidth;
  });

  // 각 윷을 순서대로 던지는 애니메이션
  sticks.forEach((stick, i) => {
    const startTimer = setTimeout(() => {
      stick.classList.add("tossing");

      const flipTimer = setTimeout(() => {
        updateStickFace(
          stick,
          results[i],
          i === STAR_INDEX
        );
      }, 325);

      timers.push(flipTimer);
    }, i * 30);

    timers.push(startTimer);
  });

  const result = getOutcome(results);

  // 모든 윷의 애니메이션이 끝나면 결과 표시
  const finishTimer = setTimeout(() => {
    sticks.forEach(stick => {
      stick.classList.remove("tossing");
    });

    emoji.textContent = result.emoji;
    name.textContent = result.name;

    if (result.steps === -1) {
      message.textContent = "뒤로 1칸 이동하세요!";
      arenaCaption.textContent = "백도! 한 칸 뒤로 이동합니다.";
    } else {
      message.textContent = `앞으로 ${result.steps}칸 이동하세요!`;
      arenaCaption.textContent =
        `${result.name}! ${result.steps}칸 이동합니다.`;
    }

    extra.textContent = result.extra
      ? "🎉 한 번 더 던지세요!"
      : "";

    button.disabled = false;
    button.textContent = "🎲 윷 던지기";
    busy = false;
  }, 850);

  timers.push(finishTimer);
}

button.addEventListener("click", tossYuts);
