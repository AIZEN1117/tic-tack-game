const state = {
  board: Array(9).fill(null),
  currentPlayer: 'X',
  isOver: false,
  scores: { X: 0, O: 0, D: 0 },
};

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

const cells = Array.from(document.querySelectorAll('.cell'));
const currentPlayerEl = document.getElementById('currentPlayer');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreDrawEl = document.getElementById('scoreDraw');
const winnerMessageEl = document.getElementById('winnerMessage');
const resetRoundBtn = document.getElementById('resetRound');
const newGameBtn = document.getElementById('newGame');

cells.forEach(cell => cell.addEventListener('click', onCellClick));
resetRoundBtn.addEventListener('click', resetRound);
newGameBtn.addEventListener('click', newGame);

function render() {
  cells.forEach((cell, idx) => {
    cell.textContent = state.board[idx] ?? '';
    cell.disabled = !!state.board[idx] || state.isOver;
    cell.classList.remove('win','draw');
  });
  currentPlayerEl.textContent = state.currentPlayer;
  scoreXEl.textContent = state.scores.X;
  scoreOEl.textContent = state.scores.O;
  scoreDrawEl.textContent = state.scores.D;
  if (!state.isOver) winnerMessageEl.textContent = '';
}

function onCellClick(e) {
  const idx = Number(e.currentTarget.dataset.index);
  if (state.board[idx] || state.isOver) return;
  state.board[idx] = state.currentPlayer;

  const result = evaluateBoard(state.board);
  if (result.status === 'win') {
    state.isOver = true;
    state.scores[result.winner]++;
    highlightWin(result.line);
    winnerMessageEl.textContent = `🎉 Player ${result.winner} Wins!`;
  } else if (result.status === 'draw') {
    state.isOver = true;
    state.scores.D++;
    highlightDraw();
    winnerMessageEl.textContent = `🤝 It's a Draw!`;
  } else {
    state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
  }
  render();
}

function evaluateBoard(board) {
  for (const line of WIN_LINES) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { status:'win', winner:board[a], line };
    }
  }
  if (board.every(v => v)) return { status:'draw' };
  return { status:'ongoing' };
}

function highlightWin(line) {
  line.forEach(idx => cells[idx].classList.add('win'));
}
function highlightDraw() {
  cells.forEach(cell => cell.classList.add('draw'));
}

function resetRound() {
  state.board = Array(9).fill(null);
  state.isOver = false;
  state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
  winnerMessageEl.textContent = '';
  render();
}

function newGame() {
  state.board = Array(9).fill(null);
  state.isOver = false;
  state.currentPlayer = 'X';
  state.scores = { X:0, O:0, D:0 };
  winnerMessageEl.textContent = '';
  render();
}

render();
