import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GameState, Player } from '../types/game';
import './DiscussionPhase.css';

interface DiscussionPhaseProps {
  gameState: GameState;
  currentPlayer: Player;
}

const DiscussionPhase: React.FC<DiscussionPhaseProps> = ({
  gameState,
  currentPlayer
}) => {
  const [showSecret, setShowSecret] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRoleDescription = () => {
    if (currentPlayer.role === 'champion') {
      return `You are a Champion! The secret champion is: ${currentPlayer.secretChampion}`;
    } else {
      return "You are the Impostor! You don't know the secret champion. Blend in and avoid suspicion!";
    }
  };

  const getRoleIcon = () => {
    return currentPlayer.role === 'champion' ? '⚔️' : '🎭';
  };

  const getRoleColor = () => {
    return currentPlayer.role === 'champion' ? 'var(--success)' : 'var(--danger)';
  };

  return (
    <div className="discussion-phase">
      <motion.div
        className="discussion-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="phase-header">
          <h2 className="phase-title">🗣️ Discussion Phase</h2>
          <div className="timer-display">
            <span className="timer-label">Time Remaining:</span>
            <span className={`timer-value ${gameState.roundTimer <= 30 ? 'urgent' : ''}`}>
              {formatTime(gameState.roundTimer)}
            </span>
          </div>
        </div>

        <div className="role-reveal">
          <div 
            className="role-card"
            style={{ borderColor: getRoleColor() }}
          >
            <div className="role-icon">{getRoleIcon()}</div>
            <div className="role-info">
              <h3 className="role-title">
                {currentPlayer.role === 'champion' ? 'Champion' : 'Impostor'}
              </h3>
              <p className="role-description">{getRoleDescription()}</p>
            </div>
            {currentPlayer.role === 'champion' && (
              <button
                className="secret-toggle-btn"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? 'Hide' : 'Show'} Secret
              </button>
            )}
          </div>

          {currentPlayer.role === 'champion' && showSecret && (
            <motion.div
              className="secret-champion"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h4>Secret Champion:</h4>
              <div className="champion-name">{currentPlayer.secretChampion}</div>
            </motion.div>
          )}
        </div>

        <div className="discussion-guidelines">
          <h3>💡 Discussion Guidelines</h3>
          <div className="guidelines-grid">
            <div className="guideline-card">
              <h4>For Champions:</h4>
              <ul>
                <li>Ask specific questions about the champion</li>
                <li>Test others' knowledge with details</li>
                <li>Look for hesitation or vague answers</li>
                <li>Share your own knowledge confidently</li>
              </ul>
            </div>
            
            <div className="guideline-card">
              <h4>For Impostor:</h4>
              <ul>
                <li>Listen carefully to others' answers</li>
                <li>Give plausible but non-specific responses</li>
                <li>Ask questions to deflect suspicion</li>
                <li>Act confident but not overly knowledgeable</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="players-overview">
          <h3>👥 Players</h3>
          <div className="players-list">
            {gameState.players.map((player) => (
              <motion.div
                key={player.id}
                className={`player-item ${player.id === currentPlayer.id ? 'current' : ''} ${!player.isAlive ? 'eliminated' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="player-status">
                  <span className={`status-dot ${player.isAlive ? 'alive' : 'eliminated'}`}></span>
                  <span className="player-name">{player.name}</span>
                  {player.id === currentPlayer.id && <span className="current-badge">You</span>}
                  {player.isHost && <span className="host-badge">Host</span>}
                </div>
                {!player.isAlive && (
                  <span className="eliminated-text">Eliminated</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="discussion-tips">
          <h3>🎯 Tips for Success</h3>
          <div className="tips-content">
            <p>
              <strong>Champions:</strong> Use your knowledge of League of Legends to ask 
              specific questions about abilities, lore, or gameplay mechanics.
            </p>
            <p>
              <strong>Impostor:</strong> Pay attention to how others describe the champion 
              and try to mimic their level of detail without being too specific.
            </p>
            <p>
              <strong>Everyone:</strong> Watch for inconsistencies in answers and body 
              language. The discussion phase is crucial for gathering information!
            </p>
          </div>
        </div>

        <div className="phase-footer">
          <p className="phase-hint">
            ⏰ The voting phase will begin automatically when time runs out.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default DiscussionPhase;
