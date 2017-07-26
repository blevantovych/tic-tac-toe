(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// https://gist.github.com/paulirish/12fb951a8b893a454b32
window.$ = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = function (name, fn) {
  this.addEventListener(name, fn);
}

NodeList.prototype.__proto__ = Array.prototype;

NodeList.prototype.on = NodeList.prototype.addEventListener = function (name, fn) {
  this.forEach(function (elem, i) {
    elem.on(name, fn);
  });
}
},{}],2:[function(require,module,exports){
exports.getSecondaryDiagonal = twoDimArr => twoDimArr.map((el, i, arr) => twoDimArr[i][arr.length - 1 - i])
exports.getMainDiagonal = twoDimArr => twoDimArr.map((el, i) => twoDimArr[i][i])
exports.getRow = (twoDimArr, rowNum) => twoDimArr[rowNum];
exports.getColumn = (twoDimArr, colNum) => twoDimArr.map((el, i) => twoDimArr[i][colNum]);
},{}],3:[function(require,module,exports){
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



},{"./bling":1,"./helpers":2}]},{},[3]);
