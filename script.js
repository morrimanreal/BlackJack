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
  "A": 11
}


/** FOR LOOKS PURPOSES, SHOWING THE BACK OF THE DECK */
const playerCardOne = document.querySelector('.player-card-one');
const playerCardTwo = document.querySelector('.player-card-two');
const dealerCard = document.querySelector('.computer-card');
const dealerHiddenCard = document.querySelector('.computer-hidden-card');


const playerSlot = document.querySelector('.playerSide');
const dealerSlot = document.querySelector('.computerSide');
const playerBetButton = document.querySelector('.player-start-btn');
const playerHitButton = document.querySelector('.player-hit-btn');
const playerStandButton = document.querySelector('.player-stand-btn');
const textPlayerUpdate = document.querySelector('.text-player');
const textDealerUpdate = document.querySelector('.text-dealer');
const textUpdate = document.querySelector('.text-update');

/**FOR CREATING NEW CARDS AS GAME PROGRESSES */
const playerCards = document.createElement('div');
const dealerCards = document.createElement('div');


/** GLOBAL VARIABLES FOR RANDOM CARDS SHUFFLED */
let randomCard,
  hiddenCard,
  dealerCardOne = 0;


/** GLOBAL VARIABLES FOR PLAYER MOVES CARDS */
let deck,
  showHitCard,
  canHit = true;


/** GLOBAL VARIABLES FOR MATH STUFF */
let playerSum = 0,
  dealerSum = 0,
  playerAceCount = 0,
  dealerAceCount = 0;


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
  dealerCard.classList.add('card-hide');
  dealerHiddenCard.classList.add('card-hide');
}

function startGame() {
  /**UI UPDATES EVERY START OF THE GAME */
  textUpdate.textContent = ``;
  textPlayerUpdate.textContent = `You`;
  textDealerUpdate.textContent = `Dealer`;
  playerBetButton.innerText = "START";
  playerHitButton.style.visibility = "hidden";
  playerStandButton.style.visibility = "hidden";
  /**WHEN PLAYER CLICK START GAME, CARDS WILL BE DEALT */
  playerBetButton.addEventListener('click', dealCards, { once: true });
}

function dealCards() {
  /**UI UPDATES */
  playerBetButton.style.visibility = "hidden";
  playerHitButton.style.removeProperty("visibility");
  playerStandButton.style.removeProperty("visibility");

  pullCard(dealerCards);
  dealerCard.remove();
  hiddenCard = deck.pop();
  dealerCardOne = deck.pop();
  dealerSlot.append(dealerCardOne.getHTML());
  dealerSum += getTwoValues(hiddenCard, dealerCardOne);
  dealerAceCount += checkAceForTwo(hiddenCard, dealerCardOne);
  console.log(hiddenCard);
  console.log(dealerCardOne);
  console.log(dealerSum);
  console.log(dealerAceCount);


  for (let i = 0; i < 2; i++) {
    pullCard(playerCards);
    playerCardOne.remove();
    playerCardTwo.remove();
    playerSlot.append(playerCards);
    playerSum += getValue(randomCard);
    playerAceCount += checkAce(randomCard);
    console.log(randomCard)
    textPlayerUpdate.textContent = `You: ${playerSum}`
  }


  checkBlackJack();
  playerHitButton.addEventListener('click', playerHit);
  playerStandButton.addEventListener('click', playerStand);
}

function checkBlackJack() {
  if (checkAceForTwo(hiddenCard, dealerCardOne) === 1 && dealerSum === 21) {
    textUpdate.textContent = 'Dealer BlackJack!!'
    gameOver();
  }
  else if (randomCard.value === 'A' && playerSum === 21) {
    textUpdate.textContent = 'Player BlackJack!'
    gameOver();
  }
}

function pullCard(card) {
  randomCard = deck.pop();
  card.appendChild(randomCard.getHTML());
}

function getValue(card) {
  let value = CARD_VALUE_MAP[card.value];
  return value;
}

function checkAce(card) {
  if (card.value === 'A') {
    return 1;
  }
  return 0;
}

function getTwoValues(cardOne, cardTwo) {
  let value = CARD_VALUE_MAP[cardOne.value] + CARD_VALUE_MAP[cardTwo.value];
  return value;
}


function checkAceForTwo(cardOne, cardTwo) {
  if (cardOne.value === 'A' || cardTwo.value === 'A') {
    return 1;
  }
  return 0;
}

function reduceAce(totalSum, totalAceCount) {
  while (totalSum > 21 && totalAceCount > 0) {
    totalSum -= 10;
    totalAceCount -= 1;
  }
  textPlayerUpdate.textContent = `You: ${totalSum}`
  return totalSum;
}


function playerHit() {
  if (!canHit) {
    return;
  }

  randomCard = deck.pop();
  showHitCard = playerSlot.appendChild(randomCard.getHTML());
  showHitCard.classList.add('card-hit');
  playerSum += getValue(randomCard);
  playerAceCount += checkAce(randomCard);
  console.log(playerSum);
  console.log(playerAceCount);
  textPlayerUpdate.textContent = `You: ${playerSum}`

  if (reduceAce(playerSum, playerAceCount) > 21) {
    canHit = false;
  }
}

function playerStand() {
  dealerHiddenCard.remove();
  dealerSlot.append(hiddenCard.getHTML());

  while (dealerSum < 17) {
    let hitCard = deck.pop();
    dealerSum += getValue(hitCard);
    dealerAceCount += checkAce(hitCard);
    dealerSlot.appendChild(hitCard.getHTML());
    console.log(hitCard);
    textDealerUpdate.textContent = `Dealer: ${dealerSum}`

  }
  compareTotal();

}

function compareTotal() {
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  playerSum = reduceAce(playerSum, playerAceCount);

  canHit = false;
  if (playerSum > 21) {
    textUpdate.textContent = 'YOU LOSE!'
  }
  else if (dealerSum > 21) {
    textUpdate.textContent = 'YOU WIN!'
  }
  else if (dealerSum === playerSum) {
    textUpdate.textContent = 'TIE!'
  }
  else if (dealerSum < playerSum) {
    textUpdate.textContent = 'YOU WIN!'
  }
  else if (dealerSum > playerSum) {
    textUpdate.textContent = 'YOU LOSE!'
  }
}



/* GAME UPDATES FUNCTIONS */
function gameOver() {
  playerBetButton.style.removeProperty("visibility");
  playerHitButton.style.visibility = "hidden";
  playerStandButton.style.visibility = "hidden";
  playerBetButton.innerText = "RESTART";
  dealerHiddenCard.remove();
  dealerSlot.append(hiddenCard.getHTML());//to show computer hidden card once game is over or when player stand
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
  dealerCard.classList.add('card-hide');
  dealerHiddenCard.classList.add('card-hide');
}

// function clear() {
//   let elements = document.getElementsByClassName("card-hit");
//   while (elements.length > 0) {
//     elements[0].parentNode.removeChild(elements[0]);
//   }
//   elements = document.getElementsByClassName("hello");
//   while (elements.length > 0) {
//     elements[0].parentNode.removeChild(elements[0]);
//   }
//   playerCardOne.classList.add('card-hide');
//   playerCardTwo.classList.add('card-hide');
//   dealerCard.classList.add('card-hide');
//   dealerHiddenCard.classList.add('card-hide');
// }


