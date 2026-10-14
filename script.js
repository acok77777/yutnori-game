
const sticks = [...document.querySelectorAll(".stick")];

const button = document.getElementById("throwButton");
const emoji = document.getElementById("emoji");
const name = document.getElementById("name");
const message = document.getElementById("message");
const extra = document.getElementById("extra");

const outcomes = [
  { name: "모", emoji: "🎉", steps: 5, extra: true },
  { name: "도", emoji: "🍀", steps: 1, extra: false },
  { name: "개", emoji: "🌟", steps: 2, extra: false },
  { name: "걸", emoji: "✨", steps: 3, extra: false },
  { name: "윷", emoji: "🎊", steps: 4, extra: true }
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
  message.textContent = "윷이 섞이며 빙글빙글 돌아요!";
  extra.textContent = "";

  timers.forEach(clearTimeout);
  timers = [];

  const results = sticks.map(() => Math.random() < 0.5);
  const count = results.filter(Boolean).length;
  const result = outcomes[count];

  sticks.forEach((stick, i) => {
    stick.classList.remove("tossing", "flipped");
    void stick.offsetWidth;

    const timer = setTimeout(() => {
      stick.classList.add("tossing");

      if (results[i]) {
        stick.classList.add("flipped");
      }
    }, i * 100);

    timers.push(timer);
  });

  const finish = setTimeout(() => {
    sticks.forEach((stick) => {
      stick.classList.remove("tossing");
    });

    emoji.textContent = result.emoji;
    name.textContent = `${result.name} (${result.steps}칸 이동)`;
    message.textContent = `${result.steps}칸 이동`;
    extra.textContent = result.extra
      ? "🎉 한 번 더 던지세요!"
      : "";

    button.disabled = false;
    button.textContent = "🎲 윷 던지기";
    busy = false;
  }, 1900);

  timers.push(finish);
}

button.addEventListener("click", tossYuts);
