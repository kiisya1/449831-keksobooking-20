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

var ads = generateAdvertisementObjects(NUMBER_OF_ADVERTISEMENT);
makeMapActive();
renderPins(ads);
