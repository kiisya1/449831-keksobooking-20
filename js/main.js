'use strict';

(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_HEIGHT_ACTIVE = 84;

  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  // var generateAdsObjects = window.data.generate;

  var makeMapActive = window.mapMethods.activate;
  var makeMapInactive = window.mapMethods.deactivate;
  var renderPins = window.mapMethods.renderPins;

  var makeAdFormActive = window.form.activate;
  var makeAdFormInactive = window.form.deactivate;
  var setPinAddress = window.form.setPinAddress;

  var makeFilterActive = window.filter.activate;
  var makeFilterInactive = window.filter.deactivate;

  var onMainPinMousedown = window.mainPin.mousedown;

  var loadAds = window.backend.load;

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
    makeMapActive();
    makeAdFormActive();
    makeFilterActive();

    setPinAddress(MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT_ACTIVE);
    loadAds(renderPins, alert);
    mainPin.removeEventListener('mousedown', onPinMousedown);
    mainPin.removeEventListener('keydown', onPinKeydown);

    mainPin.addEventListener('mousedown', onMainPinMousedown);
  };

  // Переводит страницу в неактивный режим

  var setInactiveMode = function () {
    makeMapInactive();
    makeAdFormInactive();
    makeFilterInactive();

    setPinAddress(MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT / 2);
    mainPin.removeEventListener('mousedown', onMainPinMousedown);

    mainPin.addEventListener('mousedown', onPinMousedown);
    mainPin.addEventListener('keydown', onPinKeydown);
  };

  // var ads = generateAdsObjects(NUMBER_OF_ADVERTISEMENT);
  setInactiveMode();
})();
