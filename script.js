import Deck from './deck.js'

const CARD_VALUE_MAP = {
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


const playerCardOne = document.querySelector('.player-card-one');
const playerCardTwo = document.querySelector('.player-card-two');
const computerCardOne = document.querySelector('.computer-card-one');
const computerCardTwo = document.querySelector('.computer-card-two');

const playerSideElement = document.querySelector('.playerSide');
const playerBetButton = document.querySelector('.player-start-btn');
const playerHitButton = document.querySelector('.player-hit-btn');
const textUpdate = document.querySelector('.text-update');
const tableContainer = document.querySelector('.container');

const hitCardElement = document.createElement('div');

let randomCardPlayerOne, randomCardPlayerTwo, randomCardComputerOne, randomCardComputerTwo, deck, startHitting, hitCard, total, newTotal;


playerBetButton.addEventListener('click', () => {
  dealCards();
  startHitting = true;

}, { once: true });



startGame();
function startGame() {
  deck = new Deck();
  deck.shuffle();

  playerCardOne.classList.add('card-hide');
  playerCardTwo.classList.add('card-hide');
  computerCardOne.classList.add('card-hide');
  computerCardTwo.classList.add('card-hide');

}

function dealCards() {

  randomCardPlayerOne = deck.pop();
  randomCardPlayerTwo = deck.pop();
  randomCardComputerOne = deck.pop();
  randomCardComputerTwo = deck.pop();

  playerCardOne.appendChild(randomCardPlayerOne.getHTML());
  playerCardTwo.appendChild(randomCardPlayerTwo.getHTML());
  computerCardOne.appendChild(randomCardComputerOne.getHTML());
  computerCardTwo.appendChild(randomCardComputerTwo.getHTML());

  if (isBlackJack(randomCardPlayerOne, randomCardPlayerTwo)) {
    textUpdate.innerText = 'You Win! BlackJack!';
    tableContainer.appendChild(textUpdate);

  } else {
    let total = (addStartingCards(randomCardPlayerOne, randomCardPlayerTwo));
    textUpdate.innerText = `You have: ${total}`;
    tableContainer.appendChild(textUpdate);

    playerHitButton.addEventListener('click', () => {
      if (startHitting) {
        playerHit();
        console.log(total)
        console.log(hitCard.value)
        let newTotal = (Number(total) + Number(CARD_VALUE_MAP[hitCard.value]));
        console.log(newTotal);

        textUpdate.innerText = `You now have: ${newTotal}`;
        tableContainer.appendChild(textUpdate);

        if (newTotal <= 21) {
          let addedTotal = (Number(newTotal) + Number(CARD_VALUE_MAP[hitCard.value]));
          console.log(addedTotal);
          // textUpdate.innerText = `You now have: ${addedTotal}`;
          // tableContainer.appendChild(textUpdate);


        } else {
          console.log('BUST');
          textUpdate.innerText = `You BUST!`;
          tableContainer.appendChild(textUpdate);
        }
      }

    })
  }



}


function playerHit() {
  hitCard = deck.pop();

  const showHitCard = hitCardElement.appendChild(hitCard.getHTML())
  showHitCard.classList.add('card-hit');
  playerSideElement.appendChild(showHitCard)

}

function isBlackJack(cardOne, cardTwo) {
  return (CARD_VALUE_MAP[cardOne.value] + CARD_VALUE_MAP[cardTwo.value]) === 21;
}

function addStartingCards(cardOne, cardTwo) {
  return (CARD_VALUE_MAP[cardOne.value] + CARD_VALUE_MAP[cardTwo.value]);
}

function addHitCard(firstTwoTotal, hitNum) {
  return (CARD_VALUE_MAP[firstTwoTotal.value] + CARD_VALUE_MAP[hitNum.value]);
}

const playerCardArray = [randomCardPlayerOne, randomCardPlayerTwo, hitCard];
console.log(playerCardArray);










// const computerCardSlot = document.querySelector('.computer-card-slot');
// const playerCardSlot = document.querySelector('.player-card-slot');
// const computerDeckElement = document.querySelector('.computer-deck');
// const playerDeckElement = document.querySelector('.player-deck');
// const text = document.querySelector('.text');

// let playerDeck, computerDeck, inRound, stop;

// document.addEventListener('click', () => {
//   if (stop) {
//     startGame();
//     return;
//   }

//   if (inRound) {
//     cleanBeforeRound();
//   } else {
//     flipCards();
//   }
// })

// startGame();
// function startGame() {
//   const deck = new Deck();
//   deck.shuffle();

//   const deckMidpoint = Math.ceil(deck.numberOfCards / 2);
//   playerDeck = new Deck(deck.cards.slice(0, deckMidpoint));
//   computerDeck = new Deck(deck.cards.slice(deckMidpoint, deck.numberOfCards));
//   inRound = false;
//   stop = false;


//   cleanBeforeRound();
// }

// function cleanBeforeRound() {
//   inRound = false;
//   computerCardSlot.innerHTML = "";
//   playerCardSlot.innerHTML = "";
//   text.innerText = "";

//   updateDeckCount();
// }

// function flipCards() {
//   inRound = true;

//   const playerCard = playerDeck.pop();
//   const computerCard = computerDeck.pop();

//   computerCardSlot.appendChild(computerCard.getHTML());
//   playerCardSlot.appendChild(playerCard.getHTML())

//   updateDeckCount();

//   if (isRoundWinner(playerCard, computerCard)) {
//     text.innerText = "Win"
//     playerDeck.push(playerCard);
//     playerDeck.push(computerCard);
//   } else if (isRoundWinner(computerCard, playerCard)) {
//     text.innerText = "Lose"
//     computerDeck.push(playerCard);
//     computerDeck.push(computerCard);
//   } else {
//     text.innerText = "Draw"
//     playerDeck.push(playerCard);
//     computerDeck.push(computerCard);
//   }

//   if (isGameOver(playerDeck)) {
//     text.innerText = 'You Lose';
//     stop = true;
//   } else if (isGameOver(computerDeck)) {
//     text.innerText = 'You Win';
//     stop = true;
//   }
// }

// function updateDeckCount() {
//   computerDeckElement.innerText = computerDeck.numberOfCards;
//   playerDeckElement.innerText = playerDeck.numberOfCards;
// }

// function isRoundWinner(cardOne, cardTwo) {
//   return CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value];
// }

// function isGameOver(deck) {
//   return deck.numberOfCards === 0;
// }

