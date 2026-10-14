
const sticks = [...document.querySelectorAll(".stick")];

const button = document.getElementById("throwButton");
const emoji = document.getElementById("emoji");
const name = document.getElementById("name");
const message = document.getElementById("message");
const extra = document.getElementById("extra");

const outcomes = [
  { name: "도", emoji: "🍀", steps: 1, extra: false },
  { name: "개", emoji: "🌟", steps: 2, extra: false },
  { name: "걸", emoji: "✨", steps: 3, extra: false },
  { name: "윷", emoji: "🎊", steps: 4, extra: true },
  { name: "모", emoji: "🎉", steps: 5, extra: true }
];

let busy = false;
let timers = [];

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

  timers.forEach((timer) => clearTimeout(timer));
  timers = [];

  // 윷 4개의 최종 면을 무작위로 결정
  const results = sticks.map(() => Math.random() < 0.5);
  const count = results.filter(Boolean).length;
  const result = outcomes[count];

  sticks.forEach((stick, i) => {
    stick.classList.remove("tossing", "flipped");

    // 이전 애니메이션을 초기화
    void stick.offsetWidth;

    // 윷이 차례대로 날아오르도록 시작 시간을 조금씩 다르게 설정
    const startTimer = setTimeout(() => {
      stick.classList.add("tossing");

      // 회전 중간에 윷의 최종 면을 표시
      const flipTimer = setTimeout(() => {
        stick.classList.toggle("flipped", results[i]);
      }, 325);

      timers.push(flipTimer);
    }, i * 30);

    timers.push(startTimer);
  });

  // 마지막 윷의 애니메이션까지 끝난 후 결과 표시
  const finishTimer = setTimeout(() => {
    sticks.forEach((stick) => {
      stick.classList.remove("tossing");
    });

    emoji.textContent = result.emoji;
    name.textContent = `${result.name} (${result.steps}칸 이동)`;
    message.textContent = `${result.steps}칸 이동하세요!`;

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
