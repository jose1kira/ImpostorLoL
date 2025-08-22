import React from 'react';
import { motion } from 'framer-motion';
import { GameState } from '../types/game';
import './EliminationPhase.css';

interface EliminationPhaseProps {
  gameState: GameState;
}

const EliminationPhase: React.FC<EliminationPhaseProps> = ({
  gameState
}) => {
  const eliminatedPlayer = gameState.eliminatedPlayer;
  const isImpostor = eliminatedPlayer?.role === 'impostor';
  const isChampion = eliminatedPlayer?.role === 'champion';

  return (
    <div className="elimination-phase">
      <motion.div
        className="elimination-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="phase-header">
          <h2 className="phase-title">⚰️ Elimination Phase</h2>
          <p className="phase-subtitle">The votes have been counted...</p>
        </div>

        {eliminatedPlayer && (
          <motion.div
            className="elimination-result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={`result-card ${isImpostor ? 'impostor' : 'champion'}`}>
              <div className="result-icon">
                {isImpostor ? '🎭' : '⚔️'}
              </div>
              <div className="result-info">
                <h3 className="eliminated-name">{eliminatedPlayer.name}</h3>
                <div className="role-reveal">
                  <span className="role-label">Role:</span>
                  <span className={`role-value ${isImpostor ? 'impostor' : 'champion'}`}>
                    {isImpostor ? 'Impostor' : 'Champion'}
                  </span>
                </div>
                {isChampion && (
                  <div className="champion-info">
                    <span className="champion-label">Secret Champion:</span>
                    <span className="champion-value">{eliminatedPlayer.secretChampion}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div className="elimination-message">
          <motion.div
            className="message-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {isImpostor ? (
              <>
                <h3>🎉 Champions Win!</h3>
                <p>
                  The Impostor has been successfully eliminated! 
                  The Champions' knowledge and teamwork prevailed.
                </p>
                <div className="victory-celebration">
                  <span className="celebration-icon">🏆</span>
                  <span className="celebration-text">Victory for the Champions!</span>
                </div>
              </>
            ) : (
              <>
                <h3>😱 A Champion Has Fallen!</h3>
                <p>
                  An innocent Champion has been eliminated! 
                  The Impostor is still among us, and the deception continues.
                </p>
                <div className="warning-message">
                  <span className="warning-icon">⚠️</span>
                  <span className="warning-text">The Impostor remains hidden!</span>
                </div>
              </>
            )}
          </motion.div>
        </div>

        <div className="game-status">
          <h3>📊 Game Status</h3>
          <div className="status-grid">
            <div className="status-item">
              <span className="status-label">Players Remaining:</span>
              <span className="status-value">
                {gameState.players.filter(p => p.isAlive).length}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Champions Alive:</span>
              <span className="status-value">
                {gameState.players.filter(p => p.isAlive && p.role === 'champion').length}
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Impostor Status:</span>
              <span className={`status-value ${gameState.players.find(p => p.role === 'impostor')?.isAlive ? 'alive' : 'eliminated'}`}>
                {gameState.players.find(p => p.role === 'impostor')?.isAlive ? 'Alive' : 'Eliminated'}
              </span>
            </div>
          </div>
        </div>

        <div className="next-round-info">
          <motion.div
            className="info-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {isImpostor ? (
              <>
                <h4>🎊 Game Complete!</h4>
                <p>The Champions have successfully identified and eliminated the Impostor!</p>
                <div className="final-stats">
                  <p><strong>Final Score:</strong> Champions 1 - Impostor 0</p>
                  <p><strong>Total Rounds:</strong> {gameState.currentRound}</p>
                </div>
              </>
            ) : (
              <>
                <h4>🔄 Next Round</h4>
                <p>The game will continue with the remaining players.</p>
                <div className="round-info">
                  <p><strong>Next Round:</strong> {gameState.currentRound + 1}</p>
                  <p><strong>Players Remaining:</strong> {gameState.players.filter(p => p.isAlive).length}</p>
                </div>
                <p className="strategy-hint">
                  Use the information from this elimination to refine your strategy!
                </p>
              </>
            )}
          </motion.div>
        </div>

        <div className="phase-footer">
          <p className="phase-hint">
            {isImpostor 
              ? 'The game is complete. You can leave or start a new game.'
              : 'The next round will begin automatically...'
            }
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EliminationPhase;
