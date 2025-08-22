import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import './Lobby.css';

interface LobbyProps {
  onCreateGame: (playerName: string) => void;
  onJoinGame: (gameId: string, playerName: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ onCreateGame, onJoinGame }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsLoading(true);
    try {
      await onCreateGame(playerName.trim());
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !gameId.trim()) return;

    setIsLoading(true);
    try {
      await onJoinGame(gameId.trim(), playerName.trim());
    } finally {
      setIsLoading(false);
    }
  };

  const generateGameId = () => {
    setGameId(uuidv4().substring(0, 8).toUpperCase());
  };

  return (
    <div className="lobby">
      <motion.div
        className="lobby-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="lobby-header">
          <h2 className="lobby-title">Welcome to the Rift</h2>
          <p className="lobby-subtitle">
            Gather your team and prepare for the ultimate test of deception
          </p>
        </div>

        <div className="lobby-tabs">
          <button
            className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            <span className="tab-icon">⚔️</span>
            Create Game
          </button>
          <button
            className={`tab-button ${activeTab === 'join' ? 'active' : ''}`}
            onClick={() => setActiveTab('join')}
          >
            <span className="tab-icon">🛡️</span>
            Join Game
          </button>
        </div>

        <div className="lobby-content">
          {activeTab === 'create' ? (
            <motion.form
              className="lobby-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleCreateGame}
            >
              <div className="form-group">
                <label htmlFor="create-player-name" className="form-label">
                  Your Champion Name
                </label>
                <input
                  id="create-player-name"
                  type="text"
                  className="form-input"
                  placeholder="Enter your summoner name..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  required
                  maxLength={20}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={!playerName.trim() || isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner">⚡</span>
                ) : (
                  'Create Game'
                )}
              </button>

              <div className="form-info">
                <p>🎮 Minimum 3 players required to start</p>
                <p>🌟 You'll be the host and can start the game</p>
              </div>
            </motion.form>
          ) : (
            <motion.form
              className="lobby-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleJoinGame}
            >
              <div className="form-group">
                <label htmlFor="join-player-name" className="form-label">
                  Your Champion Name
                </label>
                <input
                  id="join-player-name"
                  type="text"
                  className="form-input"
                  placeholder="Enter your summoner name..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  required
                  maxLength={20}
                />
              </div>

              <div className="form-group">
                <label htmlFor="game-id" className="form-label">
                  Game ID
                </label>
                <div className="input-group">
                  <input
                    id="game-id"
                    type="text"
                    className="form-input"
                    placeholder="Enter game ID..."
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value.toUpperCase())}
                    required
                    maxLength={8}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={generateGameId}
                  >
                    Generate
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={!playerName.trim() || !gameId.trim() || isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner">⚡</span>
                ) : (
                  'Join Game'
                )}
              </button>

              <div className="form-info">
                <p>🔗 Ask the host for the Game ID</p>
                <p>⏳ Wait for the host to start the game</p>
              </div>
            </motion.form>
          )}
        </div>

        <div className="lobby-features">
          <h3 className="features-title">Game Features</h3>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🌐</span>
              <h4>Real-time Multiplayer</h4>
              <p>Play with friends from anywhere in the world</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎭</span>
              <h4>Social Deduction</h4>
              <p>Find the impostor or deceive your way to victory</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚔️</span>
              <h4>LoL Champions</h4>
              <p>Test your knowledge of League of Legends</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚀</span>
              <h4>No Downloads</h4>
              <p>Play directly in your browser</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Lobby;
