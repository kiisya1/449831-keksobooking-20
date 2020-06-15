'use strict';

(function () {
  var map = document.querySelector('.map');

  var getAdCard = window.card.get;
  var getPin = window.pin.get;

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
    map.insertBefore(getAdCard(ad), mapFiltersContainer);
  };

  // Добавляет метки на карту

  var renderPins = function (ads) {
    var pinsBlock = map.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();

    ads.forEach(function (ad) {
      var pinElement = getPin(ad);
      addPinClickHandler(pinElement, ad);
      fragment.appendChild(pinElement);
    });

    pinsBlock.appendChild(fragment);
  };

  // Переводит карту в активное состояние

  var makeMapActive = function () {
    map.classList.remove('map--faded');
  };

  // Переводит карту в неактивное состояние

  var makeMapInactive = function () {
    map.classList.add('map--faded');
  };

  window.mapMethods = {
    renderPins: renderPins,
    activate: makeMapActive,
    deactivate: makeMapInactive
  };

})();
