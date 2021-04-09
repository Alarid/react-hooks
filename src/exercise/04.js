// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

const INITIAL_SQUARES = Array(9).fill(null)

/**
 * Board Component
 * Render the 3x3 board with the X and O played
 */
function Board({onClick, squares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

/**
 * Button representing a move in the game history
 * Clickable to go back to this step
 */
function MoveButton({step, isCurrent, onClick}) {
  const isCurrentPrefix = isCurrent ? '(current)' : null
  const description = step === 0 ? `Go to game start` : `Go to move #${step}`
  return (
    <li>
      <button disabled={isCurrent} onClick={() => onClick(step)}>
        {description} {isCurrentPrefix}
      </button>
    </li>
  )
}

/**
 * Game component
 */
function Game() {
  const [history, setHistory] = useLocalStorageState('tic-tac-toe:history', [
    INITIAL_SQUARES,
  ])
  const [currentStep, setCurrentStep] = useLocalStorageState(
    'tic-tac-toe:step',
    0,
  )

  const squares = history[currentStep]
  const winner = calculateWinner(squares)
  const nextValue = calculateNextValue(squares)
  const status = calculateStatus(winner, squares, nextValue)

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }

    // 🦉 It's typically a bad idea to mutate or directly change state in React.
    // Doing so can lead to subtle bugs that can easily slip into production.
    const squaresCopy = [...squares]
    squaresCopy[square] = nextValue

    const newHistory = history.slice(0, currentStep + 1)
    setHistory([...newHistory, squaresCopy])
    setCurrentStep(currentStep + 1)
  }

  function restart() {
    setHistory([INITIAL_SQUARES])
    setCurrentStep(0)
  }

  function goToStep(index) {
    setCurrentStep(index)
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={squares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          {history.map((_, idx) => (
            <MoveButton
              key={idx}
              step={idx}
              isCurrent={idx === currentStep}
              onClick={goToStep}
            />
          ))}
        </ol>
      </div>
    </div>
  )
}

/**
 * Utils functions
 */
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

/**
 * Main app
 */
function App() {
  return <Game />
}

export default App
