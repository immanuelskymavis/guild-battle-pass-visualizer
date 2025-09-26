import React from 'react';
import { Character } from '../types';
import { getCharacterAvatar } from '../utils/gameLogic';

interface CharacterSelectorProps {
  characters: Character[];
  onSelectCharacter: (character: Character) => void;
  onClose: () => void;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  onSelectCharacter,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-axie-navy p-8 rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-axie-primary">Select Your Character</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl p-2"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() => onSelectCharacter(character)}
              className={`character-card ${
                character.assignedTrack ? 'opacity-75 border-yellow-500' : ''
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="text-6xl mr-4">
                  {getCharacterAvatar(character.name)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {character.name}
                  </h3>
                  <p className="text-axie-secondary font-semibold">
                    {character.specialization}
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-4">
                {character.description}
              </p>

              {character.assignedTrack && (
                <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3">
                  <p className="text-yellow-300 text-sm font-semibold">
                    Currently assigned to a track
                  </p>
                </div>
              )}

              {!character.assignedTrack && (
                <div className="bg-axie-secondary/20 border border-axie-secondary rounded-lg p-3">
                  <p className="text-axie-secondary text-sm font-semibold">
                    Available for assignment
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Choose a character to assign them to a track. Each character can only work on one track at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelector;