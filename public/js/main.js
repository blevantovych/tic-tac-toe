/* globals WebSocket $ */
import './libraries/bling'
import { getSecondaryDiagonal, getMainDiagonal, getColumn } from './helpers'
import { createStore } from 'redux'

const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

var moves = []

const ws = new WebSocket('ws://localhost:3000')

const initialStore = {
  char: '',
  allowedToMove: false,
  isWinner: false
}

function reducer (state = initialStore, action) {
  switch (action.type) {
    case 'CHANGE_CHAR':
      return Object.assign({}, state, { char: action.char })
    case 'ALLOW_TO_MOVE':
      return Object.assign({}, state, { allowedToMove: action.allowedToMove })
    case 'SET_WINNER':
      return Object.assign({}, state, { isWinner: action.isWinner })
    default:
      return state
  }
}

let store = createStore(reducer)
store.subscribe(() =>
  console.log('Store changed', store.getState())
)
window.ws = ws

function handleMove (moveData) {
  console.log('moveData')
  console.log(moveData)
  const cell = $(`td[data-pos='${moveData.move}']`)[0]
  cell.classList.add('player' + moveData.player)
  setTimeout(() => {
    cell.classList.add('active')
  }, 100)
  const [x, y] = moveData.move.split('')
  moves.push(moveData.move)
  board[x][y] = moveData.player
  if (checkWin(board)) {
    informAboutWin(moveData.player)
    store.dispatch({ type: 'SET_WINNER', isWinner: true })
  } else {
    console.log('No winner yet')
  }
  console.log()
}

ws.onmessage = function (event) {
  const data = JSON.parse(event.data)
  console.log(data)
  switch (data.type) {
    case 'assignChar':
      store.dispatch({ type: 'CHANGE_CHAR', char: data.char })
      store.dispatch({ type: 'ALLOW_TO_MOVE', allowedToMove: data.allowedToMove })
      break
    case 'move':
      handleMove(data.move)
      store.dispatch({ type: 'ALLOW_TO_MOVE', allowedToMove: !store.getState().allowedToMove })
      break
    default:
      break
  }
}

ws.onclose = function () {
  console.log('connection closed')
}

function whereWinHappened (board) {
  if (allValuesTheSame(getMainDiagonal(board))) {
    return 'main-diagonal'
  }
  if (allValuesTheSame(getSecondaryDiagonal(board))) {
    return 'secondary-diagonal'
  }
  if (allValuesTheSame(getColumn(board, 0))) {
    return 'first-column'
  }
  if (allValuesTheSame(getColumn(board, 1))) {
    return 'middle-column'
  }
  if (allValuesTheSame(getColumn(board, 2))) {
    return 'third-column'
  }
  if (allValuesTheSame(board[0])) {
    return 'first-row'
  }
  if (allValuesTheSame(board[1])) {
    return 'middle-row'
  }
  if (allValuesTheSame(board[2])) {
    return 'third-row'
  }
}

const allValuesTheSame = arr => arr.indexOf('') === -1 && new Set(arr).size === 1

function checkDiagonals (board) {
  return allValuesTheSame(getMainDiagonal(board)) || allValuesTheSame(getSecondaryDiagonal(board))
}

function checkRows (board) {
  return board.map(allValuesTheSame).some(el => el === true)
}

function checkColumns (board) {
  return board.map((el, i) => allValuesTheSame(getColumn(board, i))).some(el => el === true)
}

function checkWin (board) {
  return [checkColumns, checkRows, checkDiagonals].map(f => f(board)).some(el => el === true)
}

function informAboutWin (char) {
  const crossClass = whereWinHappened(board)
  console.log(`Winner: ${char}`)
  const resultInfo = document.createElement('h3')
  resultInfo.classList.add('info')
  resultInfo.textContent = `${char} is winner!`
  $('body')[0].appendChild(resultInfo)
  // $('td').off('click', clickListener)
  $('table')[0].classList.add(crossClass)
}

$('td').on('click', function clickListener () {
  const [x, y] = this.getAttribute('data-pos').split('')
  if (board[x][y] === '' && store.getState().allowedToMove && !store.getState().isWinner) {
    store.dispatch({ type: 'ALLOW_TO_MOVE', allowedToMove: !store.getState().allowedToMove })
    this.classList.add('player' + store.getState().char) // global char (server assigns it)
    setTimeout(() => {
      this.classList.add('active')
    }, 100)

    if (ws.readyState === 1) { // connection is open
      ws.send(JSON.stringify({
        type: 'move',
        player: store.getState().char,
        move: x + y
      }))
      moves.push(x + y)
    }
    board[x][y] = store.getState().char
    if (checkWin(board)) {
      informAboutWin(store.getState().char)
      store.dispatch({ type: 'ALLOW_TO_MOVE', allowedToMove: false })
      store.dispatch({ type: 'SET_WINNER', isWinner: true })
      ws.send(JSON.stringify({
        type: 'gameover',
        moves
      }))
    } else {
      console.log('No winner yet')
    }
  }
})
