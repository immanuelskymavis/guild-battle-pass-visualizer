import React, { useState } from 'react';
import { MinigameProps } from '../../types';
import ProgressBar from '../ProgressBar';

interface SearchTile {
  id: number;
  hasAxie: boolean;
  revealed: boolean;
  axieType?: string;
  hint?: 'warm' | 'cold';
}

const AxieFinderGame: React.FC<MinigameProps> = ({ track, onProgress, onComplete, onClose }) => {
  const [searchPattern, setSearchPattern] = useState<SearchTile[]>([]);
  const [axiesFound, setAxiesFound] = useState(0);
  const [searchesUsed, setSearchesUsed] = useState(0);
  const [recentFind, setRecentFind] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const currentTier = Math.min(track.currentTier, track.maxTiers - 1);
  const targetAxies = track.tiers[currentTier];

  const axieTypes = ['🦄', '🐉', '🦋', '🌿', '⚡', '🔥', '💧', '🌙'];

  const generateGrid = () => {
    const newGrid: SearchTile[] = [];
    const axiePositions = new Set<number>();
    
    // Place axies randomly
    const numAxies = Math.min(targetAxies - axiesFound, 3); // Max 3 axies per grid
    while (axiePositions.size < numAxies) {
      axiePositions.add(Math.floor(Math.random() * 36));
    }

    for (let i = 0; i < 36; i++) {
      newGrid.push({
        id: i,
        hasAxie: axiePositions.has(i),
        revealed: false,
        axieType: axiePositions.has(i) ? axieTypes[Math.floor(Math.random() * axieTypes.length)] : undefined,
      });
    }

    setSearchPattern(newGrid);
    setGameStarted(true);
  };

  const searchTile = (tileId: number) => {
    const tile = searchPattern.find(t => t.id === tileId);
    if (!tile || tile.revealed) return;

    setSearchesUsed(prev => prev + 1);

    const newPattern = searchPattern.map(t => {
      if (t.id === tileId) {
        return { ...t, revealed: true };
      }
      return t;
    });

    if (tile.hasAxie) {
      // Found an axie!
      setAxiesFound(prev => prev + 1);
      setRecentFind(tile.axieType!);
      onProgress(1);

      setTimeout(() => {
        setRecentFind(null);
      }, 2000);

      // Check completion
      if (axiesFound + 1 >= targetAxies) {
        setTimeout(() => {
          onComplete();
        }, 2500);
      }
    } else {
      // Add proximity hints
      const row = Math.floor(tileId / 6);
      const col = tileId % 6;
      
      let hasNearbyAxie = false;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const newRow = row + dr;
          const newCol = col + dc;
          if (newRow >= 0 && newRow < 6 && newCol >= 0 && newCol < 6) {
            const nearbyId = newRow * 6 + newCol;
            const nearbyTile = searchPattern.find(t => t.id === nearbyId);
            if (nearbyTile && nearbyTile.hasAxie && !nearbyTile.revealed) {
              hasNearbyAxie = true;
              break;
            }
          }
        }
      }

      newPattern[tileId] = {
        ...newPattern[tileId],
        hint: hasNearbyAxie ? 'warm' : 'cold'
      };
    }

    setSearchPattern(newPattern);
  };

  const resetGame = () => {
    generateGrid();
    setSearchesUsed(0);
  };

  const getSearchPattern = () => {
    return searchPattern;
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-axie-primary mb-2">Axie Discovery Expedition</h2>
          <p className="text-gray-300">Search the terrain to find hidden Axies!</p>
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
          <span className="text-white font-bold">{axiesFound} / {targetAxies} Axies found</span>
        </div>
        <ProgressBar
          current={axiesFound}
          max={targetAxies}
          showNumbers={false}
        />
        <div className="text-center mt-2">
          <span className="text-gray-400 text-sm">Searches used: {searchesUsed}</span>
        </div>
      </div>

      {!gameStarted ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-6">🗺️</div>
            <h3 className="text-3xl font-bold text-white mb-4">Unexplored Territory</h3>
            <p className="text-gray-300 mb-6">
              Search carefully through the terrain!
            </p>
            <button
              onClick={generateGrid}
              className="btn-primary text-xl py-3 px-8"
            >
              Begin Search
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Search Grid */}
          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-6 gap-2 max-w-md">
              {getSearchPattern().map((tile: SearchTile) => (
                <div
                  key={tile.id}
                  onClick={() => searchTile(tile.id)}
                  className={`
                    w-12 h-12 rounded-lg border-2 cursor-pointer transition-all duration-300 
                    flex items-center justify-center text-xl
                    ${tile.revealed 
                      ? tile.hasAxie 
                        ? 'bg-axie-secondary border-axie-accent animate-pulse-glow' 
                        : 'bg-gray-600 border-gray-500' 
                      : 'bg-axie-dark border-axie-primary/30 hover:border-axie-secondary hover:bg-axie-navy'
                    }
                    ${tile.hint === 'warm' ? 'border-yellow-400 bg-yellow-400/20' : ''}
                    ${tile.hint === 'cold' ? 'border-blue-400 bg-blue-400/10' : ''}
                  `}
                >
                  {tile.revealed ? (
                    tile.hasAxie ? tile.axieType : '🌿'
                  ) : (
                    '❓'
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent find celebration */}
          {recentFind && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-8xl mb-4 animate-bounce">{recentFind}</div>
                <div className="text-2xl font-bold text-axie-secondary animate-pulse">
                  Axie Found!
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={resetGame}
              className="btn-secondary"
            >
              New Area
            </button>
            {searchesUsed > 10 && (
              <div className="text-yellow-400 text-sm">
                💡 Hint: Look for glowing areas if you're stuck!
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          Click on tiles to search for hidden Axies. Some areas are more likely to have them!
        </p>
      </div>
    </div>
  );
};

export default AxieFinderGame;