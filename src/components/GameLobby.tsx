import React from 'react';
import { motion } from 'framer-motion';
import { GameState, Player } from '../types/game';
import './GameLobby.css';

interface GameLobbyProps {
  gameState: GameState;
  currentPlayer: Player;
  onStartGame: () => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({
  gameState,
  currentPlayer,
  onStartGame
}) => {
  const canStartGame = currentPlayer.isHost && gameState.players.length >= 3;

  return (
    <div className="game-lobby">
      <motion.div
        className="lobby-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="lobby-header">
          <h2 className="lobby-title">Waiting for Champions</h2>
          <p className="lobby-subtitle">
            {gameState.players.length < 3 
              ? `Need ${3 - gameState.players.length} more player${3 - gameState.players.length === 1 ? '' : 's'} to start`
              : 'Ready to begin the deception!'
            }
          </p>
        </div>

        <div className="players-section">
          <h3 className="section-title">Players ({gameState.players.length}/10)</h3>
          <div className="players-grid">
            {gameState.players.map((player, index) => (
              <motion.div
                key={player.id}
                className={`player-card ${player.isHost ? 'host' : ''} ${player.id === currentPlayer.id ? 'current' : ''}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="player-avatar">
                  {player.isHost ? '👑' : '⚔️'}
                </div>
                <div className="player-info">
                  <span className="player-name">{player.name}</span>
                  {player.isHost && <span className="host-badge">Host</span>}
                </div>
                {player.id === currentPlayer.id && (
                  <span className="current-badge">You</span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="game-info-section">
          <div className="info-card">
            <h4>🎮 How to Play</h4>
            <ul>
              <li>One player will secretly become the <strong>Impostor</strong></li>
              <li>Champions will know the secret League of Legends champion</li>
              <li>Discuss and ask questions to identify the Impostor</li>
              <li>Vote to eliminate suspicious players</li>
              <li>Champions win by finding the Impostor</li>
              <li>Impostor wins by surviving until only 2 players remain</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>📋 Game Rules</h4>
            <ul>
              <li>Minimum 3 players required to start</li>
              <li>Discussion phase: 2 minutes</li>
              <li>Voting phase: 30 seconds</li>
              <li>You cannot vote for yourself</li>
              <li>In case of a tie, no one is eliminated</li>
              <li>Game continues until win condition is met</li>
            </ul>
          </div>
        </div>

        {currentPlayer.isHost && (
          <div className="host-controls">
            <button
              className={`btn btn-primary btn-large ${!canStartGame ? 'disabled' : ''}`}
              onClick={onStartGame}
              disabled={!canStartGame}
            >
              {canStartGame ? '🚀 Launch Game' : '⏳ Need More Players'}
            </button>
            <p className="start-hint">
              {canStartGame 
                ? 'Click to start the game and assign roles!'
                : 'Wait for more players to join before starting'
              }
            </p>
          </div>
        )}

        {!currentPlayer.isHost && (
          <div className="waiting-message">
            <div className="waiting-icon">⏳</div>
            <p>Waiting for the host to start the game...</p>
            <p className="waiting-subtitle">Get ready for the ultimate test of deception!</p>
          </div>
        )}

        <div className="share-section">
          <h4>Share Game ID with Friends</h4>
          <p className="share-text">
            Share this Game ID: <strong>{gameState.id.substring(0, 8).toUpperCase()}</strong>
          </p>
          <p className="share-hint">
            Friends can join by entering this ID in the main lobby
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default GameLobby;
