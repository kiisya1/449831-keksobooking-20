'use strict';

(function () {
  var map = document.querySelector('.map');

  // Добавляем обработчик собития на пин

  var addPinClickHandler = function (pinElement, ad) {
    pinElement.addEventListener('click', function () {
      renderAd(ad);
    });
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
    map.insertBefore(window.card.getAdCard(ad), mapFiltersContainer);
  };

  window.mapMethods = {

    // Добавляет метки на карту
    renderPins: function (ads) {
      var pinsBlock = map.querySelector('.map__pins');
      var fragment = document.createDocumentFragment();

      ads.forEach(function (ad) {
        var pinElement = window.pin.getPinElement(ad);
        addPinClickHandler(pinElement, ad);
        fragment.appendChild(pinElement);
      });

      pinsBlock.appendChild(fragment);
    },

    // Переводит карту в активное состояние
    makeMapActive: function () {
      map.classList.remove('map--faded');
    },

    // Переводит карту в неактивное состояние
    makeMapInactive: function () {
      map.classList.add('map--faded');
    },
  };

})();
