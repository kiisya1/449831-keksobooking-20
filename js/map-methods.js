'use strict';

(function () {
  var NUMBER_OF_ADVERTISEMENT = 5;

  var map = document.querySelector('.map');

  var getAdCard = window.card.get;
  var getPin = window.pin.get;

  var shuffleArray = window.util.shuffleArray;

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

  // Проверяет есть ли у объектов массива объявлений свойство offer

  var checkAds = function (ads) {
    var checkedAds = [];
    for (var i = 0; i < ads.length; i++) {
      if (ads[i].offer) {
        checkedAds.push(ads[i]);
      }
    }
    return checkedAds;
  };

  // Добавляет метки на карту

  var renderPins = function (ads) {
    var pinsBlock = map.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();

    var checkedAds = checkAds(ads);
    var shuffledAds = shuffleArray(checkedAds);
    shuffledAds = shuffledAds.slice(0, NUMBER_OF_ADVERTISEMENT);

    shuffledAds.forEach(function (ad) {
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
