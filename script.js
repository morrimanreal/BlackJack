import Deck from './deck.js'

let CARD_VALUE_MAP = {
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  "J": 10,
  "Q": 10,
  "K": 10,
  "A": 1
}


const playerCardOne = document.querySelector('.player-card-one');
const playerCardTwo = document.querySelector('.player-card-two');
const computerCardOne = document.querySelector('.computer-card-one');
const computerCardTwo = document.querySelector('.computer-card-two');

const playerSideElement = document.querySelector('.playerSide');
const computerSideElement = document.querySelector('.computerSide');
const playerBetButton = document.querySelector('.player-start-btn');
const playerHitButton = document.querySelector('.player-hit-btn');
const playerStandButton = document.querySelector('.player-stand-btn');
const textUpdate = document.querySelector('.text-update');
const tableContainer = document.querySelector('.container');

const hitCardElement = document.createElement('div');
const computerHitCardElement = document.createElement('div');

/** GLOBAL VARIABLES FOR RANDOM CARDS SHUFFLED */
let randomCardPlayerOne,
  randomCardPlayerTwo,
  randomCardComputerOne,
  randomCardComputerTwo,
  playerHand,
  computerHand;

/** GLOBAL VARIABLES FOR PLAYER MOVES CARDS */
let deck,
  hitCard,
  showHitCard,
  computerCard,
  showComputerHitCard;

/** GLOBAL VARIABLES FOR MATH STUFF */
let firstTwoTotal,
  firstTwoComputerTotal,
  totalPlayerHand,
  totalComputerHand;

/** FIRST STEPS TO RUN THE GAME */
newGame();
startGame();

function newGame() {
  deck = new Deck();
  deck.shuffle();
  console.log(deck); // showing 312 cards, 6 decks of cards!

  /* This is just the look of the back of the card that shows at the beginning of the game, can be changed in css for a nicer look */
  playerCardOne.classList.add('card-hide');
  playerCardTwo.classList.add('card-hide');
  computerCardOne.classList.add('card-hide');
  computerCardTwo.classList.add('card-hide');
}


function startGame() {
  playerBetButton.innerText = "START";
  playerBetButton.addEventListener('click', dealCards, { once: true });
  playerHitButton.style.visibility = "hidden";
  playerStandButton.style.visibility = "hidden";
}

/** blackjack hand being dealt */
function dealCards() {
  playerHitButton.style.removeProperty("visibility");
  playerStandButton.style.removeProperty("visibility");
  randomCardPoppedAndAppended(); // first three cards shown to player
  playerHand = [];
  computerHand = [];
  playerHand.push(randomCardPlayerOne.value);
  playerHand.push(randomCardPlayerTwo.value);
  computerHand.push(randomCardComputerOne.value);
  computerHand.push(randomCardComputerTwo.value);

  /** WHEN ACE SHOWS UP */
  if (playerHand.some(isAcePresent)) {
    console.log("Ace is Present")
    addPlayerCards();
    if (totalPlayerHand === 11) {
      console.log(`BlackJack!`)
      gameOver();
    } else if (totalPlayerHand < 12) {
      totalPlayerHand = totalPlayerHand + 10;
      console.log(`totalPlayerHand plus 10 is ${totalPlayerHand}`);
      playerHitButton.addEventListener('click', () => {
        playerHitCard();
        addPlayerCards();
        if (totalPlayerHand > 21) {
          totalPlayerHand = totalPlayerHand - 10;
          console.log(`totalPlayerHand minus 10 is ${totalPlayerHand}`)
          addPlayerCards();
          if (totalPlayerHand > 21) {
            console.log(`Finally Bust!`)
            gameOver();
          }
        }
      });
      playerStandButton.addEventListener('click', playerStand);
    }
  } else {
    addFirstTwoPlayerCards();
    playerHitButton.addEventListener('click', playerHit);
    playerStandButton.addEventListener('click', playerStand);
  }
}

/* GAME MATH STUFF FUNCTIONS */
function addFirstTwoPlayerCards() {
  firstTwoTotal = CARD_VALUE_MAP[randomCardPlayerOne.value] + CARD_VALUE_MAP[randomCardPlayerTwo.value];
  console.log(firstTwoTotal);
}

function addFirstTwoComputerCards() {
  firstTwoComputerTotal = CARD_VALUE_MAP[randomCardComputerOne.value] + CARD_VALUE_MAP[randomCardComputerTwo.value];
  console.log(`${firstTwoComputerTotal} firstTwoComputerTotal`);
}

function addComputerCards() {
  totalComputerHand = computerHand.reduce((total, item) => {
    return total + (CARD_VALUE_MAP[item])
  }, 0)
  console.log(`${totalComputerHand} totalComputerHand --- compTotalHand function`);
}

function addPlayerCards() {
  totalPlayerHand = playerHand.reduce((total, item) => {
    return total + (CARD_VALUE_MAP[item])
  }, 0)

  console.log(`totalPlayerHand: ${totalPlayerHand}`)
}

