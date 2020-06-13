'use strict';

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var NUMBER_OF_ADVERTISEMENT = 8;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 65;
var MAIN_PIN_HEIGHT_ACTIVE = 84;
var LOCATION_X_MIN = 0;
var GUESTS_DECLENSIONS = ['гостя', 'гостей'];
var ROOMS_DECLENSIONS = ['комната', 'комнаты', 'комнат'];
var MIN_TITLE_LENGTH = 30;
var MAX_TITLE_LENGTH = 100;

var map = document.querySelector('.map');
var locationXMax = map.offsetWidth;

var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var addressField = adForm.querySelector('#address');
var roomNumberField = adForm.querySelector('#room_number');
var capacityField = adForm.querySelector('#capacity');
var titleField = adForm.querySelector('#title');
var typeField = adForm.querySelector('#type');
var priceField = adForm.querySelector('#price');
var timeIn = adForm.querySelector('#timein');
var timeOut = adForm.querySelector('#timeout');

var filterForm = document.querySelector('.map__filters');
var filterSelects = filterForm.querySelectorAll('select');
var filterFieldsets = filterForm.querySelectorAll('fieldset');

var mainPin = map.querySelector('.map__pin--main');

// Вычисляет случайное число от min до max

var generateRandomNumber = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

// Выбирает случайное значение из массива данных

var getRandomElement = function (array) {
  var randomNumber = generateRandomNumber(0, (array.length - 1));
  return array[randomNumber];
};

// Формирует случайный массив из массива данных

var getRandomArray = function (items) {
  var j;
  var temp;
  var randomItems = items.slice();
  for (var i = randomItems.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = randomItems[j];
    randomItems[j] = randomItems[i];
    randomItems[i] = temp;
  }
  return randomItems.slice(0, generateRandomNumber(1, randomItems.length));
};


// Генерирует массив объектов из случайных значений

var generateAdvertisementObjects = function (number) {
  var ads = [];
  for (var i = 0; i < number; i++) {
    var locationX = generateRandomNumber(LOCATION_X_MIN, locationXMax);
    var locationY = generateRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX);
    var ad = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: 'Заголовок предложения',
        address: locationX + ', ' + locationY,
        price: generateRandomNumber(0, 1000000),
        type: getRandomElement(TYPES),
        rooms: generateRandomNumber(1, 100),
        guests: generateRandomNumber(1, 300),
        checkin: getRandomElement(CHECKIN_TIMES),
        checkout: getRandomElement(CHECKOUT_TIMES),
        features: getRandomArray(FEATURES),
        description: 'Описание предложения в двух словах',
        photos: getRandomArray(PHOTOS)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
    ads.push(ad);
  }
  return ads;
};

// Генерирует метки карты

var getPinElement = function (ad) {
  var pinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');
  var pinElement = pinTemplate.cloneNode(true);
  var pinElementImg = pinElement.querySelector('img');

  pinElement.style.left = (ad.location.x - PIN_WIDTH / 2) + 'px';
  pinElement.style.top = (ad.location.y - PIN_HEIGHT) + 'px';
  pinElementImg.src = ad.author.avatar;
  pinElementImg.alt = ad.offer.title;

  return pinElement;
};


// Добавляем обработчик собития на пин

var addPinClickHandler = function (pinElement, ad) {
  pinElement.addEventListener('click', function () {
    renderAd(ad);
  });
};

// Добавляет метки на карту

var renderPins = function (ads) {
  var pinsBlock = map.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  ads.forEach(function (ad) {
    var pinElement = getPinElement(ad);
    addPinClickHandler(pinElement, ad);
    fragment.appendChild(pinElement);
  });

  pinsBlock.appendChild(fragment);
};

// Скрывает html элемент

var hideHtmlElement = function (htmlElement) {
  htmlElement.style.display = 'none';
};

// Добавляет фотографии в объявление

var addPhotosToAd = function (adPhotos, photos) {
  if (!photos.length) {
    return false;
  }
  var adImg = adPhotos.querySelector('.popup__photo');
  adPhotos.innerHTML = '';
  var fragment = document.createDocumentFragment();

  photos.forEach(function (photo) {
    var adImgElement = adImg.cloneNode(true);
    adImgElement.src = photo;
    fragment.appendChild(adImgElement);
  });
  adPhotos.appendChild(fragment);
  return true;
};

// Добавляет текст в элементы разметки объявления

var addTextToElement = function (htmlElement, text) {
  if (!text) {
    return false;
  }
  htmlElement.textContent = text;
  return true;
};

// Добавляет цену в объявление

var addPriceToAd = function (adPrice, price) {
  if (!price) {
    return false;
  }
  adPrice.textContent = price + '₽/ночь';
  return true;
};

