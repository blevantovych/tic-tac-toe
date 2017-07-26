require('./bling');
const { getSecondaryDiagonal, getMainDiagonal, getRow, getColumn } = require('./helpers');

const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let moves = 0;

function whereWinHappened(board) {
    if (allValuesTheSame(getMainDiagonal(board))) {
        return 'main-diagonal';
    }
    if (allValuesTheSame(getSecondaryDiagonal(board))) {
        return 'secondary-diagonal';
    }
    if (allValuesTheSame(getColumn(board, 0))) {
        return 'first-column';
    }
    if (allValuesTheSame(getColumn(board, 1))) {
        return 'middle-column';
    }
    if (allValuesTheSame(getColumn(board, 2))) {
        return 'third-column';
    }
    if (allValuesTheSame(board[0])) {
        return 'first-row';
    }
    if (allValuesTheSame(board[1])) {
        return 'middle-row';
    }
    if (allValuesTheSame(board[2])) {
        return 'third-row';
    }
}

const allValuesTheSame = arr => arr.indexOf('') === -1 && new Set(arr).size === 1;

function checkDiagonals(board) {
    return allValuesTheSame(getMainDiagonal(board)) || allValuesTheSame(getSecondaryDiagonal(board));
}

function checkRows(board) {
    return board.map(allValuesTheSame).some(el => el === true);
}

function checkColumns(board) {
    return board.map((el, i) => allValuesTheSame(getColumn(board, i))).some(el => el === true);
}

function checkWin(board) {
    return [checkColumns, checkRows, checkDiagonals].map(f => f(board)).some(el => el === true);
}

$('td').on('click', function clickListener() {
    const [x, y] = this.getAttribute('data-pos').split('');
    if (board[x][y] === '') {
        const char = ++moves % 2 ? 'X' : '0';
        this.classList.add('player' + char);
        setTimeout(() => {
            this.classList.add('active');
        }, 100);
        board[x][y] = char;
        if (checkWin(board)) {
            const crossClass = whereWinHappened(board);
            console.log(`Winner: ${char}`);
            const resultInfo = document.createElement('h3');
            resultInfo.classList.add('info');
            resultInfo.textContent = `${char} is winner!`;
            $('body')[0].appendChild(resultInfo);
            $('td').off('click', clickListener);
            $('table')[0].classList.add(crossClass);
        } else {
            console.log('No winner yet');
        }
    } 
});
