(() => {
  'use strict';

  const outcomes = [
    {
      name: '도',
      emoji: '🐾',
      message: '한 칸 앞으로! 천천히 출발해요.',
      score: 1
    },
    {
      name: '개',
      emoji: '🐶',
      message: '두 칸 앞으로! 좋아요, 좋아!',
      score: 2
    },
    {
      name: '걸',
      emoji: '🐎',
      message: '세 칸 앞으로! 기세가 좋아요!',
      score: 3
    },
    {
      name: '윷',
      emoji: '🎉',
      message: '네 칸 앞으로! 한 번 더 던져요!',
      score: 4,
      extra: true
    },
    {
      name: '모',
      emoji: '🌟',
      message: '다섯 칸 앞으로! 대박! 한 번 더!',
      score: 5,
      extra: true
    }
  ];

  const arena = document.getElementById('arena');
  const sticks = [...document.querySelectorAll('.yut-stick')];
  const throwButton = document.getElementById('throwButton');
  const throwButtonText = document.getElementById('throwButtonText');
  const throwHint = document.getElementById('throwHint');
  const resultEmoji = document.getElementById('resultEmoji');
  const resultName = document.getElementById('resultName');
  const resultMessage = document.getElementById('resultMessage');
  const resultPanel = document.querySelector('.result-panel');
  const turnCount = document.getElementById('turnCount');
  const historyList = document.getElementById('historyList');
  const resetButton = document.getElementById('resetButton');
  const soundToggle = document.getElementById('soundToggle');
  const extraTurnNote = document.getElementById('extraTurnNote');
  const toast = document.getElementById('toast');

  let totalThrows = 0;
  let history = [];
  let soundOn = true;
  let isRolling = false;
  let audioContext = null;
  let toastTimer = null;

  // 도·개·걸·윷·모 중 하나를 같은 확률로 선택합니다.
  // 같은 결과가 연속으로 나오는 것도 가능합니다.
  function chooseOutcome() {
    const index = Math.floor(Math.random() * outcomes.length);
    return outcomes[index];
  }

  // 효과음을 재생합니다. 별도의 MP3 파일은 필요하지 않습니다.
  function playTone(
    frequency,
    duration,
    type = 'sine',
    volume = 0.045
  ) {
    if (!soundOn) return;

    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) return;

      if (!audioContext) {
        audioContext = new AudioContextClass();
      }

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
      );

      gain.gain.setValueAtTime(volume, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + duration
      );

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      // 효과음이 지원되지 않아도 게임은 작동합니다.
    }
  }

  function playThrowSound() {
    playTone(230, 0.08, 'triangle', 0.035);

    window.setTimeout(() => {
      playTone(180, 0.09, 'triangle', 0.03);
    }, 100);

    window.setTimeout(() => {
      playTone(145, 0.11, 'triangle', 0.025);
    }, 210);
  }

  function playResultSound(outcome) {
    const notes = outcome.extra
      ? [523, 659, 784, 1046]
      : [440, 554, 659];

    notes.forEach((note, index) => {
      window.setTimeout(() => {
        playTone(note, 0.14, 'sine', 0.035);
      }, index * 75);
    });
  }

  // 던진 뒤 윷의 앞뒤 모양을 바꿔 줍니다.
  function setStickFaces() {
    sticks.forEach((stick) => {
      const face = Math.random() < 0.5
        ? 'face-flat'
        : 'face-round';

      stick.classList.remove('face-flat', 'face-round');
      stick.classList.add(face);

      const angle = Math.floor(Math.random() * 45) - 22;
      stick.style.transform = `rotate(${angle}deg)`;
    });
  }

  // 최근 20회의 결과를 화면에 표시합니다.
  function renderHistory() {
    historyList.replaceChildren();

    if (history.length === 0) {
      const empty = document.createElement('p');

      empty.className = 'empty-history';
      empty.textContent =
        '아직 기록이 없어요. 첫 윷을 던져 보세요! 🌱';

      historyList.appendChild(empty);
      return;
    }

    history.slice(0, 20).forEach((item) => {
      const chip = document.createElement('div');
      chip.className = 'history-chip';

      const index = document.createElement('span');
      index.className = 'chip-index';
      index.textContent = `${item.turn}회`;

      const emoji = document.createElement('span');
      emoji.textContent = item.emoji;

      const name = document.createElement('strong');
      name.textContent = item.name;

      chip.append(index, emoji, name);
      historyList.appendChild(chip);
    });
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  function showResult(outcome) {
    resultEmoji.textContent = outcome.emoji;
    resultName.textContent = `${outcome.name}!`;
    resultMessage.textContent = outcome.message;
    throwHint.textContent = `${outcome.name}가 나왔어요!`;
    turnCount.textContent = `${totalThrows}회 던짐`;

    // 같은 결과가 반복되어도 애니메이션을 다시 실행합니다.
    resultPanel.classList.remove('pop');
    void resultPanel.offsetWidth;
    resultPanel.classList.add('pop');

    history.unshift({
      turn: totalThrows,
      name: outcome.name,
      emoji: outcome.emoji
    });

    renderHistory();

    if (outcome.extra) {
      extraTurnNote.textContent =
        `🎊 ${outcome.name}! 추가로 한 번 더 던질 수 있어요!`;

      showToast(`${outcome.name}! 한 번 더 던져 보세요!`);
    } else {
      extraTurnNote.textContent =
        '윷 또는 모가 나오면 한 번 더 던질 수 있어요!';
    }

    playResultSound(outcome);
  }

  // 던지기 버튼을 누르면 애니메이션 후 결과가 나옵니다.
  function throwYut() {
    if (isRolling) return;

    isRolling = true;
    throwButton.disabled = true;
    throwButtonText.textContent = '윷 굴러가는 중...';
    throwHint.textContent = '데굴데굴~ 어떤 결과일까요?';

    arena.classList.add('is-rolling');
    playThrowSound();

    window.setTimeout(() => {
      const outcome = chooseOutcome();

      arena.classList.remove('is-rolling');
      setStickFaces();

      totalThrows += 1;
      showResult(outcome);

      isRolling = false;
      throwButton.disabled = false;

      throwButtonText.textContent = outcome.extra
        ? '한 번 더 던지기!'
        : '다시 윷 던지기!';
    }, 850);
  }

  // 게임을 처음 상태로 되돌립니다.
  function resetGame() {
    if (isRolling) return;

    totalThrows = 0;
    history = [];

    turnCount.textContent = '0회 던짐';
    resultEmoji.textContent = '🍀';
    resultName.textContent = '어떤 결과가 나올까요?';
    resultMessage.textContent =
      '아래 버튼을 눌러 윷을 던져 보세요!';

    throwHint.textContent = '윷을 던질 준비 완료!';
    throwButtonText.textContent = '윷 던지기!';

    extraTurnNote.textContent =
      '윷 또는 모가 나오면 한 번 더 던질 수 있어요!';

    sticks.forEach((stick, index) => {
      stick.classList.remove('face-flat', 'face-round');

      stick.classList.add(
        index % 2 === 0 ? 'face-flat' : 'face-round'
      );

      stick.style.transform = '';
    });

    renderHistory();
    showToast('새로운 윷놀이를 시작해요! 🍀');
  }

  // 버튼 이벤트 연결
  throwButton.addEventListener('click', throwYut);
  resetButton.addEventListener('click', resetGame);

  soundToggle.addEventListener('click', () => {
    soundOn = !soundOn;

    soundToggle.textContent = soundOn ? '🔊' : '🔇';

    soundToggle.setAttribute(
      'aria-pressed',
      String(soundOn)
    );

    soundToggle.setAttribute(
      'aria-label',
      soundOn ? '효과음 끄기' : '효과음 켜기'
    );

    showToast(
      soundOn ? '효과음을 켰어요!' : '효과음을 껐어요.'
    );

    if (soundOn) {
      playTone(660, 0.1);
    }
  });

  // 최초 화면 초기화
  renderHistory();
})();
