//1.Deposite some money to start the game 
// 2.How many lines to bet 
// 3. Collect a bet amount
// 4.Spin a slot machine 
// 5.Check if they won
// 6. Give them their winnings 
// 7.Play the game again 

// Installed npm i prompt-sync - to get input from the user "Import it here"
const prompt = require("prompt-sync")(); // Import prompt-sync

// Global Variables
const ROWS = 3;
const COLS = 3;

// Symbol Count (How many of each symbol in the machine)
const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

// Symbol Values (Payout multiplier)
const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

// Function 1: Deposit Money
const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter the Deposit Amount: ");
    const numberDepositAmount = parseFloat(depositAmount);
    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid Amount. Try again.");
    } else {
      return numberDepositAmount;
    }
  }
};

let balance = deposit(); // Get initial balance

// Function 2: Get Number of Lines to Bet On
const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines you want to bet on (1-3): ");
    const numberOfLines = parseInt(lines);
    if (isNaN(numberOfLines) || numberOfLines > 3 || numberOfLines <= 0) {
      console.log("Invalid option. Enter a number between 1 - 3. Try again.");
    } else {
      return numberOfLines;
    }
  }
};

// Function 3: Get Bet Amount
const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the bet amount: ");
    const numberBet = parseFloat(bet);
    if (isNaN(numberBet) || numberBet > balance / lines || numberBet <= 0) {
      console.log("Invalid bet. Try again.");
    } else {
      return numberBet;
    }
  }
};

// Function 4: Spin the Slot Machine
const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];

    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }
  return reels;
};

// Function 5: Transpose Columns to Rows (✅ FIXED)
const transpose = (reels) => {
  const rows = [];
  for (let i = 0; i < ROWS; i++) {
    rows.push([]); // ✅ Create a new row
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]); // ✅ Corrected row and column indexing
    }
  }
  return rows;
};

// Function 6: Print Slot Machine Grid
const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (let i = 0; i < row.length; i++) {
      rowString += row[i];
      if (i !== row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

// Function 7: Calculate Winnings
const getWinnings = (rows, bet, lines) => {
  let winnings = 0;
  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (let i = 1; i < symbols.length; i++) {
      if (symbols[i] !== symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }
  return winnings;
};

// Function 8: Main Game Loop
const game = () => {
  while (true) {
    console.log("\nYou have a balance of $" + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    
    balance -= bet * numberOfLines;
    
    const reels = spin();
    const rows = transpose(reels); // ✅ Fixed: Correctly passing reels to transpose()
    
    printRows(rows);
    
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    
    console.log("You won: $" + winnings);
    
    if (balance <= 0) {
      console.log("You ran out of money!");
      break;
    }

    const playAgain = prompt("Do you want to play again (y/n)? ");
    if (playAgain.toLowerCase() !== "y") break;
  }
};

// Start the game
game();
