'use strict';

(function () {
  var NUMBER_OF_ADVERTISEMENT = 5;

  var map = document.querySelector('.map');

  var getAdCard = window.card.get;
  var getPin = window.pin.get;

  // Добавляем обработчик собития на пин

  var addPinClickHandler = function (pinElement, ad) {
    pinElement.addEventListener('click', function () {
      var activePin = map.querySelector('.map__pin--active');
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
      pinElement.classList.add('map__pin--active');
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
    var count = 0;
    for (var i = 0; i < ads.length; i++) {
      if (ads[i].offer) {
        var pinElement = getPin(ads[i]);
        addPinClickHandler(pinElement, ads[i]);
        fragment.appendChild(pinElement);
        ++count;
        if (count >= NUMBER_OF_ADVERTISEMENT) {
          break;
        }
      }
    }

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
