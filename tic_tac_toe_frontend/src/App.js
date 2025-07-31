import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Modern, light-themed Tic Tac Toe game with:
 * - Interactive 3x3 grid
 * - Two player (X vs O), local play
 * - Win/draw detection
 * - Game state display (status, current player, winner/draw)
 * - Restart/Reset button
 */

/**
 * Returns the winner letter ("X" or "O") if present, or "Draw" if draw, or null.
 * @param {string[]} squares array of squares of the board
 */
function calculateWinner(squares) {
  // PUBLIC_INTERFACE
  // Winning combinations for 3x3 tic tac toe
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (
      squares[a] && 
      squares[a] === squares[b] && 
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return squares.every(Boolean) ? "Draw" : null;
}

// PUBLIC_INTERFACE
function Square({ value, onClick, disabled }) {
  /** Renders a single tic tac toe square. */
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      disabled={disabled || Boolean(value)}
      aria-label={value ? `Cell containing ${value}` : `Empty board cell`}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, disabled }) {
  /** Renders the 3x3 tic tac toe board. */
  return (
    <div className="ttt-board">
      {squares.map((val, idx) => (
        <Square
          key={idx}
          value={val}
          onClick={() => onSquareClick(idx)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Theme management (light/dark, maintain compatibility with starter)
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Game state
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [current, setCurrent] = useState("X"); // "X" always starts
  const winner = calculateWinner(squares);

  /**
   * Handles a user clicking a square. Applies only if move is allowed.
   * @param {number} idx - index of square (0..8)
   */
  const handleSquareClick = (idx) => {
    if (squares[idx] || winner) return; // Ignore if occupied or game over
    const next = squares.slice();
    next[idx] = current;
    setSquares(next);
    setCurrent((prev) => (prev === "X" ? "O" : "X"));
  };

  /**
   * Resets game board and state to initial.
   */
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setCurrent("X");
  };

  // Message displayed above board
  let status;
  if (winner && winner !== "Draw") {
    status = (
      <span>
        <strong>Winner: {winner}</strong> 🎉
      </span>
    );
  } else if (winner === "Draw") {
    status = <span><strong>It's a draw!</strong> 🤝</span>;
  } else {
    status = (
      <span>
        Next player:&nbsp;
        <strong
          style={{
            color: current === "X" ? "var(--primary, #1976d2)" : "var(--accent, #43a047)"
          }}
        >
          {current}
        </strong>
      </span>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status">{status}</div>
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          disabled={Boolean(winner)}
        />
        <button
          className="ttt-restart-btn"
          onClick={handleRestart}
          aria-label="Restart the game"
        >
          Restart Game
        </button>
        <div className="ttt-footer">
          <span>
            Local two-player. Modern UI. <span style={{ color: "var(--primary, #1976d2)" }}>X</span> vs <span style={{ color: "var(--accent, #43a047)" }}>O</span>
          </span>
        </div>
      </header>
    </div>
  );
}

export default App;
