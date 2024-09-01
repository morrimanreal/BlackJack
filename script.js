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
const textPlayerUpdate = document.querySelector('.text-player');
const textComputerUpdate = document.querySelector('.text-dealer');
const textUpdate = document.querySelector('.text-update');

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
  textUpdate.textContent = ``;
  textPlayerUpdate.textContent = `You`;
  textComputerUpdate.textContent = `Dealer`;
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
  /**CHECK IF DEALER HAS BLACKJACK 
   * BONUS: if Dealer shows 'A' ask for insurance once BETTING IS ADDED!
  */
  addFirstTwoComputerCards();
  if (computerHand.some(computerCardHasAceAndFaceCard) && firstTwoComputerTotal === 11) {
    addFirstTwoPlayerCards();
    if (firstTwoTotal === 11) {
      console.log(`TIE! BOTH BLACKJACK!`)
      textUpdate.textContent = `TIE!!`
      gameOver()
    } else {
      console.log(`YOU LOSE!`);
      textUpdate.textContent = `Dealer Blackjack! You Lose!`
      gameOver();
    }
  } else {
    /** WHEN ACE SHOWS UP AT THE BEGINNING OF THE HAND*/
    if (playerHand.some(isAcePresent)) {
      console.log("Ace is Present")
      addPlayerCards();
      if (totalPlayerHand === 11) {
        textUpdate.textContent = `Blackjack! You Win!`
        gameOver();
      } else if (totalPlayerHand < 12) {
        totalPlayerHand = totalPlayerHand + 10;
        console.log(`totalPlayerHand plus 10 is ${totalPlayerHand}`);
        textPlayerUpdate.textContent = `You: ${totalPlayerHand}`;
        playerHitButton.addEventListener('click', () => {
          playerHitCard();
          addPlayerCards();
          totalPlayerHand = totalPlayerHand + 10;
          console.log(`totalPlayerHand plus 10 is ${totalPlayerHand}`);
          textPlayerUpdate.textContent = `You: ${totalPlayerHand}`;
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
      addPlayerCards();
      textPlayerUpdate.textContent = `You: ${totalPlayerHand}`;
      playerHitButton.addEventListener('click', playerHit);
      playerStandButton.addEventListener('click', playerStand);
    }
  }
}

/* GAME MATH STUFF FUNCTIONS */

/** COMPUTER SIDE MATH */
function addFirstTwoComputerCards() {
  firstTwoComputerTotal = CARD_VALUE_MAP[randomCardComputerOne.value] + CARD_VALUE_MAP[randomCardComputerTwo.value];
  console.log(`${firstTwoComputerTotal} firstTwoComputerTotal`);
  // textComputerUpdate.textContent = `Dealer: ${firstTwoComputerTotal}`;
}

function addComputerCards() {
  totalComputerHand = computerHand.reduce((total, item) => {
    return total + (CARD_VALUE_MAP[item])
  }, 0)
  console.log(`${totalComputerHand} totalComputerHand --- addComputerCards function`);
  textComputerUpdate.textContent = `Dealer: ${totalComputerHand}`;
}

/** PLAYERS SIDE MATH */
function addFirstTwoPlayerCards() {
  firstTwoTotal = CARD_VALUE_MAP[randomCardPlayerOne.value] + CARD_VALUE_MAP[randomCardPlayerTwo.value];
  console.log(firstTwoTotal);
}

function addPlayerCards() {
  totalPlayerHand = playerHand.reduce((total, item) => {
    return total + (CARD_VALUE_MAP[item])
  }, 0)
}

function compareTotal() {
  if (totalComputerHand > 21) {
    console.log(`DEALER BUST! compareTotal function ran ${totalComputerHand}`)
    textUpdate.textContent = `Dealer BUST! YOU WIN!`;
  } else {
    console.log(`totalComputerHand ${totalComputerHand} is less than 21`)

    if (totalComputerHand === totalPlayerHand) {
      console.log(`TIE!`)
      textUpdate.textContent = `TIE!`;
    } else if (totalComputerHand > totalPlayerHand) {
      console.log(`LOSE!`)
      textUpdate.textContent = `YOU LOST!`;
    } else if (totalComputerHand < totalPlayerHand) {
      console.log('WIN!')
      textUpdate.textContent = `YOU WIN!`;
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
  //IF Ace Card shows up as the hitCard then do the following
  if (hitCard.value === 'A') {
    console.log(`hitCard is Ace ${hitCard.value}`);
    addPlayerCards();
    console.log(`${totalPlayerHand} : totalPlayerHandOnAceHit`)
    if (totalPlayerHand < 12) {
      console.log(`total is less than 12 so add ten`)
      totalPlayerHand = totalPlayerHand + 10;
      console.log(`${totalPlayerHand}: totalPlayerHand + 10`)
      textPlayerUpdate.textContent = `You: ${totalPlayerHand}`;
      if (totalPlayerHand > 21) {
        totalPlayerHand = totalPlayerHand - 10;
        console.log(`subtract ten ${totalPlayerHand}`)
        textPlayerUpdate.textContent = `You: ${totalPlayerHand}`;
        if (totalPlayerHand > 21) {
          console.log(`FINALLY BUST!`)
          textUpdate.textContent = `Bust! You Lose!`
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
    textPlayerUpdate.textContent = `You: ${totalPlayerHand}`;
    if (totalPlayerHand > 21) {
      console.log("BUST");
      textUpdate.textContent = `Bust! You Lose!`
      gameOver();
      playerHitButton.style.visibility = "hidden";
      playerStandButton.style.visibility = "hidden";
    }
  }
}

function playerStand() {
  playerHitButton.style.visibility = "hidden";
  playerStandButton.style.visibility = "hidden";
  addFirstTwoComputerCards();
  textComputerUpdate.textContent = `Dealer: ${firstTwoComputerTotal}`;
  if (computerHand.some(isAcePresent) && firstTwoComputerTotal >= 7) {
    totalComputerHand = totalComputerHand + 10;
    console.log(`checking if total >=17 ran and output PLUS 10 ${firstTwoComputerTotal}`);
    textComputerUpdate.textContent = `Dealer: ${firstTwoComputerTotal}`;
    compareTotal();
  } else if (totalComputerHand >= 17) {
    totalComputerHand = firstTwoComputerTotal;
    console.log(`checking if total >=17 ran and output ${firstTwoComputerTotal}`);
    compareTotal();
  } else {
    computerHitCard();
  }
}

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
  grabComputerCard();
  addComputerCards();
  while (totalComputerHand < 17) {
    grabComputerCard();
    addComputerCards();
    textComputerUpdate.textContent = `Dealer: ${totalComputerHand}`;
  } compareTotal();
}

/* GAME UPDATES FUNCTIONS */
function grabComputerCard() {
  computerCard = deck.pop();
  computerHand.push(computerCard.value);
  showComputerHitCard = computerHitCardElement.appendChild(computerCard.getHTML());
  showComputerHitCard.classList.add('card-hit');
  computerSideElement.appendChild(showComputerHitCard);
}

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

const computerCardHasAceAndFaceCard = (value) => (value === 'A' || value === '10' || value === 'J' || value === 'Q' || value === 'K');

function gameOver() {
  playerHitButton.style.visibility = "hidden";
  playerStandButton.style.visibility = "hidden";
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



/** PROBLEMS TO SOLVE
 * when [A, A, A] is the array for playerhands, it is over 13 and doesnt add 10 so figure that out! <=== SOLVED ===>
 * IF DEALER HAS BLACKJACK, figure out TIE, INSURANCE with player. <=== HALF SOLVED ===> 
 * UPDATE GAME STATE IN THE WINDOW AND SHOW STATS
 * Implement Ace count in DEALER side
 * figure out DOUBLE DOWN and SPLIT
 * add BETTING
 * ***BONUES*** if you can add some cut cards since its a 6 deck shoe [array]
 * CLEAN UP CONSOLE LOGS!
 */









