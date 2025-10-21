const STORAGE_KEY = "wordle_clone_stats";

export function loadStats() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return {
      played: 0,
      wins: 0,
      currentStreak: 0,
      maxStreak: 0,
      distribution: {},
    };
  }
  return JSON.parse(data);
}

export function saveStats(stats) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function recordGame(isWin, guessCount) {
  const stats = loadStats();
  stats.played += 1;

  if (isWin) {
    stats.wins += 1;
    stats.currentStreak += 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    stats.distribution[guessCount] = (stats.distribution[guessCount] || 0) + 1;
  } else {
    stats.currentStreak = 0;
  }

  saveStats(stats);
}

export function resetStats() {
  localStorage.removeItem(STORAGE_KEY);
}
