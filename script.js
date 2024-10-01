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

const player_slot = document.querySelector('.playerSide');
const dealer_slot = document.querySelector('.computerSide');
const p_bet_btn = document.querySelector('.player-start-btn');
const p_hit_btn = document.querySelector('.player-hit-btn');
const p_stand_btn = document.querySelector('.player-stand-btn');
const p_text_update = document.querySelector('.text-player');
const dealer_text_update = document.querySelector('.text-dealer');
const text_update = document.querySelector('.text-update');

/**FOR CREATING NEW CARDS AS GAME PROGRESSES */
const hit_card_element = document.createElement('div');

/**BACK CARDS */
const playerOne_back_card = document.createElement('div');
const playerTwo_back_card = document.createElement('div');
const dealerOne_back_card = document.createElement('div');
const dealerTwo_back_card = document.createElement('div');
playerOne_back_card.classList.add('card-hide');
playerTwo_back_card.classList.add('card-hide');
dealerOne_back_card.classList.add('card-hide');
dealerTwo_back_card.classList.add('card-hide');

let dealer_card_array, player_card_array;
let deck;
let showHitCard;
let totalSum = 0,
  dealerTotalSum,
  playerTotalSum;

/** FIRST STEPS TO RUN THE GAME */
newGame();
startGame();

function HAND_IN_PLAY() {
  /**UI UPDATES */
  hide_btn(p_bet_btn);
  show_btn(p_hit_btn);
  show_btn(p_stand_btn);
  remove_back_card();

  /**DEALS FIRST TWO DEALER CARDS AND HIDES SECOND CARD*/
  dealer_card_array = [];
  player_card_array = [];
  dealInitialCards(dealer_card_array, dealer_slot);
  const hidden_card = dealer_slot.querySelector('div:nth-child(2)');
  hidden_card.style.display = 'none';
  dealer_slot.appendChild(dealerTwo_back_card);

  /**DEALS FIRST TWO PLAYER CARDS*/
  dealInitialCards(player_card_array, player_slot);
  playerTotalSum = addCards(player_card_array);
  p_text_update.innerText = `Player: ${playerTotalSum}`;

  /**ORDER OF GAMEPLAY*/
  checkBlackJack(player_card_array, dealer_card_array);
  p_hit_btn.addEventListener('click', playerHit);
  p_stand_btn.addEventListener('click', playerStand);
}

/**FUNCTIONS! */
function newGame() {
  deck = new Deck();
  deck.shuffle();
  console.log(deck);
}

function startGame() {
  /**UI UPDATES EVERY START OF THE GAME */
  show_back_card();
  resetTexts();
  show_btn(p_bet_btn);
  hide_btn(p_hit_btn);
  hide_btn(p_stand_btn);
  /**WHEN PLAYER CLICK START GAME, CARDS WILL BE DEALT */
  p_bet_btn.addEventListener('click', HAND_IN_PLAY, { once: true });
}

function dealInitialCards(array, slot) {
  for (let i = 0; i < 2; i++) {
    let card = deck.pop();
    array.push(card);
    slot.appendChild(card.getHTML());
  }
}

function aceCount(array) {
  //if there are more than one ace in an array and the equal is over 21 then subtract 10

  //map through the whole array and count the aces and add everything

}

function checkBlackJack(player_array, dealer_array) {
  let dealer_total = dealer_array.reduce(getSum, 0);
  let player_total = player_array.reduce(getSum, 0);

  if (player_total == 21 || dealer_total == 21) {
    const hidden_card = dealer_slot.querySelector('div:nth-child(2)');
    dealer_slot.removeChild(dealerTwo_back_card);
    console.log(hidden_card);
    hidden_card.style.display = 'flex';
    // check blackJack
    if (player_total === dealer_total) {
      text_update.textContent = `Tie!`;
      resetGame(player_array, dealer_array);
    } else if (player_total > dealer_total) {
      text_update.textContent = `Player Blackjack!`;
      resetGame(player_array, dealer_array);
    } else if (player_total < dealer_total) {
      text_update.textContent = `Dealer Blackjack!`;
      resetGame(player_array, dealer_array);
    }
  } else {
    return;
  }
  console.log(dealer_total);
  console.log(player_total);
}

