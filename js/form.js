'use strict';

(function () {
  var MIN_TITLE_LENGTH = 30;
  var MAX_TITLE_LENGTH = 100;

  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  var titleField = adForm.querySelector('#title');
  var addressField = adForm.querySelector('#address');
  var timeOut = adForm.querySelector('#timeout');
  var timeIn = adForm.querySelector('#timein');
  var typeField = adForm.querySelector('#type');
  var priceField = adForm.querySelector('#price');
  var roomNumberField = adForm.querySelector('#room_number');
  var capacityField = adForm.querySelector('#capacity');

  // Убирает у каждого элемента массива атрибут disabled

  var makeItemsEnabled = function (items) {
    items.forEach(function (item) {
      item.disabled = false;
    });
  };

  // Добавляет каждому элементу массива атрибут disabled

  var makeItemsDisabled = function (items) {
    items.forEach(function (item) {
      item.disabled = true;
    });
  };

  // Добавляет красную рамку элементам формы

  var addRedBorder = function (formElement) {
    formElement.style.border = '2px solid red';
  };

  // Убирает рамку элемента формы

  var removeBorder = function (formElement) {
    formElement.style.border = 'none';
  };

  // Добавляет рамку и сообщение невалидному полю

  var setInvalidMode = function (element, message) {
    addRedBorder(element);
    element.setCustomValidity(message);
  };

  // Убирает рамку и сообщение у валидного поля

  var setValidMode = function (element) {
    removeBorder(element);
    element.setCustomValidity('');
  };

  // Проверяет длину заголовка на соответвие требованиям

  var onTitleInput = function (evt) {
    var valueLength = evt.target.value.length;
    evt.target.reportValidity();
    var message;
    if (valueLength < MIN_TITLE_LENGTH) {
      message = 'Минимальная длина заголовка: 30 символов. Введите еще ' + (MIN_TITLE_LENGTH - valueLength) + ' симв.';
      setInvalidMode(evt.target, message);
    } else if (valueLength > MAX_TITLE_LENGTH) {
      message = 'Максимальная длина заголовка: 100 символов. Удалите лишние ' + (valueLength - MAX_TITLE_LENGTH) + ' симв.';
      setInvalidMode(evt.target, message);
    } else if (valueLength === 0) {
      message = 'Поле "Заголовок" не может быть пустым';
      setInvalidMode(evt.target, message);
    } else {
      setValidMode(evt.target);
    }
  };


  // Синхронизирует поле Время заезда с полем Время выезда

  var onTimeInChange = function (evt) {
    var optionsTimeOut = timeOut.querySelectorAll('option');
    for (var i = 0; i < optionsTimeOut.length; i++) {
      if (optionsTimeOut[i].value === evt.target.value) {
        optionsTimeOut[i].selected = true;
      }
    }
  };

  // Синхронизирует поле Время выезда с полем Время заезда

  var onTimeOutChange = function (evt) {
    var optionsTimeIn = timeIn.querySelectorAll('option');
    for (var i = 0; i < optionsTimeIn.length; i++) {
      if (optionsTimeIn[i].value === evt.target.value) {
        optionsTimeIn[i].selected = true;
      }
    }
  };

  // Проверяет соответсвие значений в поле тип жилья и стоимость за ночь

  var typePriceMap = {
    'bungalo': {
      minValue: 0,
      errorText: ''
    },
    'flat': {
      minValue: 1000,
      errorText: 'Стоимость жилья типа "Квартира" не может быть меньше 1 000 руб. за ночь'
    },
    'house': {
      minValue: 5000,
      errorText: 'Стоимость жилья типа "Дом" не может быть меньше 5 000 руб. за ночь'
    },
    'palace': {
      minValue: 10000,
      errorText: 'Стоимость жилья типа "Дворец" не может быть меньше 10 000 руб. за ночь'
    }
  };

  var onTypeChange = function () {
    var type = typeField.value;
    priceField.placeholder = typePriceMap[type].minValue;
    priceField.min = typePriceMap[type].minValue;
  };

  var onPriceInput = function (evt) {
    onTypeChange();

    var type = typeField.value;
    if (evt.target.validity.rangeUnderflow) {
      setInvalidMode(priceField, typePriceMap[type].errorText);
    } else if (evt.target.validity.rangeOverflow) {
      setInvalidMode(priceField, 'Стоимость жилья за ночь не должна превышат 1 000 000 руб.');
    } else if (evt.target.validity.valueMissing) {
      setInvalidMode(priceField, 'Поле "Цена за ночь" не может быть пустым');
    } else {
      setValidMode(priceField);
    }
    priceField.reportValidity();
  };

  // Проверяет соответсвие значения в поле выбора количества гостей значению количества комнат

  var onRoomsAndCapacityChange = function () {
    var roomsCapacityMap = {
      '1': {
        guests: ['1'],
        errorText: 'В одну комнату можно поселить только одного гостя'
      },
      '2': {
        guests: ['1', '2'],
        errorText: 'В две комнаты можно поселить только одного или двух гостей'
      },
      '3': {
        guests: ['1', '2', '3'],
        errorText: 'Три комнаты могут вместить 1, 2 или 3 гостей. Значение "не для гостей" недопустимо'
      },
      '100': {
        guests: ['0'],
        errorText: 'В 100 комнат нельзя селить гостей. Измените значение поля на "не для гостей"'
      }
    };
    var roomsCount = roomNumberField.value;
    var guestsCount = capacityField.value;
    if (!roomsCapacityMap[roomsCount].guests.includes(guestsCount)) {
      setInvalidMode(capacityField, roomsCapacityMap[roomsCount].errorText);
      capacityField.reportValidity();
      return false;
    } else {
      setValidMode(capacityField);
      return true;
    }
  };

  // Проверяет данные перед отправкой

  var onAdFormSubmit = function (evt) {
    evt.preventDefault();
    if (onRoomsAndCapacityChange()) {
      adForm.submit();
    }
  };

  // Переводит форму в активное состояние

  var makeAdFormActive = function () {
    adForm.classList.remove('ad-form--disabled');
    makeItemsEnabled(adFormFieldsets);

    adForm.addEventListener('submit', onAdFormSubmit);
    roomNumberField.addEventListener('change', onRoomsAndCapacityChange);
    capacityField.addEventListener('change', onRoomsAndCapacityChange);
    titleField.addEventListener('input', onTitleInput);
    typeField.addEventListener('change', onTypeChange);
    priceField.addEventListener('input', onPriceInput);
    timeIn.addEventListener('change', onTimeInChange);
    timeOut.addEventListener('change', onTimeOutChange);
  };

  // Переводит форму в неактивное состояние

  var makeAdFormInactive = function () {
    adForm.classList.add('ad-form--disabled');
    makeItemsDisabled(adFormFieldsets);

    adForm.removeEventListener('submit', onAdFormSubmit);
    roomNumberField.removeEventListener('change', onRoomsAndCapacityChange);
    capacityField.removeEventListener('change', onRoomsAndCapacityChange);
    titleField.removeEventListener('input', onTitleInput);
    typeField.removeEventListener('change', onTypeChange);
    priceField.removeEventListener('input', onPriceInput);
    timeIn.removeEventListener('change', onTimeInChange);
    timeOut.removeEventListener('change', onTimeOutChange);
  };

  // Добавляет адрес в поле адреса в соответствии с положением метки

  var setPinAddress = function (pinWidth, pinHeight) {
    var left = mainPin.style.left;
    var top = mainPin.style.top;
    addressField.readOnly = true;
    addressField.value = Math.round(+left.slice(0, left.length - 2) + pinWidth / 2) + ', ' + Math.round(+top.slice(0, top.length - 2) + pinHeight);
  };

  window.form = {
    activate: makeAdFormActive,
    deactivate: makeAdFormInactive,
    setPinAddress: setPinAddress,
    disableItems: makeItemsDisabled,
    enableItems: makeItemsEnabled
  };

})();
