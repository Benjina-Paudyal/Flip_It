
const cardData = [
  { id: 1, name: "Cat", emoji: "🐱" },
  { id: 2, name: "Dog", emoji: "🐶" },
  { id: 3, name: "Fox", emoji: "🦊" },
  { id: 4, name: "Lion", emoji: "🦁" },
  { id: 5, name: "Panda", emoji: "🐼" },
  { id: 6, name: "Koala", emoji: "🐨" },
  { id: 7, name: "Rabbit", emoji: "🐰" },
  { id: 8, name: "Tiger", emoji: "🐯" },
  { id: 9, name: "Mouse", emoji: "🐭" },
  { id: 10, name: "Bear", emoji: "🐻" },
];

const BEGINNER_MAX_CARDS = 6;
const BEGINNER_COLUMNS = 3;
const ADVANCED_COLUMNS = 4;

let flippedCards = [];
let matchedPairs = 0;
let revealCount = 0;
let seconds = 0;
let timerInterval = null;
let timerStarted = false;
let totalPairs = 0;

document.getElementById("back-button").addEventListener("click", () => {
  if (timerInterval) clearInterval(timerInterval);
  timerStarted = false;

  document.getElementById("game-screen").classList.remove("active");
  document.getElementById("menu-screen").classList.add("active");
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
      document.getElementById("timer").textContent = seconds;
    }, 1000);
  }

  card.classList.add("flipped");
  flippedCards.push(card);

  revealCount++;
  document.getElementById("revealCount").textContent = revealCount;

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}


function createCardFront() {
  const cardFront = document.createElement("div");
  cardFront.className = "card-front";

  const pattern = document.createElement("div");
  pattern.className = "pattern";
  pattern.textContent = "♦ ♠ ♣ ♥";

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

  grid.classList.add(cards.length <= BEGINNER_MAX_CARDS ? "grid-beginner" : "grid-advanced");

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


function initGame(numPairs) {
  totalPairs = numPairs;
  matchedPairs = 0;
  revealCount = 0;
  seconds = 0;
  flippedCards = [];
  timerStarted = false;

  if (timerInterval) clearInterval(timerInterval);

  document.getElementById("timer").textContent = "0";
  document.getElementById("revealCount").textContent = "0";

  document.getElementById("menu-screen").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");

  const selected = cardData.slice(0, numPairs);
  const paired = [...selected, ...selected];
  const deck = shuffleCards(paired);
  renderCards(deck);
}


function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.cardId === card2.dataset.cardId) {
    matchedPairs++;
    // 
    if (matchedPairs === totalPairs) {
      clearInterval(timerInterval);

      // The logic trigger for visual celebration
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => alert("Yipppiiiiiiiiiiiii You did it"), 500);
    }
    flippedCards = [];
    
    if (matchedPairs === totalPairs) {
      clearInterval(timerInterval);
      setTimeout(() => alert("Yipppiiiiiiiiiiiii You did it"), 500);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 1000);
  }
}




