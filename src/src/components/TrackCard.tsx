import React from 'react';
import { Track, Character } from '../types';
import { getCharacterAvatar, getTrackIcon } from '../utils/gameLogic';
import ProgressBar from './ProgressBar';

interface TrackCardProps {
  track: Track;
  character: Character | null;
  onAssignCharacter: (trackId: number) => void;
  onStartMinigame: (track: Track) => void;
  onSwitchCharacter: (trackId: number) => void;
}

const TrackCard: React.FC<TrackCardProps> = ({
  track,
  character,
  onAssignCharacter,
  onStartMinigame,
  onSwitchCharacter,
}) => {
  const isCompleted = track.currentTier >= track.maxTiers;
  const isAvailable = !character;
  const canPlay = character && !isCompleted;

  const getCurrentTierInfo = () => {
    if (track.currentTier >= track.maxTiers) {
      return {
        label: 'COMPLETED',
        current: track.tiers[track.maxTiers - 1],
        target: track.tiers[track.maxTiers - 1],
      };
    }

    return {
      label: track.tierLabels[track.currentTier],
      current: track.progress,
      target: track.tiers[track.currentTier],
    };
  };

  const tierInfo = getCurrentTierInfo();

  return (
    <div
      className={`track-card ${
        isAvailable ? 'available' : character ? 'active' : 'occupied'
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <div className="text-3xl mr-3">
            {getTrackIcon(track.name)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{track.name}</h3>
            <p className="text-sm text-gray-300">{track.description}</p>
          </div>
        </div>

        {character && (
          <div className="text-right">
            <div className="text-2xl mb-1">
              {getCharacterAvatar(character.name)}
            </div>
            <p className="text-xs text-axie-secondary font-semibold">
              {character.name}
            </p>
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-axie-accent">
            {tierInfo.label}
          </span>
          <span className="text-xs text-gray-400">
            Tier {Math.min(track.currentTier + 1, track.maxTiers)} / {track.maxTiers}
          </span>
        </div>

        {!isCompleted ? (
          <ProgressBar
            current={tierInfo.current}
            max={tierInfo.target}
            showNumbers={true}
          />
        ) : (
          <div className="bg-gradient-to-r from-axie-secondary to-axie-accent h-4 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-axie-dark">COMPLETED</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!character && (
          <button
            onClick={() => onAssignCharacter(track.id)}
            className="btn-secondary flex-1"
            disabled={!isAvailable}
          >
            Assign Character
          </button>
        )}

        {character && !isCompleted && (
          <>
            <button
              onClick={() => onStartMinigame(track)}
              className="btn-primary flex-1"
              disabled={!canPlay}
            >
              Play Minigame
            </button>
            <button
              onClick={() => onSwitchCharacter(track.id)}
              className="btn-secondary px-3"
            >
              Switch
            </button>
          </>
        )}

        {character && isCompleted && (
          <div className="flex-1 flex items-center justify-center py-2 px-4 bg-axie-secondary text-axie-dark font-bold rounded-lg">
            Track Completed! 🎉
          </div>
        )}
      </div>

      {character?.preferredTrack === track.id && (
        <div className="mt-3 bg-axie-accent/20 border border-axie-accent rounded-lg p-2">
          <p className="text-axie-accent text-xs font-semibold text-center">
            ⭐ This character's specialty
          </p>
        </div>
      )}
    </div>
  );
};

export default TrackCard;