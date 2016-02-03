var Game = function() {
  // Game logic and initialization here
  this.board = [[0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]];
  this.dims = [4, 4];
  this.score = 0;
  this.hasMoved = false;
};

Game.prototype.play = function() {

};

Game.prototype.moveTiles = function(direction) {
  this.hasMoved = false;
  // Game method here
  switch(direction) {
    case 38: //up
      for (var i = 0; i < this.dims[1]; i++) {
        this.moveColumnUp(i);
      }
      break;
    case 40: //down
      this.moveTileDown(tile);
      break;
    case 37: //left
    for (var i = 0; i < this.dims[0]; i++) {
      this.moveRowLeft(i);
    }
      break;
    case 39: //right
    for (var i = 0; i < this.dims[0]; i++) {
      this.moveRowRight(i);
    }
      break;
  }
};

// Game.prototype.rcVal = function (rowIndex, columnIndex) {
//   return this.board[rowIndex][columnIndex];
// };
//
// Game.prototype.crVal = function (columnIndex, rowIndex) {
//   return this.board[rowIndex][columnIndex];
// };

// if dim = 0, index0 is row and index1 is col
// if dim = 1, index0 is col and index1 is row
Game.prototype.getValue = function (dim, index0, index1) {
  switch(dim) {
    case 0:
      return this.board[index0][index1];
    case 1:
      return this.board[index1][index0];
  }
};

// if dim = 0, index0 is row and index1 is col
// if dim = 1, index0 is col and index1 is row
Game.prototype.setValue = function (dim, index0, index1, value) {
  switch(dim) {
    case 0:
       this.board[index0][index1] = value;
       break;
    case 1:
       this.board[index1][index0] = value;
       break;
  }
};

// if dim = 0, get row
// if dim = 1, get col
Game.prototype.getValsByDim = function(dim, index) {
  var vals = [];
  var indices = [];
  for (var i = 0; i < this.dims[1-dim]; i++) {
    var val = this.getValue(dim, index, i);
    if (val !== 0) {vals.push(val); indices.push(i); }
  }
  return [vals, indices];
};

Game.prototype.setValsByDim = function(dim, index, values) {
  var vals = [];
  var indices = [];
  var i;
  for (i = 0; i < values.length; i++) {
    this.setValue(dim, index, i, values[i]);
  }
  //pick up where i left off in case we need to add 0s
  for (i; i < this.dims[1-dim]; i++) {
    this.setValue(dim, index, i, 0);
  }
};

Game.prototype.smash = function(valsIn) {
  if (valsIn.length === 0) { return [ [], [] ]; }
  var valsOut = [valsIn[0]];
  var indicesOut = [0];
  var alreadySmashed = false;
  for (var i = 1; i < valsIn.length; i++) {
    if (valsIn[i] === valsOut[valsOut.length-1] && !alreadySmashed) {
      valsOut[valsOut.length-1] *= 2;
      alreadySmashed = true;
      indicesOut.push(indicesOut[indicesOut.length-1]);
      this.score += valsOut[valsOut.length-1];
    } else {
      alreadySmashed = false;
      indicesOut.push(indicesOut[indicesOut.length-1] + 1);
      valsOut.push(valsIn[i]);
    }
  }
  return [valsOut, indicesOut];
};

