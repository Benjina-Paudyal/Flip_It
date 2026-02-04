//Data
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

// Variables
let flippedCards = [];
let matchedPairs = 0;
let revealCount = 0;
let seconds = 0;
let timerInterval = null;
let timerStarted = false;
let TOTAL_PAIRS = 0;

// Back to Menu button
document.getElementById("back-button").addEventListener("click", () => {
  if (timerInterval) clearInterval(timerInterval);
  timerStarted = false;

  document.getElementById("game-screen").classList.remove("active");
  document.getElementById("menu-screen").classList.add("active");
});

// Shuffle array: Fisher-Yates Algorithm
function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // let a = 1; b = 2; [a,b] = [b,a]
  }
  return shuffled;
}

// Render cards in the grid
function renderCards(cards) {
  const grid = document.getElementById("cardsGrid");
  grid.innerHTML = "";

  if (cards.length <= 6) {
    grid.style.gridTemplateColumns = "repeat(3, 100px)";
  } else {
    grid.style.gridTemplateColumns = "repeat(4, 100px)";
  }

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.className = "card";
    cardElement.dataset.cardId = card.id;

    cardElement.innerHTML = `
        <div class = "card-inner">
            <div class="card-front">
                <div class="pattern"> ♦ ♠ ♣ ♥ </div>
            </div>

            <div class="card-back">
                <div class="emoji">${card.emoji}</div>
                <div class="name">${card.name}</div>
            </div>
        </div>`;

    cardElement.addEventListener("click", handleCardClick);
    grid.appendChild(cardElement);
  });
}

// Start the game
function initGame(numPairs) {
  TOTAL_PAIRS = numPairs;
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
  const deck = shuffle(paired);
  renderCards(deck);
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

function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.cardId === card2.dataset.cardId) {
    matchedPairs++;
    flippedCards = [];
    if (matchedPairs === TOTAL_PAIRS) {
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