function compareTotal() {
  if (totalComputerHand > 21) {
    console.log(`DEALER BUST! compareTotal function ran ${totalComputerHand}`)
  } else {
    console.log(`totalComputerHand ${totalComputerHand} is less than 21`)

    if (totalComputerHand === totalPlayerHand) {
      console.log(`TIE!`)
    } else if (totalComputerHand > totalPlayerHand) {
      console.log(`LOSE!`)
    } else if (totalComputerHand < totalPlayerHand) {
      console.log('WIN!')
    }
  }
  gameOver();
}

function acePlayerTotal() {
  totalWithAce = playerHand.reduce((total, item) => {
    return total + (CARD_VALUE_MAP[item])
  }, 0)
}

/* PLAYER MOVES FUNCTIONS */
function playerHit() {
  playerHitCard();
  if (hitCard.value === 'A') {
    console.log(`hitCard is Ace ${hitCard.value}`);
    addPlayerCards();
    console.log(`${totalPlayerHand} : totalPlayerHandOnAceHit`)
    if (totalPlayerHand < 12) {
      console.log(`total is less than 12 so add ten`)
      totalPlayerHand = totalPlayerHand + 10;
      addPlayerCards();
      console.log(`${totalPlayerHand}: totalPlayerHand + 10`)
      if (totalPlayerHand > 21) {
        totalPlayerHand = totalPlayerHand - 10;
        console.log(`subtract ten ${totalPlayerHand}`)
        if (totalPlayerHand > 21) {
          console.log(`FINALLY BUST!`)
          gameOver();
        }
      }
    } else {
      addPlayerCards();
      console.log(`${totalPlayerHand}: Ace is above 12`)
      if (totalPlayerHand > 21) {
        console.log(`BUST!`)
      }
    }
  } else {
    addPlayerCards();
    if (totalPlayerHand > 21) {
      console.log("BUST");
      gameOver();
      playerHitButton.style.visibility = "hidden";
      playerStandButton.style.visibility = "hidden";
    }
  }

}

function playerStand() {
  playerHitButton.style.visibility = "hidden";
  playerStandButton.style.visibility = "hidden";
  addPlayerCards();
  addFirstTwoComputerCards();
  if (firstTwoComputerTotal >= 17) {
    totalComputerHand = firstTwoComputerTotal;
    console.log(`checking if total >=17 ran and output ${totalComputerHand}`);
    compareTotal();
  } else {
    computerHitCard();
  }
}

/** PLAYER MOVES FUNCTIONS WITH ACE <=== NOT USED ===> */
function playerHitWithAce() {
  if (totalPlayerHand < 12) {
    console.log(`${totalPlayerHand} is less than 12 so add ten`)
    totalPlayerHand = totalPlayerHand + 10;
    addPlayerCards();
    console.log(`${totalPlayerHand}: totalPlayerHand + 10`)
    if (totalPlayerHand > 21) {
      totalPlayerHand = totalPlayerHand - 10;
      console.log(`subtract ten ${totalPlayerHand}`)
      if (totalPlayerHand > 21) {
        console.log(`FINALLY BUST!`)
        gameOver();
      }
    }
  } else {
    addPlayerCards();
    console.log(`${totalPlayerHand}: Ace is above 12`)
    if (totalPlayerHand > 21) {
      console.log(`BUST!`)
    }
  }
}
//figure out if you can put all value in one variable so its easier to compare numbers!
//FIGURED OUT! but cant be used cause two diff if else statements for firstTwoCards with Ace and No Ace, try to see if u can make it both work with one function~


/* NEW CARDS HIT/POPPED FUNCTIONS */
function playerHitCard() {
  hitCard = deck.pop();
  playerHand.push(hitCard.value);
  console.log(playerHand)
  showHitCard = hitCardElement.appendChild(hitCard.getHTML())
  showHitCard.classList.add('card-hit');
  playerSideElement.appendChild(showHitCard);
}

function computerHitCard() {
  let i = firstTwoComputerTotal;
  while (i < 17) {
    computerCard = deck.pop();
    computerHand.push(computerCard.value);
    showComputerHitCard = computerHitCardElement.appendChild(computerCard.getHTML());
    showComputerHitCard.classList.add('card-hit');
    computerSideElement.appendChild(showComputerHitCard);
    addComputerCards();
    i = totalComputerHand;
    console.log(`${computerHand} = ${i} computerHitCard function ran`);
  }
  compareTotal();
}


/* GAME UPDATES FUNCTIONS */
function randomCardPoppedAndAppended() {
  randomCardPlayerOne = deck.pop();
  randomCardPlayerTwo = deck.pop();
  randomCardComputerOne = deck.pop();
  randomCardComputerTwo = deck.pop();

  playerCardOne.appendChild(randomCardPlayerOne.getHTML());
  playerCardTwo.appendChild(randomCardPlayerTwo.getHTML());
  computerCardOne.appendChild(randomCardComputerOne.getHTML());
}

const isAcePresent = (value) => value === 'A'; //checking if Ace is Present

function gameOver() {
  playerBetButton.innerText = "RESTART";
  computerCardTwo.appendChild(randomCardComputerTwo.getHTML());
  playerBetButton.addEventListener('click', () => {
    clear();
    startGame();
  }, { once: true })
}

function clear() {
  let elements = document.getElementsByClassName("card-hit");
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
  elements = document.getElementsByClassName("hello");
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
  playerCardOne.classList.add('card-hide');
  playerCardTwo.classList.add('card-hide');
}













