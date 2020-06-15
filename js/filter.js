'use strict';

(function () {
  var filterForm = document.querySelector('.map__filters');
  var filterSelects = filterForm.querySelectorAll('select');
  var filterFieldsets = filterForm.querySelectorAll('fieldset');

  // Переводит фильтр в активное состояние

  var makeFilterFormActive = function () {
    window.form.enableItems(filterSelects);
    window.form.enableItems(filterFieldsets);
  };

  // Переводит форму фильтра в неактивное состояние

  var makeFilterFormInactive = function () {
    window.form.disableItems(filterSelects);
    window.form.disableItems(filterFieldsets);
  };

  window.filter = {
    activate: makeFilterFormActive,
    deactivate: makeFilterFormInactive
  };

})();
