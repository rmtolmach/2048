var Game = function() {
  // Game logic and initialization here
  this.board = [[0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]];
};

Game.prototype.play = function() {

};

Game.prototype.moveTile = function(tile, direction) {
  // Game method here
  switch(direction) {
    case 38: //up
      this.moveTileUp(tile);
      break;
    case 40: //down
      var downRow = parseInt($(".tile").attr("data-row").slice(-1)) + 1;
      if (downRow <= 3) {
        tile[0].setAttribute("data-row", ("r" + downRow));
      }
      break;
    case 37: //left
      var leftCol = parseInt($(".tile").attr("data-col").slice(-1)) - 1;
      if (leftCol >= 0) {
        tile[0].setAttribute("data-col", ("c" + leftCol));
      }
      break;
    case 39: //right
      var rightCol = parseInt($(".tile").attr("data-col").slice(-1)) + 1;
      if (rightCol <= 3) {
        tile[0].setAttribute("data-col", ("c" + rightCol));
      }
      break;
  }
};

Game.prototype.moveTileUp = function(tile) {
  var y = parseInt($(".tile").attr("data-row").slice(-1));
  var newY = parseInt($(".tile").attr("data-row").slice(-1)) - 1;
  var x = parseInt($(".tile").attr("data-col").slice(-1));
  if (newY >= 0) {
    tile[0].setAttribute("data-row", ("r" + newY));
    this.board[newY][x] = this.board[y][x];
    this.board[y][x] = 0;
  }
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
  console.log(tile.attr("data-row"));
  this.board[randoLocation[0]][randoLocation[1]] = dataVal;
  console.log(this.board);
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
      var tile = $('.tile');
      console.log(game.board);

      game.moveTile(tile, event.which);
    }
  });
});

function tileSelectText(row, col) {
  return ".tile[data-row=\"" + row + "\"][data-col=\"" + col + "\"]";
}
