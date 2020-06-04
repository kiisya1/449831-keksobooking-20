'use strict';

var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var CHECKOUT = ['12:00', '13:00', '14:00'];
var CHECKIN = ['12:00', '13:00', '14:00'];
var TYPE = ['palace', 'flat', 'house', 'bungalo'];
var NUMBER_OF_ADVERTISEMENT = 8;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;

var map = document.querySelector('.map');

// Вычисляет случайное число от min до max

var generateRandomNumber = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

// Выбирает случайное значение из массива данных

var getRandomElement = function (array, flag) {
  if (flag === 'one') {
    var randomNumber = generateRandomNumber(0, (array.length - 1));
    return array[randomNumber];
  } else {
    var newArray = [];
    for (var j = 0; j < generateRandomNumber(1, array.length); j++) {
      newArray.push(array[j]);
    }
    return newArray;
  }
};

// Генерирует массив объектов из случайных значений

var generateAdvertisementObjects = function (number) {
  var ads = [];
  for (var i = 0; i < number; i++) {
    var ad = {};
    ad.author = {};
    ad.offer = {};
    ad.location = {};
    ad.author.avatar = 'img/avatars/user0' + (i + 1) + '.png';
    ad.offer.title = 'Заголовок предложения';
    ad.location.x = generateRandomNumber(0, map.offsetWidth);
    ad.location.y = generateRandomNumber(LOCATION_Y_MIN, LOCATION_Y_MAX);
    ad.offer.address = ad.location.x + ', ' + ad.location.y;
    ad.offer.price = generateRandomNumber(0, 1000000);
    ad.offer.type = getRandomElement(TYPE, 'one');
    ad.offer.rooms = generateRandomNumber(1, 100);
    ad.offer.guests = generateRandomNumber(1, 300);
    ad.offer.checkin = getRandomElement(CHECKIN, 'one');
    ad.offer.checkout = getRandomElement(CHECKOUT, 'one');
    ad.offer.features = getRandomElement(FEATURES, 'many');
    ad.offer.description = 'Описание предложения в двух словах';
    ad.offer.description = 'Описание предложения в двух словах';
    ad.offer.photos = getRandomElement(PHOTOS, 'many');
    ads.push(ad);
  }
  return ads;
};

// Генерирует метки карты

var getPinElement = function (element) {
  var pinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');
  var pinElement = pinTemplate.cloneNode(true);
  var pinElementImg = pinElement.querySelector('img');
  var pinElementWidth = 50;
  var pinElementHeight = 70;

  pinElement.style.left = (element.location.x - pinElementWidth / 2) + 'px';
  pinElement.style.top = (element.location.y - pinElementHeight) + 'px';
  pinElementImg.src = element.author.avatar;
  pinElementImg.alt = element.offer.title;

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