function playerHit() {
  hitCard(player_card_array, player_slot);
  playerTotalSum = addCards(player_card_array);
  p_text_update.innerText = `Player: ${playerTotalSum}`;

  if (playerTotalSum > 21) {
    const hidden_card = dealer_slot.querySelector('div:nth-child(2)');
    dealer_slot.removeChild(dealerTwo_back_card);
    console.log(hidden_card);
    hidden_card.style.display = 'flex';
    text_update.innerText = "You bust!"
    resetGame();
  }
}

function playerStand() {
  hide_btn(p_stand_btn);
  hide_btn(p_hit_btn);

  const hidden_card = dealer_slot.querySelector('div:nth-child(2)');
  console.log(hidden_card);
  hidden_card.style.display = 'flex';
  dealer_slot.removeChild(dealerTwo_back_card);
  dealerTotalSum = addCards(dealer_card_array);
  dealer_text_update.innerText = `Dealer: ${dealerTotalSum}`;

  while (dealerTotalSum < 17) {
    hitCard(dealer_card_array, dealer_slot);
    dealerTotalSum = addCards(dealer_card_array);
    dealer_text_update.innerText = `Dealer: ${dealerTotalSum}`;
  }
  if (dealerTotalSum > 21) {
    text_update.innerText = "Dealer bust!";
    resetGame();
  } else
    compareTotal();
}

function compareTotal() {
  console.log(playerTotalSum);
  console.log(dealerTotalSum);

  if (dealerTotalSum === playerTotalSum) {
    text_update.innerText = "Tie!"
    resetGame();
  }
  else if (playerTotalSum > dealerTotalSum) {
    text_update.innerText = "You win!"
    resetGame();
  }
  else if (playerTotalSum < dealerTotalSum) {
    text_update.innerText = "You lose!"
    resetGame();
  }
}

function hitCard(array, slot) {
  let card = deck.pop();
  array.push(card);
  showHitCard = hit_card_element.appendChild(card.getHTML());
  showHitCard.classList.add('card-hit');
  slot.appendChild(showHitCard);
}

function addCards(array) {
  return array.reduce(getSum, 0);
}

function getSum(total, item) {
  return total + CARD_VALUE_MAP[item.value];
}

function resetGame(array1, array2) {
  array1 = [];
  array2 = [];
  p_bet_btn.style.removeProperty('visibility');
  p_hit_btn.style.visibility = 'hidden';
  p_stand_btn.style.visibility = 'hidden';
  p_bet_btn.innerText = 'RESTART';
  p_bet_btn.addEventListener('click', () => {
    clearHTML();
    startGame();
  }, { once: true })
}

/** UI UPDATES FUNCTIONS */
function show_back_card() {
  dealer_slot.appendChild(dealerOne_back_card);
  dealer_slot.appendChild(dealerTwo_back_card);
  player_slot.appendChild(playerOne_back_card);
  player_slot.appendChild(playerTwo_back_card);
}

function remove_back_card() {
  dealer_slot.removeChild(dealerOne_back_card);
  dealer_slot.removeChild(dealerTwo_back_card);
  player_slot.removeChild(playerOne_back_card);
  player_slot.removeChild(playerTwo_back_card);
}

function hide_btn(btn) {
  btn.style.visibility = "hidden";
}

function show_btn(btn) {
  btn.style.removeProperty("visibility");
}

function textUpdate(sum, text) {
  text.innerText = `${sum}`;
}

function resetTexts() {
  text_update.textContent = ``;
  p_text_update.textContent = `You`;
  dealer_text_update.textContent = `Dealer`;
  p_bet_btn.innerText = "START";
}

function clearHTML() {
  let elements = document.getElementsByClassName("innerHtmlCard");
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }

  let hit_card_elements = document.getElementsByClassName("card-hit");
  while (hit_card_elements.length > 0) {
    hit_card_elements[0].parentNode.removeChild(hit_card_elements[0]);
  }
}