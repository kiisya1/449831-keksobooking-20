'use strict';

(function () {
  var LOAD_URL = 'https://javascript.pages.academy/keksobooking/data';
  var UPLOAD_URL = 'https://javascript.pages.academy/keksobooking';
  var TIMEOUT_IN_MS = 10000;
  var StatusCode = {
    OK: 200,
    NOT_FOUND: 404,
    BAD_REQUEST: 400
  };

  var makeRequest = function (method, url, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      switch (method) {
        case 'GET':
          var error;
          switch (xhr.status) {
            case StatusCode.OK:
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
          break;
        default:
          switch (xhr.status) {
            case StatusCode.OK:
              onLoad(JSON.parse(xhr.responseText));
              break;
            default:
              onError();
          }
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;
    xhr.open(method, url);
    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  var load = function (onLoad, onError) {
    makeRequest('GET', LOAD_URL, onLoad, onError);
  };

  var upload = function (data, onLoad, onError) {
    makeRequest('POST', UPLOAD_URL, onLoad, onError, data);

  };

  window.backend = {
    load: load,
    upload: upload
  };
})();
