'use strict';

(function () {
  var GUESTS_DECLENSIONS = ['гостя', 'гостей'];
  var ROOMS_DECLENSIONS = ['комната', 'комнаты', 'комнат'];

  var map = document.querySelector('.map');
  // Скрывает html элемент

  var hideHtmlElement = function (htmlElement) {
    htmlElement.style.display = 'none';
  };

  // Добавляет фотографии в объявление

  var addPhotosToAd = function (adPhotos, photos) {
    if (!photos.length) {
      return false;
    }
    var adImg = adPhotos.querySelector('.popup__photo');
    adPhotos.innerHTML = '';
    var fragment = document.createDocumentFragment();

    photos.forEach(function (photo) {
      var adImgElement = adImg.cloneNode(true);
      adImgElement.src = photo;
      fragment.appendChild(adImgElement);
    });
    adPhotos.appendChild(fragment);
    return true;
  };

  // Добавляет текст в элементы разметки объявления

  var addTextToElement = function (htmlElement, text) {
    if (!text) {
      return false;
    }
    htmlElement.textContent = text;
    return true;
  };

  // Добавляет цену в объявление

  var addPriceToAd = function (adPrice, price) {
    if (!price) {
      return false;
    }
    adPrice.textContent = price + '₽/ночь';
    return true;
  };

  // Добавляет тип жилья в объявление

  var addTypeToAd = function (adType, type) {
    if (!type) {
      return false;
    }
    var typesMap = {
      'flat': 'Квартира',
      'bungalo': 'Бунгало',
      'house': 'Дом',
      'palace': 'Дворец'
    };
    adType.textContent = typesMap[type];
    return true;
  };

  // Определяет склонение "комнат" в зависимости от числа

  var declineRooms = function (rooms) {
    if ((rooms % 100 > 4 && rooms % 100 < 20) || rooms % 10 === 0 || rooms % 10 >= 5) {
      return ROOMS_DECLENSIONS[2];
    } else if (rooms % 10 < 5 && rooms % 10 > 1) {
      return ROOMS_DECLENSIONS[1];
    } else {
      return ROOMS_DECLENSIONS[0];
    }
  };

  // Определяет склонение "гостей" в зависимости от числа

  var declineGuests = function (guests) {
    if (guests % 10 !== 1 || guests % 100 === 11) {
      return GUESTS_DECLENSIONS[1];
    } else {
      return GUESTS_DECLENSIONS[0];
    }
  };

  // Добавляет количество комнат и гостей в объявление

  var addCapacityToAd = function (adCapacity, rooms, guests) {
    if (!rooms || !guests) {
      return false;
    }
    adCapacity.textContent = rooms + ' ' + declineRooms(rooms) + ' для ' + guests + ' ' + declineGuests(guests);
    return true;
  };

  // Добавляет время въезда/выезда в объявление

  var addTimesToAd = function (adTiming, checkin, checkout) {
    if (!checkin || !checkout) {
      return false;
    }
    adTiming.textContent = 'Заезд после ' + checkin + ', выезд до ' + checkout;
    return true;
  };

  // Добавляет аватар в объявление

  var addAvatarToAd = function (adAvatar, avatar) {
    if (!avatar) {
      return false;
    }
    adAvatar.src = avatar;
    return true;
  };

  // Добавляет удобства в объявление

  var addFeaturesToAd = function (adFeatures, features) {
    if (!features.length) {
      return false;
    }
    var fragment = document.createDocumentFragment();
    adFeatures.innerHTML = '';

    features.forEach(function (feature) {
      var featureItem = document.createElement('li');
      var featureClass = 'popup__feature--' + feature;
      featureItem.classList.add('popup__feature', featureClass);
      fragment.appendChild(featureItem);
    });

    adFeatures.appendChild(fragment);
    return true;
  };

  // Добавляет контент или скрывает элемент если контент пустой

  var addNotEmptyContent = function (htmlElement, callback, content, extraContent) {
    if (callback(htmlElement, content, extraContent) === false) {
      hideHtmlElement(htmlElement);
    }
  };

  // Закрывает карточку объявления по нажатию Esc

  var onAdEscape = function (evt) {
    if (evt.key === 'Escape') {
      var adElement = map.querySelector('.map__card');
      adElement.remove();

      document.removeEventListener('keydown', onAdEscape);
    }
  };

  // Создает карточку объявления
  var getAdCard = function (ad) {
    var adTemplate = document.querySelector('#card')
        .content
        .querySelector('.map__card');
    var adElement = adTemplate.cloneNode(true);
    var adTitle = adElement.querySelector('.popup__title');
    var adAddress = adElement.querySelector('.popup__text--address');
    var adPrice = adElement.querySelector('.popup__text--price');
    var adType = adElement.querySelector('.popup__type');
    var adCapacity = adElement.querySelector('.popup__text--capacity');
    var adTiming = adElement.querySelector('.popup__text--time');
    var adFeatures = adElement.querySelector('.popup__features');
    var adDescription = adElement.querySelector('.popup__description');
    var adPhotos = adElement.querySelector('.popup__photos');
    var adAvatar = adElement.querySelector('.popup__avatar');
    var adClose = adElement.querySelector('.popup__close');

    addNotEmptyContent(adTitle, addTextToElement, ad.offer.title);
    addNotEmptyContent(adAddress, addTextToElement, ad.offer.address);
    addNotEmptyContent(adPrice, addPriceToAd, ad.offer.price);
    addNotEmptyContent(adType, addTypeToAd, ad.offer.type);
    addNotEmptyContent(adCapacity, addCapacityToAd, ad.offer.rooms, ad.offer.guests);
    addNotEmptyContent(adTiming, addTimesToAd, ad.offer.checkin, ad.offer.checkout);
    addNotEmptyContent(adDescription, addTextToElement, ad.offer.description);
    addNotEmptyContent(adAvatar, addAvatarToAd, ad.author.avatar);
    addNotEmptyContent(adFeatures, addFeaturesToAd, ad.offer.features);
    addNotEmptyContent(adPhotos, addPhotosToAd, ad.offer.photos);

    adClose.addEventListener('click', function () {
      adElement.remove();
    });

    document.addEventListener('keydown', onAdEscape);

    return adElement;
  };

  window.card = {
    get: getAdCard
  };
})();
