import React, { useState } from 'react';
import { MinigameProps } from '../../types';
import ProgressBar from '../ProgressBar';

interface ShopItem {
  id: number;
  name: string;
  icon: string;
  cost: number;
}

const GoldSpenderGame: React.FC<MinigameProps> = ({ track, onProgress, onComplete, onClose }) => {
  const [currentGold, setCurrentGold] = useState(0);
  const [purchases, setPurchases] = useState(0);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const currentTier = Math.min(track.currentTier, track.maxTiers - 1);
  const targetGold = track.tiers[currentTier];

  const items: ShopItem[] = [
    { id: 1, name: 'Health Potion', icon: '🧪', cost: 10 },
    { id: 2, name: 'Magic Sword', icon: '⚔️', cost: 50 },
    { id: 3, name: 'Shield', icon: '🛡️', cost: 75 },
    { id: 4, name: 'Bow', icon: '🏹', cost: 40 },
    { id: 5, name: 'Armor', icon: '🦺', cost: 100 },
    { id: 6, name: 'Ring', icon: '💍', cost: 200 },
    { id: 7, name: 'Gem', icon: '💎', cost: 500 },
    { id: 8, name: 'Crown', icon: '👑', cost: 1000 },
  ];

  const handlePurchase = (item: ShopItem) => {
    if (selectedItem) return; // Prevent multiple clicks during animation

    setSelectedItem(item);
    const newGoldSpent = currentGold + item.cost;
    setCurrentGold(newGoldSpent);
    setPurchases(prev => prev + 1);

    // Add progress
    onProgress(item.cost);

    // Auto-advance after a brief animation
    setTimeout(() => {
      setSelectedItem(null);
    }, 1000);

    // Check if tier is completed
    if (newGoldSpent >= targetGold) {
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  // Helper function for future use
  // const canAfford = (cost: number) => {
  //   return true; // In this simulation, we can always "afford" items
  // };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-axie-primary mb-2">Gold Spender's Market</h2>
          <p className="text-gray-300">Purchase items to reach your spending goal!</p>
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
          <span className="text-white font-bold">{purchases} items purchased</span>
        </div>
        <ProgressBar
          current={currentGold}
          max={targetGold}
          showNumbers={true}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">Available Items</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`card p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedItem?.id === item.id ? 'animate-pulse-glow border-axie-accent' : ''
              }`}
              onClick={() => handlePurchase(item)}
            >
              <div className="text-4xl mb-2 text-center">{item.icon}</div>
              <h4 className="text-white font-bold text-sm text-center mb-2">{item.name}</h4>
              <div className="text-center">
                <span className="bg-axie-secondary text-axie-dark px-2 py-1 rounded text-xs font-bold">
                  {item.cost} Gold
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-bounce-slow text-6xl">
            {selectedItem.icon}
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Click on items to purchase them and increase your gold spending progress!
        </p>
      </div>
    </div>
  );
};

export default GoldSpenderGame;