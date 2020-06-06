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

// Определяет тип жилья в объявлении

var getHousingType = function (type) {
  if (type === 'flat') {
    return 'Квартира';
  } else if (type === 'bungalo') {
    return 'Бунгало';
  } else if (type === 'house') {
    return 'Дом';
  } else {
    return 'Дворец';
  }
};

// Скрывает html элемент

var hideHtmlElement = function (htmlElement) {
  htmlElement.style.display = 'none';
};

// Добавляет фотографии в объявление

var addPhotosToAd = function (adPhotos, photos) {
  var adImg = adPhotos.querySelector('.popup__photo');
  var fragment = document.createDocumentFragment();
  if (photos.length > 0) {
    photos.forEach(function (photo, i) {
      if (i === 0) {
        adImg.src = photo;
      } else {
        var adImgElement = adImg.cloneNode(true);
        adImgElement.src = photo;
        fragment.appendChild(adImgElement);
      }
    });
    adPhotos.appendChild(fragment);
  } else {
    hideHtmlElement(adPhotos);
  }
};

// Добавляет текст в элементы разметки объявления

var addTextToElement = function (htmlElement, text) {
  if (text) {
    htmlElement.textContent = text;
  } else {
    hideHtmlElement(htmlElement);
  }
};

// Добавляет цену в объявление

var addPriceToAd = function (adPrice, price) {
  if (price) {
    adPrice.textContent = price + '₽/ночь';
  } else {
    hideHtmlElement(adPrice);
  }
};

// Добавляет тип жилья в объявление

var addTypeToAd = function (adType, type) {
  if (type) {
    adType.textContent = getHousingType(type);
  } else {
    hideHtmlElement(adType);
  }
};

// Добавляет количество комнат и гостей в объявление

var addСapacityToAd = function (adСapacity, rooms, guests) {
  if (rooms && guests) {
    adСapacity.textContent = rooms + ' комнаты для ' + guests + ' гостей';
  } else {
    hideHtmlElement(adСapacity);
  }
};

// Добавляет время въезда/выезда в объявление

var addTimesToAd = function (adTiming, checkin, checkout) {
  if (checkin && checkout) {
    adTiming.textContent = 'Заезд после ' + checkin + ', выезд до ' + checkout;
  } else {
    hideHtmlElement(adTiming);
  }
};

// Добавляет аватар в объявление

var addAvatarToAd = function (adAvatar, avatar) {
  if (avatar) {
    adAvatar.src = avatar;
  } else {
    hideHtmlElement(adAvatar);
  }
};

// Добавляет удобства в объявление

var addFeaturesToAd = function (adFeatures, features) {
  if (features.length > 0) {
    var fragment = document.createDocumentFragment();
    var featuresItems = adFeatures.querySelectorAll('.popup__feature');

    features.forEach(function (feature) {
      var clearItem = document.createElement('li');
      var featureClass = 'popup__feature--' + feature;
      clearItem.classList.add('popup__feature', featureClass);
      fragment.appendChild(clearItem);
    });

    featuresItems.forEach(function (featuresItem) {
      featuresItem.remove();
    });
    adFeatures.appendChild(fragment);
  } else {
    hideHtmlElement(adFeatures);
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
  var adСapacity = adElement.querySelector('.popup__text--capacity');
  var adTiming = adElement.querySelector('.popup__text--time');
  var adFeatures = adElement.querySelector('.popup__features');
  var adDescription = adElement.querySelector('.popup__description');
  var adPhotos = adElement.querySelector('.popup__photos');
  var adAvatar = adElement.querySelector('.popup__avatar');

  addTextToElement(adTitle, ad.offer.title);
  addTextToElement(adAdress, ad.offer.address);
  addPriceToAd(adPrice, ad.offer.price);
  addTypeToAd(adType, ad.offer.type);
  addСapacityToAd(adСapacity, ad.offer.rooms, ad.offer.guests);
  addTimesToAd(adTiming, ad.offer.checkin, ad.offer.checkout);
  addTextToElement(adDescription, ad.offer.description);
  addAvatarToAd(adAvatar, ad.author.avata);
  addFeaturesToAd(adFeatures, ad.offer.features);
  addPhotosToAd(adPhotos, ad.offer.photos);

  return adElement;
};

// Добавляет карточку объявления на страницу

var renderAd = function (ads) {
  var mapFilterContainer = map.querySelector('.map__filters-container');
  map.insertBefore(getAdCard(ads[0]), mapFilterContainer);
};

var ads = generateAdvertisementObjects(NUMBER_OF_ADVERTISEMENT);
makeMapActive();
renderPins(ads);
renderAd(ads);
