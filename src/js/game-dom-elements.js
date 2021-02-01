const gameDOMElements = {
  gameOverModalElement: document.querySelector('.game-over'),
  newRecordModalElement: document.querySelector('.new-record'),
  overlayElement: document.querySelector('#overlay'),
  scoreElements: document.querySelectorAll('[data-score]'),
  ballsElement: document.querySelector('.balls'),
  recordElement: document.querySelector('.record'),
  settingsMenuItemElement: document.querySelector('.settings-item'),
  bestPlayersMenuItemElement: document.querySelector('.best-players-item'),
  aboutMenuItemElement: document.querySelector('.about-item'),
  settingsModalElement: document.querySelector('.settings'),
  bestPlayersModalElement: document.querySelector('.best-players'),
  aboutModalElement: document.querySelector('.about'),
  tableElement: document.querySelector('.best-players__table'),
  blockBumpSound: new Audio('../../assets/audio/block-bump.mp3'),
  bonusBumpSound: new Audio('../../assets/audio/bonus-bump.mp3'),
  newStageSound: new Audio('../../assets/audio/new-stage.mp3'),
  gameOverSound: new Audio('../../assets/audio/game-over.mp3')
};

gameDOMElements.gameOverModalElement.querySelector('.game-over__new-game-btn').addEventListener('click', () => {
  gameDOMElements.gameOverModalElement.classList.remove('active');
  gameDOMElements.overlayElement.classList.remove('active');
});

gameDOMElements.settingsMenuItemElement.addEventListener('click', () => {
  gameDOMElements.settingsModalElement.classList.add('active');
  gameDOMElements.overlayElement.classList.add('active');
});

gameDOMElements.bestPlayersMenuItemElement.addEventListener('click', () => {
  gameDOMElements.bestPlayersModalElement.classList.add('active');
  gameDOMElements.overlayElement.classList.add('active');
});

gameDOMElements.aboutMenuItemElement.addEventListener('click', () => {
  gameDOMElements.aboutModalElement.classList.add('active');
  gameDOMElements.overlayElement.classList.add('active');
});

const modalCards = document.querySelectorAll('.modal-card');
modalCards.forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-card__close-button')) {
      modal.classList.remove('active');
      gameDOMElements.overlayElement.classList.remove('active');
    }
  });
});

export default gameDOMElements;
