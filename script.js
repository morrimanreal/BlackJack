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

let randomCardPlayerOne,
  randomCardPlayerTwo,
  randomCardComputerOne,
  randomCardComputerTwo,
  playerHand,
  computerHand;

let deck,
  hitCard,
  showHitCard,
  computerCard,
  showComputerHitCard;

let firstTwoTotal,
  firstTwoComputerTotal,
  totalPlayerHand,
  totalComputerHand;

newGame();
startGame();

function newGame() {
  deck = new Deck();
  deck.shuffle();

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

function dealCards() {
  playerHitButton.style.removeProperty("visibility");
  playerStandButton.style.removeProperty("visibility");
  randomCardPlayerOne = deck.pop();
  randomCardPlayerTwo = deck.pop();
  randomCardComputerOne = deck.pop();
  randomCardComputerTwo = deck.pop();

  playerCardOne.appendChild(randomCardPlayerOne.getHTML());
  playerCardTwo.appendChild(randomCardPlayerTwo.getHTML());
  computerCardOne.appendChild(randomCardComputerOne.getHTML());


  playerHand = [];
  computerHand = [];


  playerHand.push(randomCardPlayerOne.value);
  playerHand.push(randomCardPlayerTwo.value);
  computerHand.push(randomCardComputerOne.value);
  computerHand.push(randomCardComputerTwo.value);

  addFirstTwoPlayerCards();
  playerHitButton.addEventListener('click', playerHit);
  playerStandButton.addEventListener('click', playerStand);





}


function addFirstTwoPlayerCards() {
  firstTwoTotal = CARD_VALUE_MAP[randomCardPlayerOne.value] + CARD_VALUE_MAP[randomCardPlayerTwo.value];
  console.log(firstTwoTotal);
}

function addFirstTwoComputerCards() {
  firstTwoComputerTotal = CARD_VALUE_MAP[randomCardComputerOne.value] + CARD_VALUE_MAP[randomCardComputerTwo.value];
  computerCardTwo.appendChild(randomCardComputerTwo.getHTML());
  console.log(firstTwoComputerTotal);
}

function compTotalHand() {
  totalComputerHand = computerHand.reduce((total, item) => {
    return total + (CARD_VALUE_MAP[item])
  }, 0)

  console.log(totalComputerHand);
}

function computerHit() {
  if (firstTwoComputerTotal < 21) {
    computerHitCard();
  } else {
    console.log("DEALER BUST!")
  }
}


function playerHit() {
  playerHitCard();

  totalPlayerHand = playerHand.reduce((total, item) => {
    return total + (CARD_VALUE_MAP[item])
  }, 0)

  console.log(`${totalPlayerHand} : totalPlayerHand`);

  if (totalPlayerHand > 21) {
    console.log("BUST");
    gameOver();
    playerHitButton.style.visibility = "hidden";
    playerStandButton.style.visibility = "hidden";
  }

}

function playerStand() {
  playerHitButton.style.visibility = "hidden";
  addFirstTwoComputerCards();
  computerHit();
  compTotalHand();
}

function playerHitCard() {
  hitCard = deck.pop();

  playerHand.push(hitCard.value);
  console.log(playerHand)

  showHitCard = hitCardElement.appendChild(hitCard.getHTML())
  showHitCard.classList.add('card-hit');
  playerSideElement.appendChild(showHitCard);
}

function computerHitCard() {
  computerCard = deck.pop();

  computerHand.push(computerCard.value);
  console.log(computerHand)

  showComputerHitCard = computerHitCardElement.appendChild(computerCard.getHTML())
  showComputerHitCard.classList.add('card-hit');
  computerSideElement.appendChild(showComputerHitCard)
}

function gameOver() {
  playerBetButton.innerText = "RESTART";
  computerCardTwo.appendChild(randomCardComputerTwo.getHTML());

  playerBetButton.addEventListener('click', () => {

    clear();
    startGame();
  })
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



// const isAcePresent = (value) => value === 'A';

// if (playerHand.some(isAcePresent)) {
//   console.log("Ace is Present")
//   const totalWithAce = playerHand.reduce((total, item) => {
//     return total + (CARD_VALUE_MAP[item])
//   }, 0)

//   if (totalWithAce === 11) {
//     console.log('BlackJack');

//   } else if (totalWithAce < 12) {
//     let newTotalWithAce = totalWithAce + 10;
//     console.log(`${newTotalWithAce} : newTotalWithAce`);

//     playerHitButton.addEventListener('click', () => {
//       playerHit();

//       playerHand.push(hitCard.value);
//       console.log(playerHand)


//       const hitWithAce = playerHand.reduce((total, item) => {
//         return total + (CARD_VALUE_MAP[item])
//       }, 0)

//       console.log(`${hitWithAce} : hitWithAce`);


//       const newTotalHitWithAce = hitWithAce + 10;

//       console.log(`${newTotalHitWithAce}: newTotalHitWithAce`);

//       if (newTotalHitWithAce > 21) {
//         const bustAceCount = newTotalHitWithAce - 10;
//         console.log(`${bustAceCount} : bustAceCount`);

//         if (bustAceCount > 21) {
//           console.log(`${bustAceCount} BUST! GAME OVER!`);
//           gameOver();
//         }
//       }

//     })
//   }
// }