Game.prototype.moveColumnUp = function(columnIndex) {
  console.log("moving column " + columnIndex);
  var valsAndIndicesIn = this.getValsByDim(1, columnIndex);
  console.log(valsAndIndicesIn);
  var valsIn = valsAndIndicesIn[0];
  var indicesIn = valsAndIndicesIn[1];
  var valsandIndicesOut = this.smash(valsIn);
  console.log(valsandIndicesOut);
  var valsOut = valsandIndicesOut[0];
  var indicesOut = valsandIndicesOut[1];
  this.setValsByDim(1, columnIndex, valsOut);
  //loop over indices in and indices out to see if they are the same. if they are, then nothing has moved!
  for (var i = 0; i < indicesIn.length; i++){
    var tileQuery = $(tileSelect(indicesIn[i], columnIndex));
    //if I am smashed into, delete myself
    if (i < indicesIn.length - 1) {
      if (indicesOut[i] === indicesOut[i+1]) {
        tileQuery[0].remove();
      }
    }
    // if i smashed into someone
    if (i >= 1) {
      if (indicesOut[i] === indicesOut[i-1]) {
        var newVal = valsOut[indicesOut[i]];
        console.log("I smashed and am now a " + newVal);
        console.log(tileQuery);
        console.log(tileQuery[0]);
        tileQuery.text(newVal);
        tileQuery[0].setAttribute("data-val", newVal);
      }
    }
    if (indicesIn[i] !== indicesOut[i]) {
      console.log(tileQuery);
      console.log(tileQuery[0]);
      tileQuery[0].setAttribute("data-row", ("r" + indicesOut[i]));
      this.hasMoved = true;
    }
  }


//   var valid = true;
//   while (valid) {
//     var y = parseInt($(".tile").attr("data-row").slice(-1));
//     var newY = parseInt($(".tile").attr("data-row").slice(-1)) - 1;
//     var x = parseInt($(".tile").attr("data-col").slice(-1));
//
//     if (newY >= 0 && this.board[newY][x] === 0) {
//       tile[0].setAttribute("data-row", ("r" + newY));
//       this.board[newY][x] = this.board[y][x];
//       this.board[y][x] = 0;
//     } else {
//       valid = false;
//     }
// }
};

Game.prototype.moveRowRight = function(rowIndex) {
  console.log("moving column " + rowIndex);
  var valsAndIndicesIn = this.getValsByDim(0, rowIndex);
  console.log(valsAndIndicesIn);
  var valsIn = valsAndIndicesIn[0];
  var indicesIn = valsAndIndicesIn[1];
  var valsandIndicesOut = this.smash(valsIn);
  console.log(valsandIndicesOut);
  var valsOut = valsandIndicesOut[0];
  var indicesOut = valsandIndicesOut[1];
  this.setValsByDim(0, rowIndex, valsOut);
  //loop over indices in and indices out to see if they are the same. if they are, then nothing has moved!
  for (var i = 0; i < indicesIn.length; i++){
    var tileQuery = $(tileSelect(indicesIn[i], rowIndex));
    //if I am smashed into, delete myself
    if (i < indicesIn.length - 1) {
      if (indicesOut[i] === indicesOut[i+1]) {
        tileQuery[0].remove();
      }
    }
    // if i smashed into someone
    if (i >= 1) {
      if (indicesOut[i] === indicesOut[i-1]) {
        var newVal = valsOut[indicesOut[i]];
        console.log("I smashed and am now a " + newVal);
        console.log(tileQuery);
        console.log(tileQuery[0]);
        tileQuery.text(newVal);
        tileQuery[0].setAttribute("data-val", newVal);
      }
    }
    if (indicesIn[i] !== indicesOut[i]) {
      console.log(tileQuery);
      console.log(tileQuery[0]);
      tileQuery[0].setAttribute("data-col", ("c" + indicesOut[i]));
      this.hasMoved = true;
    }
  }

  //
  // Game.prototype.moveTileRight = function(tile) {
  //   var valid = true;
  //   while (valid) {
  //     var y = parseInt($(".tile").attr("data-row").slice(-1));
  //     var newY = parseInt($(".tile").attr("data-col").slice(-1)) + 1;
  //     var x = parseInt($(".tile").attr("data-col").slice(-1));
  //     if (newY <= 3 && this.board[x][newY] === 0) {
  //       tile[0].setAttribute("data-col", ("c" + newY));
  //       this.board[x][newY] = this.board[x][y];
  //       this.board[x][y] = 0;
  //     } else {
  //       valid = false;
  //     }
  //   }
  //
  // };
};

Game.prototype.moveTileDown = function(tile) {
  var valid = true;
  while (valid) {
    var y = parseInt($(".tile").attr("data-row").slice(-1));
    var newY = parseInt($(".tile").attr("data-row").slice(-1)) + 1;
    var x = parseInt($(".tile").attr("data-col").slice(-1));
    if (newY <= 3 && this.board[newY][x] === 0) {
      tile[0].setAttribute("data-row", ("r" + newY));
      this.board[newY][x] = this.board[y][x];
      this.board[y][x] = 0;
    } else{
      valid = false;
    }
  }
};



