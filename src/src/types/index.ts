export interface Character {
  id: number;
  name: string;
  specialization: string;
  description: string;
  avatar: string;
  preferredTrack: number;
  assignedTrack: number | null;
}

export interface Track {
  id: number;
  name: string;
  description: string;
  assignedCharacter: number | null;
  currentTier: number;
  progress: number;
  maxTiers: number;
  tiers: number[];
  tierLabels: string[];
  minigameType: 'gold-spender' | 'mob-farmer' | 'boss-battler' | 'fisher' | 'axie-finder';
}

export interface GuildState {
  characters: Character[];
  tracks: Track[];
  overallCompletion: number;
}

export interface MinigameProps {
  track: Track;
  onProgress: (amount: number) => void;
  onComplete: () => void;
  onClose: () => void;
}

export type GameResult = {
  success: boolean;
  amount: number;
  message: string;
};