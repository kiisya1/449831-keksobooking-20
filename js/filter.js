'use strict';

(function () {
  var filterForm = document.querySelector('.map__filters');
  var filterSelects = filterForm.querySelectorAll('select');
  var filterFieldsets = filterForm.querySelectorAll('fieldset');

  var enableItems = window.form.enableItems;
  var disableItems = window.form.disableItems;

  // Переводит фильтр в активное состояние

  var makeFilterFormActive = function () {
    enableItems(filterSelects);
    enableItems(filterFieldsets);
  };

  // Переводит форму фильтра в неактивное состояние

  var makeFilterFormInactive = function () {
    disableItems(filterSelects);
    disableItems(filterFieldsets);
  };

  window.filter = {
    activate: makeFilterFormActive,
    deactivate: makeFilterFormInactive
  };

})();