Game.prototype.moveRowLeft = function(rowIndex) {

  console.log("moving column " + rowIndex);
  var valsAndIndicesIn = this.getValsByDim(0, rowIndex);
  console.log(valsAndIndicesIn);
  var valsIn = valsAndIndicesIn[0];
  var indicesIn = valsAndIndicesIn[1];
  var valsandIndicesOut = this.smash(valsIn);
  console.log(valsandIndicesOut);
  var valsOut = valsandIndicesOut[0];
  var indicesOut = valsandIndicesOut[1];
  this.setValsByDim(0, rowIndex, valsOut);
  //loop over indices in and indices out to see if they are the same. if they are, then nothing has moved!
  for (var i = 0; i < indicesIn.length; i++){
    var tileQuery = $(tileSelect(indicesIn[i], rowIndex));
    //if I am smashed into, delete myself
    if (i < indicesIn.length - 1) {
      if (indicesOut[i] === indicesOut[i+1]) {
        tileQuery[0].remove();
      }
    }
    // if i smashed into someone
    if (i >= 1) {
      if (indicesOut[i] === indicesOut[i-1]) {
        var newVal = valsOut[indicesOut[i]];
        console.log("I smashed and am now a " + newVal);
        console.log(tileQuery);
        console.log(tileQuery[0]);
        tileQuery.text(newVal);
        tileQuery[0].setAttribute("data-val", newVal);
      }
    }
    if (indicesIn[i] !== indicesOut[i]) {
      console.log(tileQuery);
      console.log(tileQuery[0]);
      tileQuery[0].setAttribute("data-col", ("c" + indicesOut[i]));
      this.hasMoved = true;
    }
  }


  // var valid = true;
  // while (valid) {
  //   var y = parseInt($(".tile").attr("data-row").slice(-1));
  //   var newY = parseInt($(".tile").attr("data-col").slice(-1)) - 1;
  //   var x = parseInt($(".tile").attr("data-col").slice(-1));
  //   if (newY >= 0 && this.board[x][newY]) {
  //     tile[0].setAttribute("data-col", ("c" + newY));
  //     this.board[x][newY] = this.board[x][y];
  //     this.board[x][y] = 0;
  //   } else {
  //     valid = false;
  //   }
  // }
};


Game.prototype.addRandoTile = function() {
  var tile = $("<div data-row='' data-col='' data-val=''></div>");
  var dataVal = Math.random() < 0.2 ? 4 : 2;
  var emptySpaces = this.returnEmptySpaces();
  var randoLocation = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
  tile.addClass("tile");
  tile.attr("data-row", "r" + randoLocation[0]);
  tile.attr("data-col", "c" + randoLocation[1]);
  tile.attr("data-val", dataVal);
  tile.text(dataVal);
  $("#gameboard").append(tile);
  this.board[randoLocation[0]][randoLocation[1]] = dataVal;
};

Game.prototype.returnEmptySpaces = function() {
  var emptySpaces = [];
  var row = null;
  var col = null;
  var tileLocation = null;
  for (var i = 0; i < 4; i++) {
    row = i;
    for (var j = 0; j < 4; j++) {
      col = j;
      tileLocation = this.board[row][col];
      if (tileLocation === 0) {
        emptySpaces.push([row, col]);
      }
    }
  }
  return emptySpaces;
};

$(document).ready(function() {
  console.log("ready to go!");
  // Any interactive jQuery functionality
  var game = new Game();
  game.addRandoTile();
  $('body').keydown(function(event){
    var arrows = [37, 38, 39, 40];
    if (arrows.indexOf(event.which) > -1) {
      game.moveTiles(event.which);
      game.addRandoTile();
    }
  });
});

function tileSelect(row, col) {
  return "div[data-row=\"r" + row + "\"][data-col=\"c" + col + "\"]";
}
