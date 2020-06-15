'use strict';

(function () {
  var NUMBER_OF_ADVERTISEMENT = 8;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_HEIGHT_ACTIVE = 84;

  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  // Проверяет какая кнопка мыши нажата и запускает функцию активации страницы

  var onPinMousedown = function (evt) {
    if (evt.button === 0) {
      setActiveMode();
    }
  };

  // Проверяет какая клавиша нажата и запускает функцию активации страницы

  var onPinKeydown = function (evt) {
    if (evt.key === 'Enter') {
      setActiveMode();
    }
  };

  // Переводит страницу в активный режим

  var setActiveMode = function () {
    window.mapMethods.makeMapActive();
    window.form.makeAdFormActive();
    window.form.makeFilterFormActive();
    window.mapMethods.renderPins(ads);

    window.form.setPinAddress(MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT_ACTIVE);
    mainPin.removeEventListener('mousedown', onPinMousedown);
    mainPin.removeEventListener('keydown', onPinKeydown);
  };

  // Переводит страницу в неактивный режим

  var setInactiveMode = function () {
    window.mapMethods.makeMapInactive();
    window.form.makeAdFormInactive();
    window.form.makeFilterFormInactive();

    window.form.setPinAddress(MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT / 2);
    mainPin.addEventListener('mousedown', onPinMousedown);
    mainPin.addEventListener('keydown', onPinKeydown);
  };

  var ads = window.data.generateAdvertisementObjects(NUMBER_OF_ADVERTISEMENT);
  setInactiveMode();
})();
