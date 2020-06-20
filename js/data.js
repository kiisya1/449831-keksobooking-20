'use strict';

(function () {
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var CHECKOUT_TIMES = ['12:00', '13:00', '14:00'];
  var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var LOCATION_Y_MIN = 130;
  var LOCATION_Y_MAX = 630;
  var LOCATION_X_MIN = 0;

  var map = document.querySelector('.map');
  var locationXMax = map.offsetWidth;

  var generateRandomNumber = window.util.generateRandomNumber;
  var getRandomElement = window.util.getRandomElement;
  var getRandomArray = window.util.getRandomArray;

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

  window.data = {
    generate: generateAdvertisementObjects
  };
})();
