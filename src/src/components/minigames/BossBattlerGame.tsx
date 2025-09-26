import React, { useState, useEffect } from 'react';
import { MinigameProps } from '../../types';
import ProgressBar from '../ProgressBar';

const BossBattlerGame: React.FC<MinigameProps> = ({ track, onProgress, onComplete, onClose }) => {
  const [bossHealth, setBossHealth] = useState(1000);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [battleStarted, setBattleStarted] = useState(false);
  const [battleWon, setBattleWon] = useState(false);
  
  const currentTier = Math.min(track.currentTier, track.maxTiers - 1);
  const targetTime = [90, 75, 60, 45][currentTier]; // Target completion times

  const startBattle = () => {
    setBattleStarted(true);
    setBossHealth(1000);
    setCombo(0);
    setTimeLeft(120);
    setBattleWon(false);
  };

  const attack = () => {
    if (!battleStarted || battleWon || timeLeft <= 0) return;
    
    const baseDamage = 20;
    const comboBonus = Math.min(combo * 2, 40);
    const totalDamage = baseDamage + comboBonus;
    
    const newHealth = Math.max(0, bossHealth - totalDamage);
    setBossHealth(newHealth);
    setCombo(prev => prev + 1);
    
    if (newHealth <= 0) {
      setBattleWon(true);
      const completionTime = 120 - timeLeft;
      onProgress(1);
      
      if (completionTime <= targetTime) {
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }
  };

  // Timer countdown
  useEffect(() => {
    if (!battleStarted || battleWon || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setBattleStarted(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [battleStarted, battleWon, timeLeft]);

  // Combo decay
  useEffect(() => {
    if (combo <= 0) return;
    
    const decay = setTimeout(() => {
      setCombo(0);
    }, 2000);

    return () => clearTimeout(decay);
  }, [combo]);

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-axie-primary mb-2">Boss Battle Arena</h2>
          <p className="text-gray-300">Defeat the boss within the time limit!</p>
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
          <span className="text-axie-secondary font-bold">Target: Complete in {targetTime}s</span>
          <span className="text-white font-bold">Time: {timeLeft}s</span>
        </div>
        {combo > 0 && (
          <div className="text-center mb-3">
            <span className="text-axie-accent font-bold text-lg">Combo x{combo}!</span>
          </div>
        )}
      </div>

      {!battleStarted && !battleWon ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-6">🐲</div>
            <h3 className="text-3xl font-bold text-white mb-4">Ancient Dragon</h3>
            <p className="text-gray-300 mb-6">
              A fearsome boss awaits your challenge. Attack rapidly to build combos!
            </p>
            <button
              onClick={startBattle}
              className="btn-primary text-2xl py-4 px-12"
            >
              START BATTLE!
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4 animate-bounce">🐲</div>
            <div className="max-w-md mx-auto mb-6">
              <ProgressBar
                current={1000 - bossHealth}
                max={1000}
                showNumbers={false}
              />
              <p className="text-white font-bold mt-2">{bossHealth} / 1000 HP</p>
            </div>
          </div>

          <div className="text-center">
            {!battleWon && bossHealth > 0 && timeLeft > 0 && (
              <button
                onClick={attack}
                className="btn-primary text-2xl py-4 px-12 transform active:scale-95"
              >
                ATTACK!
              </button>
            )}

            {battleWon && (
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-3xl font-bold text-axie-secondary mb-2">Victory!</h3>
                <p className="text-white">
                  Boss defeated in {120 - timeLeft} seconds!
                </p>
                {120 - timeLeft <= targetTime && (
                  <p className="text-axie-accent font-bold mt-2">
                    🏆 Tier requirement met!
                  </p>
                )}
              </div>
            )}

            {!battleWon && timeLeft === 0 && (
              <div className="text-center">
                <div className="text-6xl mb-4">💀</div>
                <h3 className="text-3xl font-bold text-red-400 mb-2">Defeat...</h3>
                <p className="text-white mb-4">
                  Time ran out! The boss still has {bossHealth} health.
                </p>
                <button
                  onClick={startBattle}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          Click ATTACK rapidly to deal damage. Build combos for increased damage!
        </p>
      </div>
    </div>
  );
};

export default BossBattlerGame;