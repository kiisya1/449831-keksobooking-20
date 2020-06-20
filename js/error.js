'use strict';

(function () {
  var main = document.querySelector('main');

  var removeErrorMessage = function () {
    var errorWindow = main.querySelector('.error');
    errorWindow.remove();
  };

  var onCloseButtonClick = function () {
    removeErrorMessage();
  };

  var onErrorEscape = function (evt) {
    if (evt.key === 'Escape') {
      removeErrorMessage();
    }
  };

  var onErrorClick = function () {
    removeErrorMessage();
  };

  var getErrorWindow = function (message) {
    var errorTemplate = document.querySelector('#error')
        .content
        .querySelector('.error');
    var errorWindow = errorTemplate.cloneNode(true);
    var closeButton = errorWindow.querySelector('.error__button');
    if (message) {
      var errorText = errorWindow.querySelector('.error__message');
      errorText.textContent = message;
    }

    closeButton.addEventListener('click', onCloseButtonClick);
    errorWindow.addEventListener('click', onErrorClick);
    document.addEventListener('keydown', onErrorEscape);

    return errorWindow;
  };

  var addErrorMessage = function (message) {
    var errorWindow = getErrorWindow(message);
    main.appendChild(errorWindow);
  };

  window.error = {
    add: addErrorMessage
  };

})();
