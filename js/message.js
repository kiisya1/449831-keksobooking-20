'use strict';

(function () {
  var SUCCESS = 'success';
  var ERROR = 'error';
  var main = document.querySelector('main');

  var removeMessage = function () {
    if (main.querySelector('.success')) {
      main.querySelector('.success').remove();
    } else if (main.querySelector('.error')) {
      main.querySelector('.error').remove();
    }
  };

  var onEscape = function (evt) {
    if (evt.key === 'Escape') {
      removeMessage();
    }
  };

  var onClick = function () {
    removeMessage();
  };

  var onCloseButtonClick = function () {
    removeMessage();
  };

  var getMessage = function (type, message) {
    var messageTemplate = document.querySelector('#' + type)
        .content
        .querySelector('.' + type);
    var messageWindow = messageTemplate.cloneNode(true);
    messageWindow.addEventListener('click', onClick);
    document.addEventListener('keydown', onEscape);

    if (type === ERROR) {
      var closeButton = messageWindow.querySelector('.error__button');

      closeButton.addEventListener('click', onCloseButtonClick);

      if (message) {
        var errorText = messageWindow.querySelector('.error__message');
        errorText.textContent = message;
      }
    }

    return messageWindow;
  };

  var addSuccessMessage = function () {
    var successWindow = getMessage(SUCCESS);
    main.appendChild(successWindow);
  };

  var addErrorMessage = function (message) {
    var errorWindow = getMessage(ERROR, message);
    main.appendChild(errorWindow);
  };

  window.message = {
    addError: addErrorMessage,
    addSuccess: addSuccessMessage
  };

})();
