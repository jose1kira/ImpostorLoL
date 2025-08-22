import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, Player, GamePhase } from '../types/game';
import GameLobby from './GameLobby';
import DiscussionPhase from './DiscussionPhase';
import VotingPhase from './VotingPhase';
import EliminationPhase from './EliminationPhase';
import GameOver from './GameOver';
import './Game.css';

interface GameProps {
  gameState: GameState;
  currentPlayer: Player;
  isConnected: boolean;
  onStartGame: () => void;
  onVote: (targetId: string) => void;
  onLeaveGame: () => void;
  onGameOver: () => void;
}

const Game: React.FC<GameProps> = ({
  gameState,
  currentPlayer,
  isConnected,
  onStartGame,
  onVote,
  onLeaveGame,
  onGameOver
}) => {
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('lobby');
  const [showGameId, setShowGameId] = useState(false);

  useEffect(() => {
    // Determine current phase based on game state
    if (gameState.status === 'lobby') {
      setCurrentPhase('lobby');
    } else if (gameState.status === 'playing') {
      setCurrentPhase('discussion');
    } else if (gameState.status === 'voting') {
      setCurrentPhase('voting');
    } else if (gameState.status === 'gameOver') {
      setCurrentPhase('gameOver');
    }
  }, [gameState.status]);

  const getCurrentPhaseComponent = () => {
    switch (currentPhase) {
      case 'lobby':
        return (
          <GameLobby
            gameState={gameState}
            currentPlayer={currentPlayer}
            onStartGame={onStartGame}
          />
        );
      case 'discussion':
        return (
          <DiscussionPhase
            gameState={gameState}
            currentPlayer={currentPlayer}
          />
        );
      case 'voting':
        return (
          <VotingPhase
            gameState={gameState}
            currentPlayer={currentPlayer}
            onVote={onVote}
          />
        );
      case 'elimination':
        return (
          <EliminationPhase
            gameState={gameState}
          />
        );
      case 'gameOver':
        return (
          <GameOver
            gameState={gameState}
            currentPlayer={currentPlayer}
            onLeaveGame={onLeaveGame}
            onGameOver={onGameOver}
          />
        );
      default:
        return null;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="game">
      {/* Game Header */}
      <motion.div
        className="game-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="game-info">
          <div className="game-id-section">
            <span className="game-id-label">Game ID:</span>
            <div className="game-id-container">
              <span className="game-id">{gameState.id.substring(0, 8).toUpperCase()}</span>
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(gameState.id.substring(0, 8).toUpperCase());
                  setShowGameId(true);
                  setTimeout(() => setShowGameId(false), 2000);
                }}
                title="Copy Game ID"
              >
                📋
              </button>
            </div>
            {showGameId && (
              <motion.span
                className="copied-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                Copied!
              </motion.span>
            )}
          </div>
          
          {gameState.status !== 'lobby' && (
            <div className="game-phase-info">
              <div className="phase-indicator">
                <span className="phase-label">Phase:</span>
                <span className={`phase-name ${currentPhase}`}>
                  {currentPhase === 'discussion' ? 'Discussion' : 
                   currentPhase === 'voting' ? 'Voting' : 
                   currentPhase === 'elimination' ? 'Elimination' : 
                   currentPhase === 'gameOver' ? 'Game Over' : 'Lobby'}
                </span>
              </div>
              
              {gameState.roundTimer > 0 && (
                <div className="timer">
                  <span className="timer-label">Time:</span>
                  <span className={`timer-value ${gameState.roundTimer <= 10 ? 'urgent' : ''}`}>
                    {formatTime(gameState.roundTimer)}
                  </span>
                </div>
              )}
              
              <div className="round-info">
                <span className="round-label">Round:</span>
                <span className="round-value">{gameState.currentRound}</span>
              </div>
            </div>
          )}
        </div>

        <button className="leave-game-btn" onClick={onLeaveGame}>
          Leave Game
        </button>
      </motion.div>

      {/* Game Content */}
      <div className="game-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {getCurrentPhaseComponent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <motion.div
          className="connection-warning"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="warning-icon">⚠️</span>
          Connection lost. Trying to reconnect...
        </motion.div>
      )}
    </div>
  );
};

export default Game;
