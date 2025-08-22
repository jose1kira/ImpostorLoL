# Impostor: League of Legends Edition

A real-time, web-based social deduction game set in the world of League of Legends. Find the Impostor who doesn't know the secret champion!

## 🎮 How to Play

The game is simple. Champions must work together to identify the Impostor, while the Impostor must bluff their way to victory.

### 1. The Lobby
- **Create or Join:** One player creates a game and shares the unique **Game ID** with friends. Others join using that ID.
- **Gather Your Team:** A minimum of 3 players is required to start the match.
- **Launch the Game:** The host (the player who created the game) starts the game once everyone is ready.

### 2. The Round
- **🤫 Secret Roles:** At the start of each round, one player is secretly assigned the role of **Impostor**. All other players become **Champions** and are shown the name of a secret League of Legends champion.
- **🗣️ Discussion & Deception:** Players discuss amongst themselves. Champions should ask questions about the secret champion to test each other's knowledge. The Impostor, who doesn't know the champion, must lie, deflect, and act like they know to avoid suspicion.
- **🗳️ Voting:** After the discussion, everyone votes for who they think the Impostor is. You cannot vote for yourself.

### 3. The Verdict
- **Elimination:** The player with the most votes is eliminated, and their true role is revealed to everyone.
- **Tie:** If the vote is a tie, no one is eliminated, and the discussion continues in the next round.

### 🏆 Winning the Game
- **✨ Champions Win** if they successfully vote out the Impostor.
- **🔪 Impostor Wins** if they survive until only two players (themselves and one Champion) remain.

## ✨ Features

- **Real-Time Multiplayer:** Seamlessly connect and play with friends from anywhere.
- **Dynamic Role Assignment:** Roles are randomized every game for maximum replayability.
- **Thematic UI:** A polished interface inspired by the League of Legends "Hextech" aesthetic.
- **Zero Backend:** Runs entirely in the browser using a public MQTT broker for communication—no server hosting required!
- **Built with Modern Tech:** A fast, reliable, and responsive experience built on React and TypeScript.

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ImpostorLoL
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to start playing!

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🌐 Multiplayer Setup

### For Local Testing
1. Open the game in multiple browser tabs/windows
2. Create a game in one tab
3. Copy the Game ID and join from other tabs
4. All tabs will connect to the same MQTT broker

### For Online Play
1. Deploy the built game to a web hosting service (Netlify, Vercel, GitHub Pages, etc.)
2. Share the URL with friends
3. The game automatically connects to a public MQTT broker
4. No additional server setup required!

## 🎯 Game Strategy Tips

### For Champions:
- Ask specific questions about champion abilities, lore, or gameplay mechanics
- Test others' knowledge with detailed questions
- Look for hesitation or vague answers
- Share your own knowledge confidently

### For Impostor:
- Listen carefully to others' answers
- Give plausible but non-specific responses
- Ask questions to deflect suspicion
- Act confident but not overly knowledgeable

## 🛠️ Technical Details

### Architecture
- **Frontend:** React 18 + TypeScript
- **Styling:** CSS with CSS Variables for theming
- **Animations:** Framer Motion for smooth transitions
- **Communication:** MQTT over WebSocket for real-time multiplayer
- **Build Tool:** Vite for fast development and building

### MQTT Configuration
The game uses a public MQTT broker (`wss://broker.emqx.io:8084/mqtt`) for real-time communication. This means:
- No server hosting required
- Works across different networks
- Automatic reconnection handling
- Secure WebSocket connection

### Browser Compatibility
- Modern browsers with ES2020 support
- Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- Mobile browsers supported

## 📱 Responsive Design

The game is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All screen sizes

## 🎨 Customization

### Themes
The game uses CSS variables for easy theming. Modify the colors in `src/index.css` to create your own theme:

```css
:root {
  --primary: #c9aa71;      /* Main accent color */
  --secondary: #1e2328;    /* Secondary background */
  --accent: #f4c874;       /* Highlight color */
  --text: #f0e6d2;         /* Main text color */
  --background: #0a1428;    /* Main background */
}
```

### Champions
Add or modify champions in `src/services/gameService.ts`:

```typescript
const CHAMPIONS: Champion[] = [
  { name: 'NewChampion', title: 'the New Title', role: 'Mage', difficulty: 'Moderate', region: 'New Region' },
  // ... existing champions
];
```

## 🐛 Troubleshooting

### Connection Issues
- Ensure your internet connection is stable
- Check if the MQTT broker is accessible
- Try refreshing the page
- Check browser console for error messages

### Game Not Starting
- Ensure at least 3 players have joined
- Check that the host is present
- Verify all players are connected (green connection indicator)

### Performance Issues
- Close other browser tabs
- Ensure you're using a modern browser
- Check if your device meets the minimum requirements

## 🤝 Contributing

Contributions are welcome! Here are some areas where you can help:

- **Bug fixes and improvements**
- **New features and game modes**
- **UI/UX enhancements**
- **Performance optimizations**
- **Documentation improvements**

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **League of Legends** - For the amazing champion universe
- **MQTT.js** - For reliable real-time communication
- **Framer Motion** - For beautiful animations
- **React Team** - For the amazing framework

## 📞 Support

If you encounter any issues or have questions:
- Check the troubleshooting section above
- Review the browser console for error messages
- Create an issue in the repository

---

**Ready to test your deception skills? Gather your friends and start playing Impostor: League of Legends Edition!** 🎮⚔️
