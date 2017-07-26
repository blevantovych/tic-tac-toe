require('./bling');
const { getSecondaryDiagonal, getMainDiagonal, getRow, getColumn } = require('./helpers');

const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let moves = 0;

$('td').on('click', function() {
    const [x, y] = this.getAttribute('data-pos').split('');
    board[x][y] = ++moves % 2 ? 'X' : '0';
    console.table(board);
});


