import React, { useState, useEffect } from 'react';
import { MinigameProps } from '../../types';
import ProgressBar from '../ProgressBar';

interface Fish {
  name: string;
  icon: string;
  weight: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const FisherGame: React.FC<MinigameProps> = ({ track, onProgress, onComplete, onClose }) => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [fishBiting, setFishBiting] = useState(false);
  const [biteWindow, setBiteWindow] = useState(false);
  const [currentCatch, setCurrentCatch] = useState<Fish | null>(null);
  const [recentCatches, setRecentCatches] = useState<Fish[]>([]);
  const [totalWeight, setTotalWeight] = useState(0);

  const currentTier = Math.min(track.currentTier, track.maxTiers - 1);
  const targetWeight = track.tiers[currentTier];

  const fishTypes: Fish[] = [
    // Common fish
    { name: 'Minnow', icon: '🐟', weight: 0.5, rarity: 'common' },
    { name: 'Carp', icon: '🐠', weight: 2, rarity: 'common' },
    { name: 'Bass', icon: '🐟', weight: 3, rarity: 'common' },
    // Rare fish
    { name: 'Salmon', icon: '🐠', weight: 5, rarity: 'rare' },
    { name: 'Trout', icon: '🐟', weight: 4, rarity: 'rare' },
    // Epic fish
    { name: 'Tuna', icon: '🐠', weight: 15, rarity: 'epic' },
    { name: 'Shark', icon: '🦈', weight: 25, rarity: 'epic' },
    // Legendary fish
    { name: 'Golden Fish', icon: '🟨', weight: 50, rarity: 'legendary' },
    { name: 'Whale', icon: '🐋', weight: 100, rarity: 'legendary' },
  ];

  const startFishing = () => {
    setIsWaiting(true);
    setCurrentCatch(null);
    
    // Wait 2-5 seconds before fish bites
    const waitTime = Math.random() * 3000 + 2000;
    setTimeout(() => {
      setIsWaiting(false);
      setFishBiting(true);
      
      // Give player 1-3 second window to catch
      const windowTime = Math.random() * 2000 + 1000;
      setTimeout(() => {
        setBiteWindow(true);
        
        // Close window after 1 second
        setTimeout(() => {
          setBiteWindow(false);
          setFishBiting(false);
        }, 1000);
      }, windowTime);
    }, waitTime);
  };

  const tryToCatch = () => {
    if (!biteWindow) {
      // Missed the window, fish escapes
      setFishBiting(false);
      return;
    }

    // Successful catch!
    const rarityRoll = Math.random();
    let selectedFish: Fish;
    
    if (rarityRoll < 0.5) {
      // 50% common
      selectedFish = fishTypes.filter(f => f.rarity === 'common')[Math.floor(Math.random() * 3)];
    } else if (rarityRoll < 0.8) {
      // 30% rare
      selectedFish = fishTypes.filter(f => f.rarity === 'rare')[Math.floor(Math.random() * 2)];
    } else if (rarityRoll < 0.95) {
      // 15% epic
      selectedFish = fishTypes.filter(f => f.rarity === 'epic')[Math.floor(Math.random() * 2)];
    } else {
      // 5% legendary
      selectedFish = fishTypes.filter(f => f.rarity === 'legendary')[Math.floor(Math.random() * 2)];
    }

    setCurrentCatch(selectedFish);
    setRecentCatches(prev => [selectedFish, ...prev].slice(0, 5));
    
    const newTotalWeight = totalWeight + selectedFish.weight;
    setTotalWeight(newTotalWeight);
    onProgress(selectedFish.weight);

    setFishBiting(false);
    setBiteWindow(false);

    // Check completion
    if (newTotalWeight >= targetWeight) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      // Auto-start next fishing after showing catch
      setTimeout(() => {
        setCurrentCatch(null);
        startFishing();
      }, 3000);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-white';
    }
  };

  useEffect(() => {
    if (!isWaiting && !fishBiting && !currentCatch) {
      startFishing();
    }
  }, []);

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-axie-primary mb-2">Peaceful Fishing Spot</h2>
          <p className="text-gray-300">Catch fish to reach your weight target!</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white text-2xl p-2"
        >
          ×
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-axie-secondary font-bold">Progress to {track.tierLabels[currentTier]}</span>
          <span className="text-white font-bold">{totalWeight.toFixed(1)} / {targetWeight} kg</span>
        </div>
        <ProgressBar
          current={totalWeight}
          max={targetWeight}
          showNumbers={false}
        />
      </div>

      <div className="flex-1 flex">
        {/* Main fishing area */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-6">🎣</div>
            
            {isWaiting && (
              <div className="text-center">
                <p className="text-axie-secondary text-lg font-bold mb-2">Waiting for a bite...</p>
                <div className="animate-pulse text-blue-400">~~~</div>
              </div>
            )}

            {fishBiting && (
              <button
                onClick={tryToCatch}
                className={`btn-secondary text-xl py-3 px-8 ${
                  biteWindow ? 'animate-pulse-glow' : ''
                }`}
              >
                {biteWindow ? 'CATCH NOW!' : 'Wait...'}
              </button>
            )}

            {currentCatch && (
              <div className="text-center">
                <div className="text-6xl mb-4 animate-bounce">{currentCatch.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{currentCatch.name}</h3>
                <p className="text-axie-secondary text-lg font-bold mb-2">
                  Weight: {currentCatch.weight}kg
                </p>
                <p className={`font-bold ${getRarityColor(currentCatch.rarity)}`}>
                  {currentCatch.rarity.toUpperCase()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent catches sidebar */}
        <div className="w-64 ml-6">
          <h3 className="text-lg font-bold text-white mb-4">Recent Catches</h3>
          <div className="space-y-2">
            {recentCatches.map((fish, index) => (
              <div key={index} className="bg-axie-dark rounded-lg p-3 flex items-center">
                <div className="text-2xl mr-3">{fish.icon}</div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{fish.name}</p>
                  <p className="text-gray-400 text-xs">{fish.weight}kg</p>
                </div>
                <div className={`text-xs font-bold ${getRarityColor(fish.rarity)}`}>
                  {fish.rarity}
                </div>
              </div>
            ))}
            {recentCatches.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-8">
                No catches yet...
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          Wait for the fish to bite, then click CATCH NOW at the right moment!
        </p>
      </div>
    </div>
  );
};

export default FisherGame;