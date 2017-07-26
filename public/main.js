require('./bling');
const { getSecondaryDiagonal, getMainDiagonal, getRow, getColumn } = require('./helpers');
const getters = [getSecondaryDiagonal, getMainDiagonal, getRow, getColumn];

const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let moves = 0;

const allValuesTheSame = arr => arr.indexOf('') === -1 && new Set(arr.filter(el => el !== '')).size === 1;

function checkDiagonals(board) {
    return allValuesTheSame(getMainDiagonal(board)) || allValuesTheSame(getSecondaryDiagonal(board));
}

function checkRows(board) {
    return board.map(allValuesTheSame).some(el => el === true)
}

function checkColumns(board) {
    return board.map((el, i) => allValuesTheSame(getColumn(board, i))).some(el => el === true);
}

function checkWin(board) {
    if ([checkColumns, checkRows, checkDiagonals].map(f => f(board)).some(el => el === true)) {
        console.log('There is a winner!');
    } else {
        console.log('No winner yet');
    }
}

$('td').on('click', function() {
    const [x, y] = this.getAttribute('data-pos').split('');
    const char = ++moves % 2 ? 'X' : '0';
    board[x][y] = char;
    checkWin(board);
    this.textContent = char;
});
