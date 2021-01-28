import '../scss/style.scss';
import GAME from './game';

window.onload = () => {
  GAME.init();

  const gameOverModal = document.querySelector('.game-over');
  const newGameButton = gameOverModal.querySelector('.game-over__new-game-btn');
  const overlay = document.getElementById('overlay');

  newGameButton.addEventListener('click', () => {
    gameOverModal.classList.remove('active');
    overlay.classList.remove('active');
    GAME.reset();
    GAME.init();
  });
};
