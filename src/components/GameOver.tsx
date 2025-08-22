import React from 'react';
import { motion } from 'framer-motion';
import { GameState, Player } from '../types/game';
import './GameOver.css';

interface GameOverProps {
  gameState: GameState;
  currentPlayer: Player;
  onLeaveGame: () => void;
  onGameOver: () => void;
}

const GameOver: React.FC<GameOverProps> = ({
  gameState,
  currentPlayer,
  onLeaveGame,
  onGameOver
}) => {
  const winner = gameState.winner;
  const isChampion = currentPlayer.role === 'champion';
  const isImpostor = currentPlayer.role === 'impostor';
  const isWinner = (winner === 'champions' && isChampion) || (winner === 'impostor' && isImpostor);

  const getWinnerMessage = () => {
    if (winner === 'champions') {
      return {
        title: '🎉 Champions Win!',
        subtitle: 'The Impostor has been eliminated!',
        description: 'Your knowledge of League of Legends and teamwork prevailed. The Champions successfully identified and eliminated the Impostor!',
        icon: '🏆',
        color: 'success'
      };
    } else {
      return {
        title: '🔪 Impostor Wins!',
        subtitle: 'The deception was successful!',
        description: 'The Impostor managed to survive until the end, outsmarting the Champions through cunning deception and manipulation.',
        icon: '🎭',
        color: 'danger'
      };
    }
  };

  const winnerInfo = getWinnerMessage();

  return (
    <div className="game-over">
      <motion.div
        className="game-over-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="game-over-header">
          <h2 className="game-over-title">Game Over</h2>
          <p className="game-over-subtitle">The deception has ended</p>
        </div>

        <motion.div
          className={`winner-announcement ${winnerInfo.color}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="winner-icon">{winnerInfo.icon}</div>
          <h3 className="winner-title">{winnerInfo.title}</h3>
          <p className="winner-subtitle">{winnerInfo.subtitle}</p>
          <p className="winner-description">{winnerInfo.description}</p>
        </motion.div>

        <div className="player-result">
          <motion.div
            className={`result-card ${isWinner ? 'winner' : 'loser'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="result-header">
              <span className="result-icon">{isWinner ? '🎊' : '😔'}</span>
              <h4 className="result-title">
                {isWinner ? 'You Won!' : 'You Lost'}
              </h4>
            </div>
            <div className="result-details">
              <p><strong>Your Role:</strong> {currentPlayer.role === 'champion' ? 'Champion' : 'Impostor'}</p>
              {currentPlayer.role === 'champion' && (
                <p><strong>Secret Champion:</strong> {currentPlayer.secretChampion}</p>
              )}
              <p><strong>Game Result:</strong> {winner === 'champions' ? 'Champions Victory' : 'Impostor Victory'}</p>
            </div>
          </motion.div>
        </div>

        <div className="final-game-stats">
          <h3>📊 Final Game Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Rounds</span>
              <span className="stat-value">{gameState.currentRound}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Players Started</span>
              <span className="stat-value">{gameState.players.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Champions</span>
              <span className="stat-value">
                {gameState.players.filter(p => p.role === 'champion').length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Impostor</span>
              <span className="stat-value">1</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Eliminated</span>
              <span className="stat-value">
                {gameState.players.filter(p => !p.isAlive).length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Winner</span>
              <span className={`stat-value ${winner === 'champions' ? 'success' : 'danger'}`}>
                {winner === 'champions' ? 'Champions' : 'Impostor'}
              </span>
            </div>
          </div>
        </div>

        <div className="player-roles-reveal">
          <h3>👥 Final Player Roles</h3>
          <div className="roles-grid">
            {gameState.players.map((player) => (
              <motion.div
                key={player.id}
                className={`role-card ${player.role} ${player.id === currentPlayer.id ? 'current' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + (gameState.players.indexOf(player) * 0.1) }}
              >
                <div className="role-icon">
                  {player.role === 'champion' ? '⚔️' : '🎭'}
                </div>
                <div className="role-info">
                  <span className="player-name">{player.name}</span>
                  <span className={`role-badge ${player.role}`}>
                    {player.role === 'champion' ? 'Champion' : 'Impostor'}
                  </span>
                  {player.id === currentPlayer.id && <span className="current-badge">You</span>}
                  {player.isHost && <span className="host-badge">Host</span>}
                </div>
                {player.role === 'champion' && (
                  <div className="champion-secret">
                    {player.secretChampion}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="game-over-actions">
          <motion.div
            className="actions-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3>🎮 What's Next?</h3>
            <div className="action-buttons">
              <button className="btn btn-primary btn-large" onClick={onGameOver}>
                🚀 Play Again
              </button>
              <button className="btn btn-secondary btn-large" onClick={onLeaveGame}>
                🏠 Back to Lobby
              </button>
            </div>
            <p className="action-hint">
              Share your victory (or defeat) with friends and challenge them to a rematch!
            </p>
          </motion.div>
        </div>

        <div className="game-over-footer">
          <p className="footer-text">
            Thanks for playing Impostor: League of Legends Edition!
          </p>
          <p className="footer-subtext">
            Test your knowledge, hone your deception skills, and may the best player win!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default GameOver;
