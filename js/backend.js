'use strict';

(function () {
  var LOAD_URL = 'https://javascript.pages.academy/keksobooking/data';
  var TIMEOUT_IN_MS = 10000;
  var StatusCode = {
    OK: 200,
    NOT_FOUND: 404,
    BAD_REQUEST: 400
  };

  var load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case StatusCode.OK:
        // Проверяю полностью ли пришел файл,
        // т.к. в ТЗ указано "Данные с сервера могут быть получены не в полном объёме."
        // Другую проверку не придумала пока

          try {
            onLoad(JSON.parse(xhr.responseText));
          } catch (err) {
            onError('Ошибка данных: ' + err.message);
          }
          break;
        case StatusCode.NOT_FOUND:
          error = 'Ничего не найдено';
          break;
        case StatusCode.BAD_REQUEST:
          error = 'Неверный запрос';
          break;
        default:
          error = 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText;
      }

      if (error) {
        onError(error);
      }

    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;
    xhr.open('GET', LOAD_URL);
    xhr.send();
  };

  window.backend = {
    load: load
  };
})();
