'use strict';

(function () {
  var filterForm = document.querySelector('.map__filters');
  var filterSelects = filterForm.querySelectorAll('select');
  var filterFieldsets = filterForm.querySelectorAll('fieldset');
  var housingType = filterForm.querySelector('#housing-type');

  var enableItems = window.form.enableItems;
  var disableItems = window.form.disableItems;

  var removeAd = window.mapMethods.removeAd;
  var renderPins = window.mapMethods.renderPins;
  var removePins = window.mapMethods.removePins;

  var adverts = [];

  // Сохраняет полученные при загрузке данные в переменную для дальнейшего использования

  var getAds = function (ads) {
    adverts = ads;
  };

  // При изменении любого фильтра скрывает открытую карточку объявления

  var onChange = function () {
    removeAd();
  };

  // Фильтрует объявления по типу жилья

  var onHousingTypeChange = function (evt) {
    var selectedType = evt.target.value;
    var filteredAds = adverts;
    if (selectedType !== 'any') {
      filteredAds = adverts.filter(function (ad) {
        return ad.offer.type === selectedType;
      });
    }
    removePins();
    renderPins(filteredAds);
  };

  // Переводит фильтр в активное состояние

  var makeFilterFormActive = function (ads) {
    enableItems(filterSelects);
    enableItems(filterFieldsets);
    getAds(ads);

    housingType.addEventListener('change', onHousingTypeChange);
    filterForm.addEventListener('change', onChange);
  };

  // Переводит форму фильтра в неактивное состояние

  var makeFilterFormInactive = function () {
    filterForm.reset();
    disableItems(filterSelects);
    disableItems(filterFieldsets);

    housingType.removeEventListener('change', onHousingTypeChange);
    filterForm.removeEventListener('change', onChange);
  };

  window.filter = {
    activate: makeFilterFormActive,
    deactivate: makeFilterFormInactive
  };

})();
