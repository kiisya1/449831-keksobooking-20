'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  // Генерирует метки карты

  window.pin = {
    getPinElement: function (ad) {
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
    }
  };
})();
