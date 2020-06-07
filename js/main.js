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
var LOCATION_X_MIN = 0;
var GUESTS_DECLENSIONS = ['гостя', 'гостей'];
var ROOMS_DECLENSIONS = ['комната', 'комнаты', 'комнат'];

var map = document.querySelector('.map');
var locationXMax = map.offsetWidth;

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

// Добавляет метки на карту

var renderPins = function (ads) {
  var pinsBlock = map.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  ads.forEach(function (ad) {
    fragment.appendChild(getPinElement(ad));
  });

  pinsBlock.appendChild(fragment);
};

// Переводит карту в активное состояние

var makeMapActive = function () {
  map.classList.remove('map--faded');
};

// Скрывает html элемент

var hideHtmlElement = function (htmlElement) {
  htmlElement.style.display = 'none';
};

// Добавляет фотографии в объявление

var addPhotosToAd = function (adPhotos, photos) {
  var adImg = adPhotos.querySelector('.popup__photo');
  adPhotos.innerHTML = '';
  var fragment = document.createDocumentFragment();

  photos.forEach(function (photo) {
    var adImgElement = adImg.cloneNode(true);
    adImgElement.src = photo;
    fragment.appendChild(adImgElement);
  });
  adPhotos.appendChild(fragment);
};

// Добавляет текст в элементы разметки объявления

var addTextToElement = function (htmlElement, text) {
  htmlElement.textContent = text;
};

// Добавляет цену в объявление

var addPriceToAd = function (adPrice, price) {
  adPrice.textContent = price + '₽/ночь';
};

// Добавляет тип жилья в объявление

var addTypeToAd = function (adType, type) {
  var typesMap = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };
  adType.textContent = typesMap[type];
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
  adCapacity.textContent = rooms + ' ' + declineRooms(rooms) + ' для ' + guests + ' ' + declineGuests(guests);
};

// Добавляет время въезда/выезда в объявление

var addTimesToAd = function (adTiming, checkin, checkout) {
  adTiming.textContent = 'Заезд после ' + checkin + ', выезд до ' + checkout;
};

// Добавляет аватар в объявление

var addAvatarToAd = function (adAvatar, avatar) {
  adAvatar.src = avatar;
};

// Добавляет удобства в объявление

var addFeaturesToAd = function (adFeatures, features) {
  var fragment = document.createDocumentFragment();
  adFeatures.innerHTML = '';

  features.forEach(function (feature) {
    var clearItem = document.createElement('li');
    var featureClass = 'popup__feature--' + feature;
    clearItem.classList.add('popup__feature', featureClass);
    fragment.appendChild(clearItem);
  });

  adFeatures.appendChild(fragment);
};

// Добавляет контент или скрывает элемент если контент пустой

var addContentOrHide = function (htmlElement, callback, content, extraContent) {
  if (Array.isArray(content)) {
    if (content.length > 0) {
      callback(htmlElement, content);
    } else {
      hideHtmlElement(htmlElement);
    }
  } else if (extraContent !== undefined) {
    if (content && extraContent) {
      callback(htmlElement, content, extraContent);
    } else {
      hideHtmlElement(htmlElement);
    }
  } else {
    if (content) {
      callback(htmlElement, content);
    } else {
      hideHtmlElement(htmlElement);
    }
  }
};

// Создает карточку объявления

var getAdCard = function (ad) {
  var adTemplate = document.querySelector('#card')
      .content
      .querySelector('.map__card');
  var adElement = adTemplate.cloneNode(true);
  var adTitle = adElement.querySelector('.popup__title');
  var adAdress = adElement.querySelector('.popup__text--address');
  var adPrice = adElement.querySelector('.popup__text--price');
  var adType = adElement.querySelector('.popup__type');
  var adCapacity = adElement.querySelector('.popup__text--capacity');
  var adTiming = adElement.querySelector('.popup__text--time');
  var adFeatures = adElement.querySelector('.popup__features');
  var adDescription = adElement.querySelector('.popup__description');
  var adPhotos = adElement.querySelector('.popup__photos');
  var adAvatar = adElement.querySelector('.popup__avatar');

  addContentOrHide(adTitle, addTextToElement, ad.offer.title);
  addContentOrHide(adAdress, addTextToElement, ad.offer.address);
  addContentOrHide(adPrice, addPriceToAd, ad.offer.price);
  addContentOrHide(adType, addTypeToAd, ad.offer.type);
  addContentOrHide(adCapacity, addCapacityToAd, ad.offer.rooms, ad.offer.guests);
  addContentOrHide(adTiming, addTimesToAd, ad.offer.checkin, ad.offer.checkout);
  addContentOrHide(adDescription, addTextToElement, ad.offer.description);
  addContentOrHide(adAvatar, addAvatarToAd, ad.author.avatar);
  addContentOrHide(adFeatures, addFeaturesToAd, ad.offer.features);
  addContentOrHide(adPhotos, addPhotosToAd, ad.offer.photos);

  return adElement;
};

// Добавляет карточку объявления на страницу

var renderAd = function (ad) {
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  map.insertBefore(getAdCard(ad), mapFiltersContainer);
};

var ads = generateAdvertisementObjects(NUMBER_OF_ADVERTISEMENT);
makeMapActive();
renderPins(ads);
renderAd(ads[0]);
