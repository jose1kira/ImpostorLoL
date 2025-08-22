import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GameState, Player } from '../types/game';
import './VotingPhase.css';

interface VotingPhaseProps {
  gameState: GameState;
  currentPlayer: Player;
  onVote: (targetId: string) => void;
}

const VotingPhase: React.FC<VotingPhaseProps> = ({
  gameState,
  currentPlayer,
  onVote
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [hasVoted, setHasVoted] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVote = (playerId: string) => {
    if (hasVoted || playerId === currentPlayer.id) return;
    
    setSelectedPlayer(playerId);
    onVote(playerId);
    setHasVoted(true);
  };

  const getVoteStatus = (playerId: string) => {
    if (playerId === selectedPlayer) return 'selected';
    if (playerId === currentPlayer.id) return 'disabled';
    if (hasVoted) return 'voted';
    return 'available';
  };

  const getVoteButtonText = (playerId: string) => {
    if (playerId === currentPlayer.id) return 'You';
    if (playerId === selectedPlayer) return 'Voted ✓';
    if (hasVoted) return 'Vote Locked';
    return 'Vote';
  };

  const alivePlayers = gameState.players.filter(p => p.isAlive);

  return (
    <div className="voting-phase">
      <motion.div
        className="voting-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="phase-header">
          <h2 className="phase-title">🗳️ Voting Phase</h2>
          <div className="timer-display">
            <span className="timer-label">Time Remaining:</span>
            <span className={`timer-value ${gameState.roundTimer <= 10 ? 'urgent' : ''}`}>
              {formatTime(gameState.roundTimer)}
            </span>
          </div>
        </div>

        <div className="voting-instructions">
          <div className="instruction-card">
            <h3>📋 Voting Instructions</h3>
            <ul>
              <li>Choose who you think is the Impostor</li>
              <li>You cannot vote for yourself</li>
              <li>Once you vote, you cannot change it</li>
              <li>The player with the most votes will be eliminated</li>
              <li>In case of a tie, no one is eliminated</li>
            </ul>
          </div>
        </div>

        <div className="players-voting">
          <h3>👥 Cast Your Vote</h3>
          <div className="voting-grid">
            {alivePlayers.map((player) => (
              <motion.div
                key={player.id}
                className={`voting-card ${getVoteStatus(player.id)}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="player-info">
                  <div className="player-avatar">
                    {player.isHost ? '👑' : '⚔️'}
                  </div>
                  <div className="player-details">
                    <span className="player-name">{player.name}</span>
                    {player.isHost && <span className="host-badge">Host</span>}
                    {player.id === currentPlayer.id && <span className="current-badge">You</span>}
                  </div>
                </div>
                
                <button
                  className={`vote-btn ${getVoteStatus(player.id)}`}
                  onClick={() => handleVote(player.id)}
                  disabled={getVoteStatus(player.id) === 'disabled' || hasVoted}
                >
                  {getVoteButtonText(player.id)}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {hasVoted && (
          <motion.div
            className="vote-confirmation"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="confirmation-icon">✅</div>
            <h4>Vote Cast!</h4>
            <p>
              You voted to eliminate <strong>{gameState.players.find(p => p.id === selectedPlayer)?.name}</strong>
            </p>
            <p className="confirmation-hint">
              Waiting for other players to vote...
            </p>
          </motion.div>
        )}

        <div className="voting-tips">
          <h3>💡 Voting Strategy</h3>
          <div className="tips-content">
            <div className="tip-card">
              <h4>For Champions:</h4>
              <p>
                Consider who seemed uncertain during discussion, gave vague answers, 
                or avoided specific questions about the champion.
              </p>
            </div>
            <div className="tip-card">
              <h4>For Impostor:</h4>
              <p>
                Try to vote for someone who might seem suspicious to others. 
                Create doubt and confusion to survive another round.
              </p>
            </div>
          </div>
        </div>

        <div className="phase-footer">
          <p className="phase-hint">
            ⏰ Voting ends automatically when time runs out or all players have voted.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VotingPhase;
