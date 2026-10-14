```css
@keyframes yut-spin {
  0% {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }

  15% {
    transform: rotateX(100deg) rotateY(110deg) rotateZ(40deg);
  }

  30% {
    transform: rotateX(220deg) rotateY(260deg) rotateZ(100deg);
  }

  45% {
    transform: rotateX(350deg) rotateY(430deg) rotateZ(180deg);
  }

  60% {
    transform: rotateX(470deg) rotateY(570deg) rotateZ(260deg);
  }

  75% {
    transform: rotateX(570deg) rotateY(690deg) rotateZ(320deg);
  }

  88% {
    transform: rotateX(660deg) rotateY(var(--end-y, 780deg)) rotateZ(390deg);
  }

  100% {
    transform:
      rotateX(var(--end-x, 720deg))
      rotateY(var(--end-y, 720deg))
      rotateZ(var(--end-z, 360deg));
  }
}
```
