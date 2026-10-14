
const sticks = Array.from(document.querySelectorAll(".yut-stick"));
const throwButton = document.getElementById("throwButton");
const resetButton = document.getElementById("resetButton");

const resultEmoji = document.getElementById("resultEmoji");
const resultName = document.getElementById("resultName");
const resultMessage = document.getElementById("resultMessage");
const extraNote = document.getElementById("extraNote");

const historyList = document.getElementById("historyList");
const throwCount = document.getElementById("throwCount");
const throwHint = document.getElementById("throwHint");

const outcomes = {
  0: {
    name: "모",
    emoji: "🎉",
    steps: 5,
    extra: true,
    message: "모! 다섯 칸 이동하고 한 번 더 던져요!"
  },
  1: {
    name: "도",
    emoji: "🍀",
    steps: 1,
    extra: false,
    message: "도! 한 칸 이동하세요."
  },
  2: {
    name: "개",
    emoji: "🌟",
    steps: 2,
    extra: false,
    message: "개! 두 칸 이동하세요."
  },
  3: {
    name: "걸",
    emoji: "✨",
    steps: 3,
    extra: false,
    message: "걸! 세 칸 이동하세요."
  },
  4: {
    name: "윷",
    emoji: "🎊",
    steps: 4,
    extra: true,
    message: "윷! 네 칸 이동하고 한 번 더 던져요!"
  }
};

let totalThrows = 0;
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

function showOutcome(flippedCount) {
  const outcome = outcomes[flippedCount];

  resultEmoji.textContent = outcome.emoji;
  resultName.textContent = `${outcome.name} (${flippedCount}개 뒤집힘)`;
  resultMessage.textContent = outcome.message;

  extraNote.textContent = outcome.extra
    ? "🎉 한 번 더 던질 수 있어요!"
    : "";

  throwHint.textContent = `${outcome.name}! ${outcome.steps}칸 이동`;

  addHistory(outcome, flippedCount);
}

function addHistory(outcome, flippedCount) {
  totalThrows += 1;
  throwCount.textContent = `총 ${totalThrows}회`;

  const emptyItem = historyList.querySelector(".empty-history");
  if (emptyItem) {
    emptyItem.remove();
  }

  const item = document.createElement("li");

  const left = document.createElement("span");
  left.className = "history-result";
  left.textContent = `${totalThrows}. ${outcome.emoji} ${outcome.name}`;

  const right = document.createElement("span");
  right.className = "history-detail";
  right.textContent = `${outcome.steps}칸 · 갈색 ${flippedCount}개`;

  item.append(left, right);
  historyList.prepend(item);
}

function tossYuts() {
  if (isThrowing) return;

  isThrowing = true;
  throwButton.disabled = true;
  throwButton.textContent = "🪵 윷이 떨어지는 중...";

  extraNote.textContent = "";
  throwHint.textContent = "빙글빙글! 윷이 떨어집니다!";
  resultEmoji.textContent = "🎲";
  resultName.textContent = "윷 던지는 중...";
  resultMessage.textContent = "윷이 바닥에 닿을 때까지 기다려 주세요.";

  clearAnimationTimers();

  // true는 갈색 면, false는 점 3개 면
  const results = sticks.map(() => Math.random() < 0.5);

  sticks.forEach((stick, index) => {
    stick.classList.remove("throwing");
    setStickFace(stick, false);

    // 브라우저가 초기 상태를 적용하도록 함
    void stick.offsetWidth;

    const timer = setTimeout(() => {
      stick.classList.add("throwing");
    }, index * 75);

    animationTimers.push(timer);
  });

  const finishTimer = setTimeout(() => {
    let flippedCount = 0;

    sticks.forEach((stick, index) => {
      stick.classList.remove("throwing");
      setStickFace(stick, results[index]);

      if (results[index]) {
        flippedCount += 1;
      }
    });

    showOutcome(flippedCount);

    isThrowing = false;
    throwButton.disabled = false;
    throwButton.textContent = "🎲 윷 던지기";
  }, 1550);

  animationTimers.push(finishTimer);
}

function resetGame() {
  if (isThrowing) return;

  totalThrows = 0;
  throwCount.textContent = "총 0회";
  historyList.innerHTML =
    '<li class="empty-history">아직 던진 기록이 없어요.</li>';

  resultEmoji.textContent = "🍀";
  resultName.textContent = "준비됐나요?";
  resultMessage.textContent = "아래 버튼을 눌러 윷을 던져 보세요.";
  extraNote.textContent = "";
  throwHint.textContent = "윷을 던져 보세요!";

  sticks.forEach((stick) => {
    setStickFace(stick, false);
  });

  throwButton.disabled = false;
  throwButton.textContent = "🎲 윷 던지기";
}

throwButton.addEventListener("click", tossYuts);
resetButton.addEventListener("click", resetGame);
