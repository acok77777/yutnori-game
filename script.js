
const sticks = Array.from(document.querySelectorAll(".yut-stick"));
const throwButton = document.getElementById("throwButton");

const resultEmoji = document.getElementById("resultEmoji");
const resultName = document.getElementById("resultName");
const resultMessage = document.getElementById("resultMessage");
const extraNote = document.getElementById("extraNote");
const floorShadow = document.getElementById("floorShadow");

const outcomes = {
  0: { name: "모", emoji: "🎉", steps: 5, extra: true },
  1: { name: "도", emoji: "🍀", steps: 1, extra: false },
  2: { name: "개", emoji: "🌟", steps: 2, extra: false },
  3: { name: "걸", emoji: "✨", steps: 3, extra: false },
  4: { name: "윷", emoji: "🎊", steps: 4, extra: true }
};

let isThrowing = false;
let timers = [];

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function setFinalFace(stick, flipped, index) {
  const body = stick.querySelector(".yut-3d");

  stick.classList.remove("throwing");
  body.style.animation = "none";

  // 던지기 애니메이션이 끝난 뒤 최종 면을 고정
  body.style.transform =
    `rotateX(0deg) rotateY(${flipped ? 180 : 0}deg) rotateZ(0deg)`;

  body.style.removeProperty("--end-y");
  body.style.removeProperty("--end-z");
}

function tossYuts() {
  if (isThrowing) return;
  if (sticks.length !== 4) {
    resultName.textContent = "윷 화면을 확인해 주세요";
    return;
  }

  isThrowing = true;
  throwButton.disabled = true;
  throwButton.textContent = "🪵 윷 던지는 중...";

  resultEmoji.textContent = "🎲";
  resultName.textContent = "던지는 중...";
  resultMessage.textContent = "윷이 공중에서 회전하고 있어요!";
  extraNote.textContent = "";

  clearTimers();

  // 각 윷의 결과를 던지기 전에 결정
  const results = sticks.map(() => Math.random() < 0.5);

  sticks.forEach((stick, index) => {
    const body = stick.querySelector(".yut-3d");

    stick.classList.remove("throwing");
    body.style.animation = "none";
    body.style.transform = "rotateX(0deg) rotateY(0deg) rotateZ(0deg)";

    void body.offsetWidth;

    const timer = setTimeout(() => {
      stick.classList.add("throwing");
      body.style.animation =
        "yut-spin 1.5s cubic-bezier(0.2, 0.7, 0.25, 1) both";
    }, index * 70);

    timers.push(timer);
  });

  const finishTimer = setTimeout(() => {
    let flippedCount = 0;

    sticks.forEach((stick, index) => {
      if (results[index]) flippedCount++;
      setFinalFace(stick, results[index], index);
    });

    const outcome = outcomes[flippedCount];

    resultEmoji.textContent = outcome.emoji;
    resultName.textContent =
      `${outcome.name} (${outcome.steps}칸 이동)`;
    resultMessage.textContent = `${outcome.steps}칸 이동`;

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

  timers.push(finishTimer);
}

if (throwButton) {
  throwButton.addEventListener("click", tossYuts);
}