// Добавляет тип жилья в объявление

var addTypeToAd = function (adType, type) {
  if (!type) {
    return false;
  }
  var typesMap = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };
  adType.textContent = typesMap[type];
  return true;
};

// Определяет склонение "комнат" в зависимости от числа

var declineRooms = function (rooms) {
  if ((rooms % 100 > 4 && rooms % 100 < 20) || rooms % 10 === 0 || rooms % 10 >= 5) {
    return ROOMS_DECLENSIONS[2];
  } else if (rooms % 10 < 5 && rooms % 10 > 1) {
    return ROOMS_DECLENSIONS[1];
  } else {
    return ROOMS_DECLENSIONS[0];
  }
};

// Определяет склонение "гостей" в зависимости от числа

var declineGuests = function (guests) {
  if (guests % 10 !== 1 || guests % 100 === 11) {
    return GUESTS_DECLENSIONS[1];
  } else {
    return GUESTS_DECLENSIONS[0];
  }
};

// Добавляет количество комнат и гостей в объявление

var addCapacityToAd = function (adCapacity, rooms, guests) {
  if (!rooms || !guests) {
    return false;
  }
  adCapacity.textContent = rooms + ' ' + declineRooms(rooms) + ' для ' + guests + ' ' + declineGuests(guests);
  return true;
};

// Добавляет время въезда/выезда в объявление

var addTimesToAd = function (adTiming, checkin, checkout) {
  if (!checkin || !checkout) {
    return false;
  }
  adTiming.textContent = 'Заезд после ' + checkin + ', выезд до ' + checkout;
  return true;
};

// Добавляет аватар в объявление

var addAvatarToAd = function (adAvatar, avatar) {
  if (!avatar) {
    return false;
  }
  adAvatar.src = avatar;
  return true;
};

// Добавляет удобства в объявление

var addFeaturesToAd = function (adFeatures, features) {
  if (!features.length) {
    return false;
  }
  var fragment = document.createDocumentFragment();
  adFeatures.innerHTML = '';

  features.forEach(function (feature) {
    var featureItem = document.createElement('li');
    var featureClass = 'popup__feature--' + feature;
    featureItem.classList.add('popup__feature', featureClass);
    fragment.appendChild(featureItem);
  });

  adFeatures.appendChild(fragment);
  return true;
};

// Добавляет контент или скрывает элемент если контент пустой

var addNotEmptyContent = function (htmlElement, callback, content, extraContent) {
  if (callback(htmlElement, content, extraContent) === false) {
    hideHtmlElement(htmlElement);
  }
};

// Закрывает карточку объявления по нажатию Esc

var onAdEscape = function (evt) {
  if (evt.key === 'Escape') {
    var adElement = map.querySelector('.map__card');
    adElement.remove();

    document.removeEventListener('keydown', onAdEscape);
  }
};


// Создает карточку объявления

var getAdCard = function (ad) {
  var adTemplate = document.querySelector('#card')
      .content
      .querySelector('.map__card');
  var adElement = adTemplate.cloneNode(true);
  var adTitle = adElement.querySelector('.popup__title');
  var adAddress = adElement.querySelector('.popup__text--address');
  var adPrice = adElement.querySelector('.popup__text--price');
  var adType = adElement.querySelector('.popup__type');
  var adCapacity = adElement.querySelector('.popup__text--capacity');
  var adTiming = adElement.querySelector('.popup__text--time');
  var adFeatures = adElement.querySelector('.popup__features');
  var adDescription = adElement.querySelector('.popup__description');
  var adPhotos = adElement.querySelector('.popup__photos');
  var adAvatar = adElement.querySelector('.popup__avatar');
  var adClose = adElement.querySelector('.popup__close');

  addNotEmptyContent(adTitle, addTextToElement, ad.offer.title);
  addNotEmptyContent(adAddress, addTextToElement, ad.offer.address);
  addNotEmptyContent(adPrice, addPriceToAd, ad.offer.price);
  addNotEmptyContent(adType, addTypeToAd, ad.offer.type);
  addNotEmptyContent(adCapacity, addCapacityToAd, ad.offer.rooms, ad.offer.guests);
  addNotEmptyContent(adTiming, addTimesToAd, ad.offer.checkin, ad.offer.checkout);
  addNotEmptyContent(adDescription, addTextToElement, ad.offer.description);
  addNotEmptyContent(adAvatar, addAvatarToAd, ad.author.avatar);
  addNotEmptyContent(adFeatures, addFeaturesToAd, ad.offer.features);
  addNotEmptyContent(adPhotos, addPhotosToAd, ad.offer.photos);

  adClose.addEventListener('click', function () {
    adElement.remove();
  });

  document.addEventListener('keydown', onAdEscape);

  return adElement;
};

