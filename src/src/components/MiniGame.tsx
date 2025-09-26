import React from 'react';
import { MinigameProps } from '../types';
import GoldSpenderGame from './minigames/GoldSpenderGame';
import MobFarmerGame from './minigames/MobFarmerGame';
import BossBattlerGame from './minigames/BossBattlerGame';
import FisherGame from './minigames/FisherGame';
import AxieFinderGame from './minigames/AxieFinderGame';

const MiniGame: React.FC<MinigameProps> = ({ track, onProgress, onComplete, onClose }) => {
  const renderGame = () => {
    switch (track.minigameType) {
      case 'gold-spender':
        return <GoldSpenderGame track={track} onProgress={onProgress} onComplete={onComplete} onClose={onClose} />;
      case 'mob-farmer':
        return <MobFarmerGame track={track} onProgress={onProgress} onComplete={onComplete} onClose={onClose} />;
      case 'boss-battler':
        return <BossBattlerGame track={track} onProgress={onProgress} onComplete={onComplete} onClose={onClose} />;
      case 'fisher':
        return <FisherGame track={track} onProgress={onProgress} onComplete={onComplete} onClose={onClose} />;
      case 'axie-finder':
        return <AxieFinderGame track={track} onProgress={onProgress} onComplete={onComplete} onClose={onClose} />;
      default:
        return (
          <div className="text-center p-8">
            <p className="text-red-400 text-lg">Unknown minigame type: {track.minigameType}</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-axie-navy rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {renderGame()}
      </div>
    </div>
  );
};

export default MiniGame;