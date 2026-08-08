export const playChime = () => {
  try {
    // Placeholder URL for a gentle notification chime
    // In production, replace with a local asset e.g., '/assets/chime.mp3'
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.error("Audio playback blocked by browser:", e));
  } catch (error) {
    console.error("Failed to play audio:", error);
  }
};
