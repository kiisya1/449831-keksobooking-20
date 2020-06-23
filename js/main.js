'use strict';

(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65;
  var MAIN_PIN_HEIGHT_ACTIVE = 84;

  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  var adForm = document.querySelector('.ad-form');
  var resetButton = adForm.querySelector('.ad-form__reset');

  var makeMapActive = window.mapMethods.activate;
  var makeMapInactive = window.mapMethods.deactivate;
  var renderPins = window.mapMethods.renderPins;

  var makeAdFormActive = window.form.activate;
  var makeAdFormInactive = window.form.deactivate;
  var setPinAddress = window.form.setPinAddress;
  var onRoomsAndCapacityChange = window.form.onRoomsAndCapacityChange;

  var makeFilterActive = window.filter.activate;
  var makeFilterInactive = window.filter.deactivate;

  var onMainPinMousedown = window.mainPin.mousedown;
  var setPinStartState = window.mainPin.setStartState;

  var loadAds = window.backend.load;
  var uploadFormData = window.backend.upload;

  var addErrorMessage = window.message.addError;
  var addSuccessMessage = window.message.addSuccess;

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

  // Рендерит объявления, если загрузка была успешной

  var onLoadAdsSuccess = function (ads) {
    renderPins(ads);
  };

  // Показывает ошибку, если что-то пошло не так

  var onLoadAdsError = function (errorMessage) {
    var message = 'Ошибка загрузки объявлений: ' + errorMessage;
    addErrorMessage(message);
  };

  // Показывает ошибку, если данные формы не удалось отправить

  var onUploadAdError = function (error) {
    addErrorMessage(error);
  };

  // Показывает сообщение об успешной отправке формы и переводит страницу в неактивное состояние

  var onUploadAdSuccess = function () {
    addSuccessMessage();
    setInactiveMode();
  };

  // Проверяет данные перед отправкой и отправляет данные формы

  var onAdFormSubmit = function (evt) {
    evt.preventDefault();
    if (onRoomsAndCapacityChange()) {
      uploadFormData(new FormData(adForm), onUploadAdSuccess, onUploadAdError);
    }
  };

  // Переводит страницу в неактивное состояние по нажатию кнопки

  var onResetButtonClick = function () {
    setInactiveMode();
  };

  // Переводит страницу в активный режим

  var setActiveMode = function () {
    makeMapActive();
    makeAdFormActive();
    makeFilterActive();

    setPinAddress(MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT_ACTIVE);
    loadAds(onLoadAdsSuccess, onLoadAdsError);

    adForm.addEventListener('submit', onAdFormSubmit);
    resetButton.addEventListener('click', onResetButtonClick);
    mainPin.removeEventListener('mousedown', onPinMousedown);
    mainPin.removeEventListener('keydown', onPinKeydown);

    mainPin.addEventListener('mousedown', onMainPinMousedown);
  };

  // Переводит страницу в неактивный режим

  var setInactiveMode = function () {
    makeMapInactive();
    makeAdFormInactive();
    makeFilterInactive();
    setPinStartState();

    setPinAddress(MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT / 2);
    mainPin.removeEventListener('mousedown', onMainPinMousedown);
    adForm.removeEventListener('submit', onAdFormSubmit);
    resetButton.removeEventListener('click', onResetButtonClick);

    mainPin.addEventListener('mousedown', onPinMousedown);
    mainPin.addEventListener('keydown', onPinKeydown);
  };

  setInactiveMode();
})();
