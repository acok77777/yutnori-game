```javascript
const sticks = [...document.querySelectorAll(".yut-stick")];

const throwButton = document.getElementById("throwButton");
const resultEmoji = document.getElementById("resultEmoji");
const resultName = document.getElementById("resultName");
const resultMessage = document.getElementById("resultMessage");
const extraNote = document.getElementById("extraNote");
const floorShadow = document.getElementById("floorShadow");

const outcomes = [
  { name: "모", emoji: "🎉", steps: 5, extra: true },
  { name: "도", emoji: "🍀", steps: 1, extra: false },
  { name: "개", emoji: "🌟", steps: 2, extra: false },
  { name: "걸", emoji: "✨", steps: 3, extra: false },
  { name: "윷", emoji: "🎊", steps: 4, extra: true }
];

let isThrowing = false;
let timers = [];

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
}

function tossYuts() {
  if (isThrowing || sticks.length !== 4) return;

  isThrowing = true;
  throwButton.disabled = true;
  throwButton.textContent = "🪵 윷 던지는 중...";

  resultEmoji.textContent = "🎲";
  resultName.textContent = "던지는 중...";
  resultMessage.textContent = "윷이 공중에서 회전하고 있어요!";
  extraNote.textContent = "";

  clearTimers();

  const results = sticks.map(() => Math.random() < 0.5);
  const flippedCount = results.filter(Boolean).length;
  const outcome = outcomes[flippedCount];

  sticks.forEach((stick, index) => {
    const body = stick.querySelector(".yut-3d");
    if (!body) return;

    stick.classList.remove("throwing");
    stick.style.animation = "none";
    body.style.animation = "none";
    body.style.animationPlayState = "running";
    stick.style.animationPlayState = "running";

    body.style.transform = "rotateX(0deg) rotateY(0deg) rotateZ(0deg)";

    void body.offsetWidth;

    const flipped = results[index];

    // 최종 회전각을 CSS 애니메이션의 마지막 프레임에 전달
    body.style.setProperty("--end-x", "720deg");
    body.style.setProperty("--end-y", flipped ? "900deg" : "720deg");
    body.style.setProperty("--end-z", flipped ? "420deg" : "360deg");

    const startTimer = setTimeout(() => {
      stick.classList.add("throwing");
      body.style.animation =
        "yut-spin 1.8s cubic-bezier(0.22, 0.65, 0.25, 1) both";
    }, index * 70);

    timers.push(startTimer);
  });

  if (floorShadow) {
    floorShadow.style.transform = "translateX(-50%) scale(0.65)";
    floorShadow.style.opacity = "0.35";

    const shadowTimer = setTimeout(() => {
      floorShadow.style.transform = "translateX(-50%) scale(1.1)";
      floorShadow.style.opacity = "0.9";
    }, 450);

    timers.push(shadowTimer);
  }

  const finishTimer = setTimeout(() => {
    sticks.forEach((stick) => {
      const body = stick.querySelector(".yut-3d");
      if (!body) return;

      // 애니메이션의 마지막 프레임을 계산해 회전 상태로 고정
      const style = getComputedStyle(body);
      const matrix = style.transform;

      body.style.animation = "none";
      body.style.transform = matrix === "none"
        ? "rotateX(0deg) rotateY(0deg) rotateZ(0deg)"
        : matrix;

      stick.classList.remove("throwing");
      stick.style.animation = "none";
    });

    resultEmoji.textContent = outcome.emoji;
    resultName.textContent = `${outcome.name} (${outcome.steps}칸 이동)`;
    resultMessage.textContent = `${outcome.steps}칸 이동`;
    extraNote.textContent = outcome.extra
      ? "🎉 한 번 더 던지세요!"
      : "";

    if (floorShadow) {
      floorShadow.style.transform = "translateX(-50%) scale(1)";
      floorShadow.style.opacity = "0.8";
    }

    throwButton.disabled = false;
    throwButton.textContent = "🎲 윷 던지기";
    isThrowing = false;
  }, 2050);

  timers.push(finishTimer);
}

if (throwButton) {
  throwButton.addEventListener("click", tossYuts);
}
```
