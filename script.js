
(() => {
  'use strict';

  const outcomes = {
    0: {
      name: '모',
      emoji: '🌟',
      message: '모 5칸 한번 더 !',
      extra: true
    },
    1: {
      name: '도',
      emoji: '🐾',
      message: '도 1칸',
      extra: false
    },
    2: {
      name: '개',
      emoji: '🐶',
      message: '개 2칸',
      extra: false
    },
    3: {
      name: '걸',
      emoji: '🐎',
      message: '걸 3칸',
      extra: false
    },
    4: {
      name: '윷',
      emoji: '🎉',
      message: '윷 4칸 한번 더 !',
      extra: true
    }
  };

  const arena = document.getElementById('arena');
  const sticks = [...document.querySelectorAll('.yut-stick')];
  const throwButton = document.getElementById('throwButton');
  const soundToggle = document.getElementById('soundToggle');
  const resetButton = document.getElementById('resetButton');

  const turnCount = document.getElementById('turnCount');
  const throwHint = document.getElementById('throwHint');
  const resultPanel = document.getElementById('resultPanel');
  const resultEmoji = document.getElementById('resultEmoji');
  const resultName = document.getElementById('resultName');
  const resultMessage = document.getElementById('resultMessage');
  const extraTurnNote = document.getElementById('extraTurnNote');
  const historyList = document.getElementById('historyList');
  const toast = document.getElementById('toast');

  let totalThrows = 0;
  let history = [];
  let isRolling = false;
  let soundOn = true;
  let audioContext = null;
  let toastTimer = null;

  // 효과음: 외부 오디오 파일이 필요하지 않습니다.
  function playTone(frequency, duration, volume = 0.035) {
    if (!soundOn) return;

    try {
      const AudioClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioClass) return;

      if (!audioContext) {
        audioContext = new AudioClass();
      }

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;
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
      // 효과음 지원 여부와 관계없이 게임을 계속 실행합니다.
    }
  }

  function playResultSound(outcome) {
    const notes = outcome.extra
      ? [523, 659, 784, 1046]
      : [440, 554, 659];

    notes.forEach((frequency, index) => {
      window.setTimeout(() => {
        playTone(frequency, 0.13);
      }, index * 75);
    });
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  // 윷 네 개의 앞뒤 면을 각각 무작위로 결정합니다.
  // face-flat은 뒤집힌 밝은 면입니다.
  function tossSticks() {
    let flippedCount = 0;

    sticks.forEach((stick) => {
      const flipped = Math.random() < 0.5;

      stick.classList.remove('face-flat', 'face-round');
      stick.classList.add(flipped ? 'face-flat' : 'face-round');

      // 굴러간 뒤의 각도를 무작위로 표시합니다.
      const angle = Math.floor(Math.random() * 35) - 17;
      stick.style.transform = `rotate(${angle}deg)`;

      if (flipped) {
        flippedCount++;
      }
    });

    return flippedCount;
  }

  function renderHistory() {
    historyList.replaceChildren();

    if (history.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-history';
      empty.textContent = '아직 던진 기록이 없어요.';
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

  function displayResult(flippedCount) {
    const outcome = outcomes[flippedCount];

    totalThrows++;
    turnCount.textContent = `${totalThrows}회`;

    resultEmoji.textContent = outcome.emoji;
    resultName.textContent = `${outcome.name} (${flippedCount}개 뒤집힘)`;
    resultMessage.textContent = outcome.message;

    throwHint.textContent =
      `뒤집힌 윷 ${flippedCount}개 · ${outcome.name}!`;

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
        `🎉 ${outcome.message} 다시 던져 보세요!`;

      showToast(`${outcome.name}! 한 번 더 던져 보세요!`);
    } else {
      extraTurnNote.textContent =
        '윷 또는 모가 나오면 한 번 더!';
    }

    playResultSound(outcome);
  }

  function throwYut() {
    if (isRolling) return;

    isRolling = true;
    throwButton.disabled = true;
    arena.classList.add('is-rolling');

    throwHint.textContent = '데굴데굴~ 윷이 굴러가요!';
    playTone(220, 0.12, 0.025);

    window.setTimeout(() => {
      // 애니메이션이 끝난 뒤 실제 면과 결과를 결정합니다.
      arena.classList.remove('is-rolling');

      const flippedCount = tossSticks();
      displayResult(flippedCount);

      isRolling = false;
      throwButton.disabled = false;

      // 버튼 글자는 언제나 동일하게 유지합니다.
      throwButton.textContent = '🎲 윷던지기';
    }, 700);
  }

  function resetGame() {
    if (isRolling) return;

    totalThrows = 0;
    history = [];

    turnCount.textContent = '0회';
    resultEmoji.textContent = '🍀';
    resultName.textContent = '윷을 던져 보세요!';
    resultMessage.textContent = '도 · 개 · 걸 · 윷 · 모';
    throwHint.textContent = '던질 준비 완료!';
    extraTurnNote.textContent = '윷 또는 모가 나오면 한 번 더!';

    sticks.forEach((stick) => {
      stick.classList.remove('face-flat');
      stick.classList.add('face-round');
      stick.style.transform = '';
    });

    throwButton.textContent = '🎲 윷던지기';

    renderHistory();
    showToast('기록을 초기화했어요! 🍀');
  }

  throwButton.addEventListener('click', throwYut);
  resetButton.addEventListener('click', resetGame);

  soundToggle.addEventListener('click', () => {
    soundOn = !soundOn;

    soundToggle.textContent = soundOn ? '🔊' : '🔇';
    soundToggle.setAttribute('aria-pressed', String(soundOn));
    soundToggle.setAttribute(
      'aria-label',
      soundOn ? '효과음 끄기' : '효과음 켜기'
    );

    showToast(soundOn ? '효과음을 켰어요!' : '효과음을 껐어요.');

    if (soundOn) {
      playTone(660, 0.1);
    }
  });

  renderHistory();
})();
