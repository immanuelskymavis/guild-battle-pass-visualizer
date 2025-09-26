import { Character, Track, GuildState } from '../types';

const initialCharacters: Character[] = [
  {
    id: 1,
    name: 'Axie Guardian',
    specialization: 'Defense & Protection',
    description: 'A stalwart defender who specializes in tanking damage and protecting allies during boss battles.',
    avatar: '🛡️',
    preferredTrack: 3, // Boss Battler
    assignedTrack: null,
  },
  {
    id: 2,
    name: 'Treasure Hunter',
    specialization: 'Resource Management',
    description: 'An expert in finding and managing valuable resources, with a keen eye for profitable investments.',
    avatar: '💰',
    preferredTrack: 1, // Gold Spender
    assignedTrack: null,
  },
  {
    id: 3,
    name: 'Battle Veteran',
    specialization: 'Combat Expertise',
    description: 'A seasoned warrior with extensive combat experience, perfect for farming mobs efficiently.',
    avatar: '⚔️',
    preferredTrack: 2, // Mob Farmer
    assignedTrack: null,
  },
  {
    id: 4,
    name: 'Nature Walker',
    specialization: 'Exploration & Discovery',
    description: 'A patient explorer who excels at finding hidden creatures and fishing in remote locations.',
    avatar: '🌿',
    preferredTrack: 4, // Fisher
    assignedTrack: null,
  },
];

const initialTracks: Track[] = [
  {
    id: 1,
    name: 'Gold Spender',
    description: 'Accumulate wealth by purchasing items and making strategic investments.',
    assignedCharacter: null,
    currentTier: 0,
    progress: 0,
    maxTiers: 4,
    tiers: [100, 500, 2000, 10000],
    tierLabels: ['Penny Pincher', 'Smart Shopper', 'Big Spender', 'Luxury Collector'],
    minigameType: 'gold-spender',
  },
  {
    id: 2,
    name: 'Mob Farmer',
    description: 'Defeat enemies to gain experience and valuable drops from combat.',
    assignedCharacter: null,
    currentTier: 0,
    progress: 0,
    maxTiers: 4,
    tiers: [10, 50, 200, 1000],
    tierLabels: ['Novice Fighter', 'Seasoned Warrior', 'Mob Slayer', 'Legendary Hunter'],
    minigameType: 'mob-farmer',
  },
  {
    id: 3,
    name: 'Boss Battler',
    description: 'Face challenging boss encounters and prove your combat prowess.',
    assignedCharacter: null,
    currentTier: 0,
    progress: 0,
    maxTiers: 4,
    tiers: [1, 3, 7, 15],
    tierLabels: ['Boss Challenger', 'Swift Striker', 'Speed Demon', 'Lightning Warrior'],
    minigameType: 'boss-battler',
  },
  {
    id: 4,
    name: 'Fisher',
    description: 'Master the peaceful art of fishing and bring home the biggest catches.',
    assignedCharacter: null,
    currentTier: 0,
    progress: 0,
    maxTiers: 4,
    tiers: [10, 30, 50, 100],
    tierLabels: ['Pond Angler', 'Lake Fisher', 'River Master', 'Ocean Lord'],
    minigameType: 'fisher',
  },
  {
    id: 5,
    name: 'Axie Finder',
    description: 'Explore hidden corners of the world to discover rare and elusive Axies.',
    assignedCharacter: null,
    currentTier: 0,
    progress: 0,
    maxTiers: 4,
    tiers: [1, 5, 10, 30],
    tierLabels: ['Axie Seeker', 'Creature Hunter', 'Beast Master', 'Legendary Collector'],
    minigameType: 'axie-finder',
  },
];

export const getInitialGuildState = (): GuildState => ({
  characters: initialCharacters,
  tracks: initialTracks,
  overallCompletion: 0,
});