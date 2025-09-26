import React, { useState, useEffect, useCallback } from 'react';
import { MinigameProps } from '../../types';
import ProgressBar from '../ProgressBar';

interface Enemy {
  id: number;
  name: string;
  icon: string;
  health: number;
  maxHealth: number;
  position: { x: number; y: number };
  vulnerable: boolean;
}

const MobFarmerGame: React.FC<MinigameProps> = ({ track, onProgress, onComplete, onClose }) => {
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [defeatedCount, setDefeatedCount] = useState(0);
  const [showHit, setShowHit] = useState<{ id: number; damage: number } | null>(null);

  const currentTier = Math.min(track.currentTier, track.maxTiers - 1);
  const targetDefeats = track.tiers[currentTier];

  const enemyTypes = [
    { name: 'Goblin', icon: '👹', health: 30 },
    { name: 'Orc', icon: '👺', health: 50 },
    { name: 'Skeleton', icon: '💀', health: 40 },
    { name: 'Wolf', icon: '🐺', health: 25 },
    { name: 'Spider', icon: '🕷️', health: 15 },
    { name: 'Troll', icon: '🧌', health: 80 },
  ];

  const spawnEnemy = useCallback(() => {
    const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    const newEnemy: Enemy = {
      id: Math.random(),
      name: enemyType.name,
      icon: enemyType.icon,
      health: enemyType.health,
      maxHealth: enemyType.health,
      position: {
        x: Math.random() * 80 + 10, // Keep enemies away from edges
        y: Math.random() * 80 + 10,
      },
      vulnerable: Math.random() < 0.3, // 30% chance to be vulnerable
    };

    setEnemies(prev => [...prev, newEnemy]);
  }, []);

  const attackEnemy = (enemyId: number) => {
    setEnemies(prev => prev.map(enemy => {
      if (enemy.id !== enemyId) return enemy;

      const baseDamage = 15;
      const damage = enemy.vulnerable ? baseDamage * 2 : baseDamage;
      const newHealth = Math.max(0, enemy.health - damage);

      // Show damage number
      setShowHit({ id: enemyId, damage });
      setTimeout(() => setShowHit(null), 800);

      if (newHealth <= 0) {
        // Enemy defeated
        setDefeatedCount(prev => prev + 1);
        onProgress(1);

        // Remove enemy after short delay
        setTimeout(() => {
          setEnemies(current => current.filter(e => e.id !== enemyId));
        }, 500);

        // Check if tier completed
        if (defeatedCount + 1 >= targetDefeats) {
          setTimeout(() => {
            onComplete();
          }, 1000);
        }
      }

      return { ...enemy, health: newHealth, vulnerable: false };
    }));
  };

  // Spawn enemies periodically
  useEffect(() => {
    const spawnInterval = setInterval(() => {
      if (enemies.length < 6) { // Maximum 6 enemies at once
        spawnEnemy();
      }
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, [enemies.length, spawnEnemy]);

  // Make some enemies vulnerable periodically
  useEffect(() => {
    const vulnerableInterval = setInterval(() => {
      setEnemies(prev => prev.map(enemy => ({
        ...enemy,
        vulnerable: Math.random() < 0.2 // 20% chance to become vulnerable
      })));
    }, 3000);

    return () => clearInterval(vulnerableInterval);
  }, []);

  // Initial spawn
  useEffect(() => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnEnemy(), i * 500);
    }
  }, [spawnEnemy]);

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-axie-primary mb-2">Monster Hunting Grounds</h2>
          <p className="text-gray-300">Defeat enemies to complete your hunting quota!</p>
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
          <span className="text-white font-bold">{defeatedCount} / {targetDefeats} defeated</span>
        </div>
        <ProgressBar
          current={defeatedCount}
          max={targetDefeats}
          showNumbers={true}
        />
      </div>

      <div className="flex-1 relative bg-axie-dark rounded-lg border border-axie-primary/20 overflow-hidden">
        <div className="absolute inset-0 p-4">
          {enemies.map((enemy) => (
            <div
              key={enemy.id}
              className={`absolute cursor-pointer transition-all duration-300 ${
                enemy.vulnerable ? 'animate-pulse-glow scale-110' : ''
              }`}
              style={{
                left: `${enemy.position.x}%`,
                top: `${enemy.position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => attackEnemy(enemy.id)}
            >
              <div className="text-center">
                <div className={`text-4xl mb-1 ${enemy.vulnerable ? 'animate-bounce' : ''}`}>
                  {enemy.icon}
                </div>
                <div className="bg-red-600 rounded-full h-1 w-12 overflow-hidden">
                  <div
                    className="bg-red-400 h-full transition-all duration-300"
                    style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-white font-bold mt-1">{enemy.name}</div>
              </div>

              {showHit?.id === enemy.id && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-yellow-400 font-bold animate-bounce">
                  -{showHit.damage}
                </div>
              )}
            </div>
          ))}
        </div>

        {enemies.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-400 text-lg">Enemies are spawning...</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          Click enemies to attack them. Glowing enemies take critical damage!
        </p>
      </div>
    </div>
  );
};

export default MobFarmerGame;