import confetti from 'canvas-confetti';

/**
 * Triggers an immersive, full-screen confetti celebration across the entire viewport.
 * Features dual corner cannons, center burst, and a multi-angle cascade.
 */
export function triggerFullPageConfetti() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const vibrantColors = [
    '#FF2E93', '#FF8A00', '#FF0055', '#00FFF0', 
    '#FFE600', '#7928CA', '#00DFD8', '#FFFFFF'
  ];

  // 1. Left Corner Cannon
  confetti({
    particleCount: 90,
    angle: 60,
    spread: 75,
    origin: { x: 0, y: 0.8 },
    zIndex: 99999,
    colors: vibrantColors,
  });

  // 2. Right Corner Cannon
  confetti({
    particleCount: 90,
    angle: 120,
    spread: 75,
    origin: { x: 1, y: 0.8 },
    zIndex: 99999,
    colors: vibrantColors,
  });

  // 3. Center Sky Burst
  confetti({
    particleCount: 110,
    spread: 140,
    origin: { x: 0.5, y: 0.35 },
    zIndex: 99999,
    colors: vibrantColors,
  });

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // 4. Continuous full-page cascade
  const interval: NodeJS.Timeout = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = Math.floor(40 * (timeLeft / duration));

    // Random edge-to-edge bursts
    confetti({
      particleCount,
      startVelocity: 35,
      spread: 360,
      ticks: 70,
      origin: { x: randomInRange(0.1, 0.4), y: Math.random() * 0.5 },
      zIndex: 99999,
      colors: vibrantColors,
      disableForReducedMotion: true,
    });

    confetti({
      particleCount,
      startVelocity: 35,
      spread: 360,
      ticks: 70,
      origin: { x: randomInRange(0.6, 0.9), y: Math.random() * 0.5 },
      zIndex: 99999,
      colors: vibrantColors,
      disableForReducedMotion: true,
    });
  }, 220);
}
