exports.getSecondaryDiagonal = twoDimArr => twoDimArr.map((el, i, arr) => twoDimArr[i][arr.length - 1 - i])
exports.getMainDiagonal = twoDimArr => twoDimArr.map((el, i) => twoDimArr[i][i])
exports.getRow = (twoDimArr, rowNum) => twoDimArr[rowNum];
exports.getColumn = (twoDimArr, colNum) => twoDimArr.map((el, i) => twoDimArr[i][colNum]);