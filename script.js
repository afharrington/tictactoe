// Game State
var gameActive = false;
var selectedThisTurn, board, tomsWinningMove, tomsBlockingMove;
var playingTom = false;
var currentPlayer = "X";
var winningRuns = [
  ["a", "b", "c"],
  ["d", "e", "f"],
  ["g", "h", "i"],
  ["a", "d", "g"],
  ["b", "e", "h"],
  ["c", "f", "i"],
  ["a", "e", "i"],
  ["g", "e", "c"]
]

/* BOARD:
a    b    c

d    e    f

g    h    i
*/

// UI Elements
var startUI = document.getElementById('start');
var tomUI = document.getElementById('tom');

var submitUI = document.getElementById('submit');
var playAgainUI = document.getElementById('play-again');
var boardUI = document.getElementById('board');
var messageUI = document.getElementById('message');
var squaresUI = document.querySelectorAll('.square');
var header = document.getElementById('header');

var startScreenButtons = document.querySelectorAll('.start-screen');

// Event Handlers
startUI.onclick = startGame;
tomUI.onclick = function(){
  playingTom = true;
  startGame();
}

submitUI.onclick = submitMove;
for (var i=0; i<squaresUI.length; i++) {
  squaresUI[i].onclick = function() {
    if (currentPlayer == "X") {
      selectSquare(this.id);
    }
  }
}
playAgainUI.onclick = resetGameUI;

function startGame() {
  // Updates UI elements for play mode
  boardUI.style.display = "block";
  submitUI.style.display = "inline-block";

  for (var i=0; i<startScreenButtons.length; i++) {
    startScreenButtons[i].style.display = "none";
  }

  if (currentPlayer == "X" && playingTom) {
    messageUI.innerHTML = "Your Turn";
  } else if (currentPlayer == "X" && !playingTom) {
    messageUI.innerHTML = "Player X's Turn"
  } else if (currentPlayer == "O" && playingTom) {
    messageUI.innerHTML = "Tom's Turn";
  } else {
    messageUI.innerHTML = "Player O's Turn"
  }

  for (var i=0; i<squaresUI.length; i++) {
    squaresUI[i].innerHTML = "";
  }

  gameActive = true;
  board = createEmptyBoard();

  if (playingTom && currentPlayer == "O") {
    tomsMove();
  }
}

// Fills square when selected and ensures one selection per turn
function selectSquare(squareId) {
  var square = document.getElementById(squareId);
  var playerMark;
  currentPlayer == "X" ? playerMark = "X" : playerMark = "O";

  if (selectedThisTurn) {
    // Grabs HTML element for previously selected square
    var selectedSquare = document.getElementById(selectedThisTurn);

    // If new square is open and not already selected, clear old square
    if ((squareId != selectedThisTurn) && square.innerHTML == "") {
      selectedSquare.innerHTML = "";
    }
  }

  // Only if the square is empty, fill with the player's symbol
  if (square.innerHTML == "") {
    square.innerHTML = currentPlayer;
    selectedThisTurn = squareId;
  }
}

// Adds selected square to the board data, ends player's turn
function submitMove() {
  if (!selectedThisTurn) {
    messageUI.innerHTML ="Select a square and try again";
  } else {
    // Adds move to board data
    board[selectedThisTurn] = currentPlayer;
  }

  checkForWin();
  if (gameActive) {
    switchPlayer();
    selectedThisTurn = null;
  }
}

function checkForWin() {
  var winner;
  // for each of the possible winning runs
  for (var i=0; i<winningRuns.length; i++) {
    var xCount = 0;
    var oCount = 0;
    var nullSquares = [];

    // count number of X's, O's, and nulls
    for (var j=0; j<3; j++) {
      var letter = winningRuns[i][j];
      if (board[letter] == "X") {
        xCount++;
      } else if (board[letter] == "O") {
        oCount++;
      } else {
        nullSquares.push(letter);
      }

      if (xCount == 3) {
        winner = "X";
      } else if (oCount == 3) {
        winner = "O";
      }

      if (playingTom && (oCount == 2 && nullSquares.length == 1)) {
        tomsWinningMove = nullSquares[0];
      }

      if (playingTom && (xCount == 2 && nullSquares.length == 1)) {
        tomsBlockingMove = nullSquares[0];
      }
    }
  }

  if (winner == "X" || winner == "O") {
    endGame(winner);
  } else {
    full = checkForFull();
  }

  if (full) {
    endGame("None");
  }
}


function checkForFull() {
  nullCount = 0;
  for (square in board) {
    if (board[square] == null) {
      nullCount++;
    }
  }
  if (nullCount == 0) {
    return true;
  }
}

function switchPlayer() {
  currentPlayer == "X" ? currentPlayer = "O" : currentPlayer = "X";
  if (playingTom) {
    if (currentPlayer == "O"){
      messageUI.innerHTML = "Tom's Turn";
      submitUI.style.display = "none";
      tomsMove();
    } else {
      submitUI.style.display = "inline-block";
      messageUI.innerHTML = "Your Turn";
    }
  } else if (!playingTom) {
    messageUI.innerHTML = "Player "+ currentPlayer + "'s Turn";
  }
}

function tomsMove() {
  var move;

  if (tomsWinningMove && board[tomsWinningMove] == null) {
    move = tomsWinningMove;
  } else if (tomsBlockingMove && board[tomsBlockingMove] == null) {
    move = tomsBlockingMove;
  } else if (board["e"] == null) {
    move = "e";
  } else {
    var potentialMoves = [];

    for (square in board) {
      if (board[square] == null) {
        potentialMoves.push(square);
      }
    }
    randomSelection = Math.floor((Math.random() * potentialMoves.length));
    move = potentialMoves[randomSelection];
  }

  board[move] = "O";

  setTimeout(function(){
    drawTomsMove(move);
    checkForWin();
    if (gameActive) {
      switchPlayer();
      selectedThisTurn = null;
    }
  }, 1000);
}

// draws Tom's move to the board
function drawTomsMove(squareId) {
  var square = document.getElementById(squareId);
  square.innerHTML = "O";
}

function endGame(winner) {
  console.log("Passed to endGame(): ", winner);
  gameActive = false;
  var message;

  if (winner == "X" && playingTom) {
    message = "You won!";
  } else if (winner == "X" && !playingTom) {
    message = "Player X won!"
  } else if (winner == "O" && playingTom) {
    message = "Tom won!";
  } else if (winner == "0" && !playingTom) {
    message = "Player O won!"
  } else {
    message = "No winner this time."
  }

  messageUI.innerHTML = message;
  submitUI.style.display = "none";
  playAgainUI.style.display = "inline-block";
}

// Brings back to the start screen
function resetGameUI() {
  boardUI.style.display = "none";
  playAgainUI.style.display = "none";
  startUI.style.display = "inline-block";
  header.style.display = "inline-block";
  messageUI.innerHTML = "Winner goes first...";
}

function createEmptyBoard() {
  return { a: null,
           b: null,
           c: null,
           d: null,
           e: null,
           f: null,
           g: null,
           h: null,
           i: null
         }
}
