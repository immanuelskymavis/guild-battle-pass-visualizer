import { GuildState } from '../types';

const STORAGE_KEY = 'guild-battle-pass-state';

export const saveGuildState = (state: GuildState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Failed to save guild state:', error);
  }
};

export const loadGuildState = (): GuildState | null => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Failed to load guild state:', error);
    return null;
  }
};

export const clearGuildState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear guild state:', error);
  }
};

export const resetProgress = (): void => {
  clearGuildState();
  window.location.reload();
};