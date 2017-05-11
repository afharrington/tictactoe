// Game State
var gameActive = false;
var selectedThisTurn, board;
var playingTom = false;
var currentPlayer = "X";

var xName, oName;
if (playingTom) {
  xName = "You";
  oName = "Tom";
} else {
  xName = "Player X";
  oName = "Player O";
}

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
    if (currentPlayer !== "Tom") {
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

  board = createEmptyBoard();
  gameActive = true;

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
    var selectedCol = Number(selectedThisTurn.charAt(1));
    var selectedRow = (function() {
      switch(selectedThisTurn.charAt(0)) {
        case "a":
          return 0;
        case "b":
          return 1;
        case "c":
          return 2;
      }
    })();
  }
  // Adds move to board data
  board[selectedRow][selectedCol] = currentPlayer;
  checkForWin();
  if (gameActive) {
    switchPlayer();
    selectedThisTurn = null;
  }
}


function checkForWin() {
  var winner;
  var winningRuns = {
    row0: [ [board[0][0]], [board[0][1]], [board[0][2]] ],
    row1: [ [board[1][0]], [board[1][1]], [board[1][2]] ],
    row2: [ [board[2][0]], [board[2][1]], [board[2][2]] ],
    col0: [ [board[0][0]], [board[1][0]], [board[2][0]] ],
    col1: [ [board[0][1]], [board[1][1]], [board[2][1]] ],
    col2: [ [board[0][2]], [board[1][2]], [board[2][2]] ],
    topdiag: [ [board[2][0]], [board[1][1]], [board[0][2]] ],
    botdiag: [ [board[0][0]], [board[1][1]], [board[2][2]] ]
  }

  // for each potential winning run
  for (run in winningRuns) {
    var xCount = 0;
    var oCount = 0;
    // for each item in the run, check if value is X or O
    for (var i=0; i<3; i++) {
      if (winningRuns[run][i] == "X") {
        xCount++;
      } else if (winningRuns[run][i] == "O") {
        oCount++;
      }
    }
    if (xCount == 3) {
      winner = "X";
    } else if (oCount == 3) {
      winner = "O";
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

  for (row=0; row<3; row++) {
    for (col=0; col<3;col++) {
      if (board[row][col] == null) {
        nullCount++;
      }
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
  var potentialMoves = [];
  for (row=0; row<3; row++) {
    for (col=0; col<3;col++) {
      if (board[row][col] == null) {
        potentialMoves.push([row, col]);
      }
    }
  }

  randomSelection = Math.floor((Math.random() * potentialMoves.length));
  var move = potentialMoves[randomSelection];

  var row = move[0];
  var col = move[1];
  board[row][col] = "O";

  setTimeout(function(){
    drawTomsMove(row, col);
    checkForWin();
    if (gameActive) {
      switchPlayer();
      selectedThisTurn = null;
    }
  }, 1000);
}

// draws Tom's move to the board
function drawTomsMove(row, col) {
  var row = (function() {
    switch(row) {
      case 0:
        return "a";
      case 1:
        return "b";
      case 2:
        return "c";
    }
  })();

  var moveId = row + col;
  var square = document.getElementById(moveId);
  square.innerHTML = "O";
}

function endGame(winner) {
  console.log("Passed to endGame(): ", winner);
  gameActive = false;

  if (winner == "X" && playingTom) {
    messageUI.innerHTML = "You won!";
  } else if (winner == "X" && !playingTom) {
    messageUI.innerHTML = "Player X won!"
  } else if (winner == "O" && playingTom) {
    messageUI.innerHTML = "Tom won";
  } else {
    messageUI.innerHTML = "Player O won!"
  }

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
  board = [];
  for (var i=0; i<3; i++) {
    board.push([null, null, null]);
  }
  return board;
}
