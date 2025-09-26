import { GuildState, Track } from '../types';

export const calculateOverallCompletion = (tracks: Track[]): number => {
  if (tracks.length === 0) return 0;
  
  const totalPossibleProgress = tracks.length * 100;
  const currentProgress = tracks.reduce((sum, track) => {
    const tierProgress = (track.currentTier / track.maxTiers) * 100;
    return sum + tierProgress;
  }, 0);
  
  return Math.round((currentProgress / totalPossibleProgress) * 100);
};

export const canCharacterJoinTrack = (
  characterId: number,
  trackId: number,
  guild: GuildState
): boolean => {
  const track = guild.tracks.find(t => t.id === trackId);
  const character = guild.characters.find(c => c.id === characterId);
  
  if (!track || !character) return false;
  
  // Check if track is already occupied
  if (track.assignedCharacter !== null && track.assignedCharacter !== characterId) {
    return false;
  }
  
  // Check if character is already assigned to another track
  if (character.assignedTrack !== null && character.assignedTrack !== trackId) {
    return false;
  }
  
  return true;
};

export const getTrackProgress = (track: Track): number => {
  if (track.currentTier >= track.maxTiers) return 100;
  
  const currentTierProgress = track.progress / track.tiers[track.currentTier];
  const baseProgress = (track.currentTier / track.maxTiers) * 100;
  const tierProgressContribution = (currentTierProgress / track.maxTiers) * 100;
  
  return Math.min(100, baseProgress + tierProgressContribution);
};

export const shouldCelebrate = (oldProgress: number, newProgress: number): boolean => {
  // Celebrate when crossing 25%, 50%, 75%, or 100% thresholds
  const thresholds = [25, 50, 75, 100];
  return thresholds.some(threshold => 
    oldProgress < threshold && newProgress >= threshold
  );
};

export const getCharacterAvatar = (characterName: string): string => {
  const avatarMap: { [key: string]: string } = {
    'Axie Guardian': '🛡️',
    'Treasure Hunter': '💰',
    'Battle Veteran': '⚔️',
    'Nature Walker': '🌿'
  };
  return avatarMap[characterName] || '👤';
};

export const getTrackIcon = (trackName: string): string => {
  const iconMap: { [key: string]: string } = {
    'Gold Spender': '💰',
    'Mob Farmer': '⚔️',
    'Boss Battler': '🐲',
    'Fisher': '🎣',
    'Axie Finder': '🔍'
  };
  return iconMap[trackName] || '📋';
};