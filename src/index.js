import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



/*
TODOS

1. (done) Display the location for each move in the format (col, row) in the move history list.

2. (done) Bold the currently selected item in the move list.

3. (done) Rewrite Board to use two loops to make the squares instead of hardcoding them.

4. (done) Add a toggle button that lets you sort the moves in either ascending or descending order.

5. When someone wins, highlight the three squares that caused the win.

6. When no one wins, display a message about the result being a draw.

*/


// class Square extends React.Component {
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

// Function Component - simple method when no state is involved
function Square(props) {
  return (
    <button
      className={"square " + (props.value === props.winner ? 'highlight' : '')}
      onClick={props.onClick}>
        {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRow(start) {
    const row = [start, start + 1, start + 2];
    row.map((i) => {
      return (
        this.renderSquare(i)
      );
    });

    return (
      <div className="board-row">
        {row}
      </div>
    );
  }

  renderBoard() {
    let board = [];
    // columns
    for (let i = 0; i < 9; i += 3) {
      // rows
      let rows = [];
      for (let j = i; j < i + 3; j++) {
        rows.push(this.renderSquare(j));
      }
      board.push(<div className="board-row">{rows}</div>);
    }
    return board;
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares:  Array(9).fill(null),
        col:      null,
        row:      null
      }],
      stepNumber: 0,
      xIsNext: true,
      winningSquares: [],
      winner: ''
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const col     = this.calcCol(i);
    const row     = this.calcRow(i);

    // early exit
    if (calculateWinner(squares) || squares[i]) return;

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares,
        col,
        row
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  calcCol(i) {
    const numColumns = 3;
    return (i % numColumns) + 1;
  }

  calcRow(i) {
    const row1 = 3;
    const row2 = 6;
    const row3 = 9;

    let row;

    if (i < row1) {
      row = 1;
    } else if (i < row2) {
      row = 2;
    } else if (i < row3) {
      row = 3;
    }

    return row;
  }

  flipOrder(history) {
    this.setState({
      history: history.reverse()
    });
  }

  setWinner(winner) {
    this.setState({
      winner: winner
    });
  }

  render() {
    const history = this.state.history;
    const length  = history.length;
    const current = history[this.state.stepNumber];
    const winner  = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move # ${move} (${step.col}, ${step.row})`:
        'Go to game start';
      return (
        <li key={move}>
          <button
            className={move === length - 1 ? 'bold' : ''}
            onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    let squares;
    if (winner) {
      status = 'Winner: ' + winner.who;
      // TODO: highlight winning squares
      squares = winner.squares;
      this.setWinner(winner.who);
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.flipOrder(this.state.history)}>Flip Order</button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        who: squares[a],
        squares: lines[i]
      };
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
