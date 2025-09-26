import React, { useState, useEffect } from 'react';

interface CelebrationEffectProps {
  show: boolean;
  type: 'guild' | 'track' | 'tier';
  message: string;
  onComplete: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  size: number;
  delay: number;
}

const CelebrationEffect: React.FC<CelebrationEffectProps> = ({
  show,
  type,
  message,
  onComplete,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      // Generate celebration particles
      const newParticles: Particle[] = [];
      const emojis = type === 'guild' ? ['🏰', '🎉', '🎊', '⭐', '🏆'] 
        : type === 'track' ? ['🏆', '🎉', '⭐', '🌟'] 
        : ['✨', '⭐', '🌟'];
      
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          emoji: emojis[Math.floor(Math.random() * emojis.length)],
          size: Math.random() * 1.5 + 1,
          delay: Math.random() * 2000,
        });
      }
      setParticles(newParticles);

      // Auto-dismiss after 5 seconds for guild celebrations
      if (type === 'guild') {
        setTimeout(() => {
          onComplete();
        }, 5000);
      }
    }
  }, [show, type, onComplete]);

  const getBackgroundEffect = () => {
    switch (type) {
      case 'guild':
        return 'bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20';
      case 'track':
        return 'bg-gradient-to-r from-blue-600/15 via-purple-600/15 to-pink-600/15';
      case 'tier':
        return 'bg-gradient-to-r from-green-600/10 via-blue-600/10 to-purple-600/10';
      default:
        return '';
    }
  };

  const getTextSize = () => {
    switch (type) {
      case 'guild': return 'text-4xl md:text-6xl';
      case 'track': return 'text-3xl md:text-5xl';
      case 'tier': return 'text-2xl md:text-4xl';
      default: return 'text-2xl';
    }
  };

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${getBackgroundEffect()}`}>
      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute pointer-events-none animate-bounce"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}ms`,
            fontSize: `${particle.size}rem`,
            animationDuration: '2s',
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Main celebration content */}
      <div className="text-center animate-pulse-glow">
        <div className="mb-6">
          {type === 'guild' && (
            <div className="text-8xl mb-4">🏰</div>
          )}
          {type === 'track' && (
            <div className="text-8xl mb-4">🏆</div>
          )}
          {type === 'tier' && (
            <div className="text-6xl mb-4">⭐</div>
          )}
        </div>

        <h2 className={`font-bold text-axie-secondary mb-4 ${getTextSize()}`}>
          {message}
        </h2>

        {type === 'guild' && (
          <p className="text-white text-xl mb-6 max-w-md mx-auto">
            All tracks completed! Your guild has achieved ultimate coordination!
          </p>
        )}

        {type === 'track' && (
          <p className="text-white text-lg mb-4">
            Track mastery achieved! 🌟
          </p>
        )}

        <div className="animate-bounce text-6xl">
          {type === 'guild' ? '🎊' : type === 'track' ? '🎉' : '✨'}
        </div>
      </div>

      {/* Screen shake effect for guild completion */}
      {type === 'guild' && (
        <div className="fixed inset-0 pointer-events-none animate-shake"></div>
      )}

      {/* Click to dismiss */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onComplete}
        style={{ backgroundColor: 'transparent' }}
      ></div>

      <div className="absolute bottom-8 text-gray-400 text-sm animate-pulse">
        Click anywhere to continue
      </div>
    </div>
  );
};

export default CelebrationEffect;