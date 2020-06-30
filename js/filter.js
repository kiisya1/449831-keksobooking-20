'use strict';

(function () {
  var filterForm = document.querySelector('.map__filters');
  var filterSelects = filterForm.querySelectorAll('select');
  var filterFieldsets = filterForm.querySelectorAll('fieldset');
  var housingTypeField = filterForm.querySelector('#housing-type');
  var housingPriceField = filterForm.querySelector('#housing-price');
  var housingRoomsField = filterForm.querySelector('#housing-rooms');
  var housingGuestsField = filterForm.querySelector('#housing-guests');
  var housingFeaturesFields = filterForm.querySelectorAll('.map__checkbox');

  var enableItems = window.form.enableItems;
  var disableItems = window.form.disableItems;

  var removeAd = window.mapMethods.removeAd;
  var renderPins = window.mapMethods.renderPins;
  var removePins = window.mapMethods.removePins;

  var debounce = window.debounce;

  var adverts = [];

  // Сохраняет полученные при загрузке данные в переменную для дальнейшего использования

  var getAds = function (ads) {
    adverts = ads;
  };

  // При изменении любого фильтра скрывает открытую карточку объявления

  var onFilterChange = debounce(function () {
    var ads = adverts;
    var housingType = housingTypeField.value;
    var housingPrice = housingPriceField.value;
    var housingRooms = housingRoomsField.value;
    var housingGuests = housingGuestsField.value;
    var housingFeatures = getActiveFeatures(housingFeaturesFields);

    removeAd();

    var filteredType = filterByType(housingType, ads);
    var filteredRooms = filterByRooms(housingRooms, filteredType);
    var filteredGuests = filterByGuests(housingGuests, filteredRooms);
    var filteredPrice = filterByPrice(housingPrice, filteredGuests);
    var filteredFeatures = filterByFeatures(housingFeatures, filteredPrice);

    removePins();
    renderPins(filteredFeatures);
  });

  // Фильтрует объявления по типу жилья

  var filterByType = function (housingType, ads) {
    var filteredAds;
    if (housingType !== 'any') {
      filteredAds = ads.filter(function (ad) {
        return ad.offer.type === housingType;
      });
    } else {
      filteredAds = ads;
    }

    return filteredAds;
  };

  // Фильтрует объявления по стоимости за ночь

  var filterByPrice = function (housingPrice, ads) {
    var filteredAds;
    switch (housingPrice) {
      case 'low':
        filteredAds = ads.filter(function (ad) {
          return ad.offer.price < 10000;
        });
        break;
      case 'middle':
        filteredAds = ads.filter(function (ad) {
          return (ad.offer.price > 10000 && ad.offer.price < 50000);
        });
        break;
      case 'high':
        filteredAds = ads.filter(function (ad) {
          return ad.offer.price > 50000;
        });
        break;
      default:
        filteredAds = ads;
    }
    return filteredAds;
  };

  // Фильтрует объявления по числу комнат

  var filterByRooms = function (housingRooms, ads) {
    var filteredAds;
    if (housingRooms !== 'any') {
      filteredAds = ads.filter(function (ad) {
        return ad.offer.rooms === Number(housingRooms);
      });
    } else {
      filteredAds = ads;
    }

    return filteredAds;
  };

  // Фильтрует объявления по числу гостей

  var filterByGuests = function (housingGuests, ads) {
    var filteredAds;
    if (housingGuests !== 'any') {
      filteredAds = ads.filter(function (ad) {
        return ad.offer.guests === Number(housingGuests);
      });
    } else {
      filteredAds = ads;
    }

    return filteredAds;
  };

  // Возвращает список выбранных удобств

  var getActiveFeatures = function (features) {
    var activeFeatures = [];
    features.forEach(function (feature) {
      if (feature.checked === true) {
        activeFeatures.push(feature);
      }
    });

    return activeFeatures;
  };

  // Вычисляет количество указанных в фильре удобств в объявлении

  var getFeaturesScore = function (features, ad) {
    var score = 0;
    features.forEach(function (feature) {
      if (ad.offer.features.includes(feature.value)) {
        score++;
      }
    });
    return score;
  };

  // Фильтрует объявления по удобствам

  var filterByFeatures = function (features, ads) {
    var filteredAds = [];
    if (features.length !== 0) {
      ads.forEach(function (ad) {
        if (getFeaturesScore(features, ad) === features.length) {
          filteredAds.push(ad);
        }
      });
    } else {
      filteredAds = ads;
    }

    return filteredAds;
  };

  // Переводит фильтр в активное состояние

  var makeFilterFormActive = function (ads) {
    enableItems(filterSelects);
    enableItems(filterFieldsets);
    getAds(ads);

    filterForm.addEventListener('change', onFilterChange);
  };

  // Переводит форму фильтра в неактивное состояние

  var makeFilterFormInactive = function () {
    filterForm.reset();
    disableItems(filterSelects);
    disableItems(filterFieldsets);

    filterForm.removeEventListener('change', onFilterChange);
  };

  window.filter = {
    activate: makeFilterFormActive,
    deactivate: makeFilterFormInactive
  };

})();
