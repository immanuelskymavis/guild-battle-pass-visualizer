import React, { useState, useEffect } from 'react';
import { GuildState, Track, Character } from '../types';
import { getInitialGuildState } from '../data/initialData';
import { calculateOverallCompletion, canCharacterJoinTrack } from '../utils/gameLogic';
import { saveGuildState, loadGuildState, resetProgress } from '../utils/localStorage';
import TrackCard from './TrackCard';
import CharacterSelector from './CharacterSelector';
import MiniGame from './MiniGame';
import CelebrationEffect from './CelebrationEffect';
import ProgressBar from './ProgressBar';

const GuildDashboard: React.FC = () => {
  const [guild, setGuild] = useState<GuildState>(getInitialGuildState());
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [selectedTrackForAssignment, setSelectedTrackForAssignment] = useState<number | null>(null);
  const [activeMinigame, setActiveMinigame] = useState<Track | null>(null);
  const [celebration, setCelebration] = useState({
    show: false,
    type: 'tier' as 'guild' | 'track' | 'tier',
    message: ''
  });

  // Load saved state on component mount
  useEffect(() => {
    const savedState = loadGuildState();
    if (savedState) {
      setGuild(savedState);
    }
  }, []);

  // Save state whenever guild state changes
  useEffect(() => {
    saveGuildState(guild);
  }, [guild]);

  // Update overall completion whenever tracks change
  useEffect(() => {
    const newCompletion = calculateOverallCompletion(guild.tracks);
    if (newCompletion !== guild.overallCompletion) {
      setGuild(prev => ({ ...prev, overallCompletion: newCompletion }));

      // Check for guild completion celebration
      if (newCompletion === 100 && guild.overallCompletion < 100) {
        setTimeout(() => {
          setCelebration({
            show: true,
            type: 'guild',
            message: 'GUILD MASTERY ACHIEVED!'
          });
        }, 500);
      }
    }
  }, [guild.tracks, guild.overallCompletion]);

  const handleAssignCharacter = (trackId: number) => {
    setSelectedTrackForAssignment(trackId);
    setShowCharacterSelector(true);
  };

  const handleSelectCharacter = (character: Character) => {
    if (!selectedTrackForAssignment) return;

    if (!canCharacterJoinTrack(character.id, selectedTrackForAssignment, guild)) {
      alert('This character cannot be assigned to this track.');
      return;
    }

    setGuild(prev => ({
      ...prev,
      characters: prev.characters.map(c => {
        if (c.id === character.id) {
          // Remove character from previous track if assigned
          if (c.assignedTrack !== null) {
            prev.tracks = prev.tracks.map(t => 
              t.id === c.assignedTrack ? { ...t, assignedCharacter: null } : t
            );
          }
          return { ...c, assignedTrack: selectedTrackForAssignment };
        }
        return c;
      }),
      tracks: prev.tracks.map(t => 
        t.id === selectedTrackForAssignment 
          ? { ...t, assignedCharacter: character.id }
          : t
      )
    }));

    setShowCharacterSelector(false);
    setSelectedTrackForAssignment(null);
  };

  const handleSwitchCharacter = (trackId: number) => {
    // Remove character from track
    setGuild(prev => ({
      ...prev,
      characters: prev.characters.map(c => 
        c.assignedTrack === trackId ? { ...c, assignedTrack: null } : c
      ),
      tracks: prev.tracks.map(t => 
        t.id === trackId ? { ...t, assignedCharacter: null } : t
      )
    }));

    // Open character selector for reassignment
    setSelectedTrackForAssignment(trackId);
    setShowCharacterSelector(true);
  };

  const handleStartMinigame = (track: Track) => {
    setActiveMinigame(track);
  };

  const handleMinigameProgress = (trackId: number, amount: number) => {
    setGuild(prev => ({
      ...prev,
      tracks: prev.tracks.map(track => {
        if (track.id !== trackId) return track;

        const oldProgress = track.progress;
        let newProgress = oldProgress + amount;
        let newTier = track.currentTier;

        // Check if we should advance to next tier
        while (newTier < track.maxTiers && newProgress >= track.tiers[newTier]) {
          newProgress -= track.tiers[newTier];
          newTier++;

          // Celebrate tier completion
          setTimeout(() => {
            setCelebration({
              show: true,
              type: 'tier',
              message: `${track.tierLabels[newTier - 1]} Achieved!`
            });
          }, 100);

          // Check for track completion
          if (newTier >= track.maxTiers) {
            setTimeout(() => {
              setCelebration({
                show: true,
                type: 'track',
                message: `${track.name} Mastered!`
              });
            }, 1000);
            break;
          }
        }

        return {
          ...track,
          progress: newProgress,
          currentTier: newTier
        };
      })
    }));
  };

  const handleMinigameComplete = () => {
    setActiveMinigame(null);
  };

  const getCharacterForTrack = (trackId: number): Character | null => {
    const track = guild.tracks.find(t => t.id === trackId);
    if (!track?.assignedCharacter) return null;
    return guild.characters.find(c => c.id === track.assignedCharacter) || null;
  };

  return (
    <div className="min-h-screen bg-axie-dark text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-axie-primary mb-4">
            🏰 Guild Battle Pass Visualizer
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Coordinate your guild members across different progression tracks
          </p>
          
          {/* Overall Progress */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-axie-secondary">Guild Progress</span>
              <span className="text-xl text-white">{guild.overallCompletion}% Complete</span>
            </div>
            <ProgressBar
              current={guild.overallCompletion}
              max={100}
              showNumbers={false}
              className="h-6"
            />
            {guild.overallCompletion === 100 && (
              <div className="mt-4 text-axie-secondary font-bold text-lg animate-pulse">
                🎉 All tracks completed! Guild mastery achieved! 🎉
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={resetProgress}
              className="btn-secondary"
            >
              Reset Progress
            </button>
          </div>
        </div>

        {/* Track Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {guild.tracks.map(track => (
            <TrackCard
              key={track.id}
              track={track}
              character={getCharacterForTrack(track.id)}
              onAssignCharacter={handleAssignCharacter}
              onStartMinigame={handleStartMinigame}
              onSwitchCharacter={handleSwitchCharacter}
            />
          ))}
        </div>

        {/* How It Works Section */}
        <div className="mt-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-axie-secondary mb-4">
            How Guild Coordination Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-2">1. Character Specialization</h3>
              <p className="text-gray-300 text-sm">
                Each character has a preferred track where they excel. Assign characters to tracks 
                that match their specialization for bonus effectiveness.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-2">2. Track Exclusivity</h3>
              <p className="text-gray-300 text-sm">
                Only one character can work on each track at a time. Coordinate with your guild 
                to ensure all tracks are covered efficiently.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-2">3. Progressive Tiers</h3>
              <p className="text-gray-300 text-sm">
                Each track has 4 tiers with increasing difficulty. Complete tier requirements 
                through minigames to unlock the next tier.
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-2">4. Guild Achievement</h3>
              <p className="text-gray-300 text-sm">
                Your guild's overall progress is the average of all track progress. Complete all 
                tracks to achieve 100% guild battle pass completion!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCharacterSelector && (
        <CharacterSelector
          characters={guild.characters}
          onSelectCharacter={handleSelectCharacter}
          onClose={() => {
            setShowCharacterSelector(false);
            setSelectedTrackForAssignment(null);
          }}
        />
      )}

      {activeMinigame && (
        <MiniGame
          track={activeMinigame}
          onProgress={(amount) => handleMinigameProgress(activeMinigame.id, amount)}
          onComplete={handleMinigameComplete}
          onClose={handleMinigameComplete}
        />
      )}

      {celebration.show && (
        <CelebrationEffect
          show={celebration.show}
          type={celebration.type}
          message={celebration.message}
          onComplete={() => setCelebration({ show: false, type: 'tier', message: '' })}
        />
      )}
    </div>
  );
};

export default GuildDashboard;