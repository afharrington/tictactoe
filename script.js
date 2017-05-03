// Game State
var gameActive = false;
var selectedThisTurn, board;
var playerMode = "one"; 
var currentPlayer = "X"; 

// UI Elements
var startUI = document.getElementById('start');
var submitUI = document.getElementById('submit');
var playAgainUI = document.getElementById('play-again');
var boardUI = document.getElementById('board');
var messageUI = document.getElementById('message');
var squaresUI = document.querySelectorAll(".square");
var header = document.getElementById('header');

// Event Handlers
startUI.onclick = startGame;
submitUI.onclick = submitMove;
for (var i=0; i<squaresUI.length; i++) {
  squaresUI[i].onclick = function() {
    selectSquare(this.id);
  }
}
playAgainUI.onclick = resetGameUI; 

function startGame() {
  // Updates UI elements for play mode
  boardUI.style.display = "block";
  submitUI.style.display = "inline-block";
  startUI.style.display = "none";
  header.style.display = "none";
  messageUI.innerHTML = "Player "+ currentPlayer + "'s Turn";

  for (var i=0; i<squaresUI.length; i++) {
    squaresUI[i].innerHTML = "";
  }

  board = createEmptyBoard();
  gameActive = true;
}


// Fills square when selected and ensures one selection per turn
function selectSquare(squareId) {
  var square = document.getElementById(squareId); 

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
  var winner, full;

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
   // Adds move to board data
    board[selectedRow][selectedCol] = currentPlayer;

    winner = checkForWin();

    if (winner == "X" || winner == "O") {
      endGame("Player " + winner + " won!");
    } else {
      full = checkForFull();
    }

    if (full) {
      endGame("No winner this time.");
    };

    if (gameActive) {
      switchPlayer();
      selectedThisTurn = null;
    }
  }  
}

function checkForWin() {
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
      return "X";
    } else if (oCount == 3) {
      return "O";
    }
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
  messageUI.innerHTML = "Player "+ currentPlayer + "'s Turn";
}

function endGame(message) {
  gameActive = false;
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
  messageUI.innerHTML = "Get ready, Player " + currentPlayer + "...";
}

function createEmptyBoard() {
  board = [];
  for (var i=0; i<3; i++) {
    board.push([null, null, null]);
  }
  return board;
}
