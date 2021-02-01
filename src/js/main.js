import '../scss/style.scss';
import GAME from './game';
import { formatDate } from './utils/helpers';

window.onload = () => {
  GAME.init();

  GAME.DOMElements.gameOverModalElement.querySelector('.game-over__new-game-btn').addEventListener('click', () => {
    GAME.reset();
    GAME.init();
  });

  GAME.DOMElements.settingsModalElement.querySelector('#sound-control').addEventListener('change', () => {
    GAME.state.soundOn = !GAME.state.soundOn;
  });

  GAME.DOMElements.settingsModalElement.querySelector('#aiming-control').addEventListener('change', () => {
    GAME.state.aimingEnabled = !GAME.state.aimingEnabled;
  });

  GAME.DOMElements.settingsModalElement.querySelector('#dark-mode-control').addEventListener('change', () => {
    GAME.state.darkModeEnabled = !GAME.state.darkModeEnabled;
    const { body } = document;
    const { field } = GAME.objects;
    const sidebar = document.querySelector('.sidebar');
    if (GAME.state.darkModeEnabled) {
      body.classList.add('dark');
      field.classList.add('dark');
      sidebar.classList.add('dark');
      GAME.options.FIELD_COLOR = '#231f20';
      GAME.options.SHADOW_COLOR = '#1a1717';
    } else {
      body.classList.remove('dark');
      field.classList.remove('dark');
      sidebar.classList.remove('dark');
      GAME.options.FIELD_COLOR = '#e5e5e5';
      GAME.options.SHADOW_COLOR = '#cccccc';
    }
    GAME.strictClearField();
    GAME.redrawObjects();
  });

  GAME.DOMElements.newRecordModalElement.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const nameField = document.getElementById('name');
    const { score } = document.querySelector('.new-record .game-over__score').dataset;
    GAME.DBManager.addRecord({ name: nameField.value, score, date: formatDate(Date.now()) });
    GAME.DOMElements.newRecordModalElement.classList.remove('active');
    GAME.DOMElements.overlayElement.classList.remove('active');
    GAME.reset();
    GAME.init();
  });
};
