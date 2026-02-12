const BEGINNER_MAX_CARDS = 6;
const BEGINNER_COLUMNS = 3;
const ADVANCED_COLUMNS = 4;
const CARD_SYMBOLS = "♦ ♠ ♣ ♥";
const TIMER_ID = "timer";
const REVEAL_COUNT_ID = "revealCount";

let cardData = [];
let flippedCards = [];
let matchedPairs = 0;
let revealCount = 0;
let seconds = 0;
let timerInterval = null;
let timerStarted = false;
let totalPairs = 0;

const timerEl = document.getElementById("timer");
const revealCountEl = document.getElementById("revealCount");
const menuScreen = document.getElementById("menu-screen");
const gameScreen = document.getElementById("game-screen");
const victoryScreen = document.getElementById("victory-screen");
const backButton = document.getElementById("back-button");


async function loadCards() {
  try {
    const response = await fetch("/api/cards");
    if (!response.ok) throw new Error("Network response was not OK");
    cardData = await response.json();
  } catch (error) {
    console.error("Failed to load cards:", error);
    alert("Failed to load cards. Please try again later.");
  }
}


backButton.addEventListener("click", () => {
  if (timerInterval) clearInterval(timerInterval);
  timerStarted = false;

  gameScreen.classList.remove("active");
  menuScreen.classList.add("active");
});


function shuffleCards(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}


function handleCardClick(event) {
  const card = event.currentTarget;

  if (flippedCards.length === 2 || card.classList.contains("flipped")) return;

  if (!timerStarted) {
    timerStarted = true;
    timerInterval = setInterval(() => {
      seconds++;
      timerEl.textContent = seconds;
    }, 1000);
  }

  card.classList.add("flipped");
  flippedCards.push(card);

  revealCount++;
  revealCountEl.textContent = revealCount;

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}


function createCardFront() {
  const cardFront = document.createElement("div");
  cardFront.className = "card-front";

  const pattern = document.createElement("div");
  pattern.className = "pattern";
  pattern.textContent = CARD_SYMBOLS;

  cardFront.appendChild(pattern);
  return cardFront;
}


function createCardBack(card) {
  const cardBack = document.createElement("div");
  cardBack.className = "card-back";

  const emoji = document.createElement("div");
  emoji.className = "emoji";
  emoji.textContent = card.emoji;

  const name = document.createElement("div");
  name.className = "name";
  name.textContent = card.name;

  cardBack.appendChild(emoji);
  cardBack.appendChild(name);

  return cardBack;
}


function renderCards(cards) {
  const grid = document.getElementById("cardsGrid");
  grid.innerHTML = "";
  grid.classList.remove("grid-beginner", "grid-advanced");

  grid.classList.add(
    cards.length <= BEGINNER_MAX_CARDS ? "grid-beginner" : "grid-advanced",
  );

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.dataset.cardId = card.id;

    const cardInner = document.createElement("div");
    cardInner.className = "card-inner";

    cardInner.appendChild(createCardFront());
    cardInner.appendChild(createCardBack(card));

    cardElement.appendChild(cardInner);
    cardElement.addEventListener("click", handleCardClick);
    grid.appendChild(cardElement);
  });
}


async function initGame(numPairs) {
  await loadCards();

  totalPairs = numPairs;
  matchedPairs = 0;
  revealCount = 0;
  seconds = 0;
  flippedCards = [];
  timerStarted = false;

  if (timerInterval) clearInterval(timerInterval);

  timerEl.textContent = "0";
  revealCountEl.textContent = "0";

  menuScreen.classList.remove("active");
  gameScreen.classList.add("active");

  const selected = cardData.slice(0, numPairs);
  const paired = [...selected, ...selected];
  const deck = shuffleCards(paired);
  renderCards(deck);
}


function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.cardId === card2.dataset.cardId) {
    matchedPairs++;

    setTimeout(() => {
      card1.classList.add("matched");
      card2.classList.add("matched");

      if (matchedPairs === totalPairs) {
        clearInterval(timerInterval);

        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
        });

        setTimeout(() => {
          victoryScreen.style.display = "flex";
        }, 500);
      }
      flippedCards = [];
    }, 700);
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 1000);
  }
}