// Удаляет карточку объявления, если она уже есть

var removeAd = function (adElement) {
  if (adElement) {
    adElement.remove();
  }
};

// Добавляет карточку объявления на страницу

var renderAd = function (ad) {
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var existingAdCard = map.querySelector('.map__card');
  removeAd(existingAdCard);
  map.insertBefore(getAdCard(ad), mapFiltersContainer);
};

// Переводит карту в активное состояние

var makeMapActive = function () {
  map.classList.remove('map--faded');
};

// Переводит карту в неактивное состояние

var makeMapInactive = function () {
  map.classList.add('map--faded');
};

// Переводит форму в активное состояние

var makeAdFormActive = function () {
  adForm.classList.remove('ad-form--disabled');
};

// Переводит форму в неактивное состояние

var makeAdFormInactive = function () {
  adForm.classList.add('ad-form--disabled');
};

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

// Добавляет адрес в поле адреса в соответствии с положением метки

var setPinAddress = function (pinWidth, pinHeight) {
  var left = mainPin.style.left;
  var top = mainPin.style.top;
  addressField.readOnly = true;
  addressField.value = Math.round(+left.slice(0, left.length - 2) + pinWidth / 2) + ', ' + Math.round(+top.slice(0, top.length - 2) + pinHeight);
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

var onTypeAndPriceChange = function () {
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
  var type = typeField.value;
  var price = priceField.value;
  var message;
  priceField.placeholder = typePriceMap[type].minValue;
  priceField.reportValidity();

  if (!price) {
    message = 'Поле "Цена за ночь" не может быть пустым';
    setInvalidMode(priceField, message);
  } else if (typePriceMap[type].minValue > price) {
    setInvalidMode(priceField, typePriceMap[type].errorText);
    priceField.reportValidity();
  } else if (typePriceMap[type].minValue < price < priceField.max) {
    setValidMode(priceField);
  } else if (price > priceField.max) {
    message = 'Стоимость жилья за ночь не должна превышат 1 000 000 руб.';
    setInvalidMode(priceField, message);
  }
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

// Проверяет какая кнопка мыши нажата и запускает функцию активации карты

var onPinMousedown = function (evt) {
  if (evt.button === 0) {
    setActiveMode();
  }
};

// Проверяет какая клавиша нажата и запускает функцию активации карты

var onPinKeydown = function (evt) {
  if (evt.key === 'Enter') {
    setActiveMode();
  }
};

// Проверяет данные перед отправкой

var onAdFormSubmit = function (evt) {
  evt.preventDefault();
  if (onRoomsAndCapacityChange()) {
    adForm.submit();
  }
};


// Переводит страницу в активный режим

var setActiveMode = function () {
  makeMapActive();
  makeAdFormActive();
  renderPins(ads);
  makeItemsEnabled(adFormFieldsets);
  makeItemsEnabled(filterSelects);
  makeItemsEnabled(filterFieldsets);
  setPinAddress(MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT_ACTIVE);

  mainPin.removeEventListener('mousedown', onPinMousedown);
  mainPin.removeEventListener('keydown', onPinKeydown);

  adForm.addEventListener('submit', onAdFormSubmit);
  roomNumberField.addEventListener('change', onRoomsAndCapacityChange);
  capacityField.addEventListener('change', onRoomsAndCapacityChange);
  titleField.addEventListener('input', onTitleInput);
  typeField.addEventListener('change', onTypeAndPriceChange);
  priceField.addEventListener('input', onTypeAndPriceChange);
  timeIn.addEventListener('change', onTimeInChange);
  timeOut.addEventListener('change', onTimeOutChange);
};

// Переводит страницу в неактивный режим

var setInactiveMode = function () {
  setPinAddress(MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT / 2);
  makeMapInactive();
  makeAdFormInactive();
  makeItemsDisabled(adFormFieldsets);
  makeItemsDisabled(filterSelects);
  makeItemsDisabled(filterFieldsets);

  mainPin.addEventListener('mousedown', onPinMousedown);
  mainPin.addEventListener('keydown', onPinKeydown);

  adForm.removeEventListener('submit', onAdFormSubmit);
  roomNumberField.removeEventListener('change', onRoomsAndCapacityChange);
  capacityField.removeEventListener('change', onRoomsAndCapacityChange);
  titleField.removeEventListener('input', onTitleInput);
  typeField.removeEventListener('change', onTypeAndPriceChange);
  priceField.removeEventListener('input', onTypeAndPriceChange);
  timeIn.removeEventListener('change', onTimeInChange);
  timeOut.removeEventListener('change', onTimeOutChange);
};

var ads = generateAdvertisementObjects(NUMBER_OF_ADVERTISEMENT);

setInactiveMode();
