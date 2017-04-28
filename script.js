// Game State
var gameActive = false;
var selectedThisTurn, board;
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
  if (!selectedThisTurn) {
    messageUI.innerHTML ="Select a square and try again";
  } else {
    var col = Number(selectedThisTurn.charAt(1));
    var row = (function() {
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
  board[row][col] = currentPlayer;

  checkForWin();
  
  if (gameActive) {
    switchPlayer();
    selectedThisTurn = null;
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
    if (xCount == 3 || oCount == 3) {
      endGame();
    }
  }
}

function switchPlayer() {
  currentPlayer == "X" ? currentPlayer = "O" : currentPlayer = "X";
  messageUI.innerHTML = "Player "+ currentPlayer + "'s Turn";
}

function endGame() {
  gameActive = false;
  messageUI.innerHTML = "Player " + currentPlayer + " won!";
  submitUI.style.display = "none";
  playAgainUI.style.display = "inline-block";
}

function resetGameUI() {
  boardUI.style.display = "none";
  playAgainUI.style.display = "none";
  startUI.style.display = "inline-block";
  header.style.display = "inline-block";
  messageUI.innerHTML = "Winner goes first! Get ready, Player " + currentPlayer + "...";
}

function createEmptyBoard() {
  board = [];
  for (var i=0; i<3; i++) {
    board.push([null, null, null]);
  }
  return board;
}
