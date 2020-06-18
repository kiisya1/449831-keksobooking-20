'use strict';

(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT_ACTIVE = 84;

  var setPinAddress = window.form.setPinAddress;

  var map = document.querySelector('.map');
  var pin = map.querySelector('.map__pin--main');

  var location = {
    map: {
      x: map.offsetLeft,
      y: map.offsetTop,
      minX: 0,
      maxX: map.offsetWidth,
      minY: 130,
      maxY: 630
    }
  };

  var shift = {};

  var movePin = function (evt) {
    // координаты смещения относительно положения карты и положения точки клика на пине

    var pinCoords = {
      x: evt.clientX - location.map.x - shift.x,
      y: evt.clientY - location.map.y - shift.y
    };

    if (pinCoords.y + MAIN_PIN_HEIGHT_ACTIVE <= location.map.minY) {
      pin.style.top = (location.map.minY - MAIN_PIN_HEIGHT_ACTIVE) + 'px';
    } else if (pinCoords.y + MAIN_PIN_HEIGHT_ACTIVE >= location.map.maxY) {
      pin.style.top = (location.map.maxY - MAIN_PIN_HEIGHT_ACTIVE) + 'px';
    } else {
      pin.style.top = pinCoords.y + 'px';
    }

    if (pinCoords.x + MAIN_PIN_WIDTH / 2 <= location.map.minX) {
      pin.style.left = (location.map.minX - MAIN_PIN_WIDTH / 2) + 'px';
    } else if (pinCoords.x + MAIN_PIN_WIDTH / 2 >= location.map.maxX) {
      pin.style.left = (location.map.maxX - MAIN_PIN_WIDTH / 2) + 'px';
    } else {
      pin.style.left = pinCoords.x + 'px';
    }

    setPinAddress(MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT_ACTIVE);

  };

  var onMouseMove = function (evt) {
    evt.preventDefault();
    movePin(evt);
  };

  var onMouseUp = function (evt) {
    evt.preventDefault();
    movePin(evt);

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  var onPinMousedown = function (evt) {
    if (evt.button === 0) {
      evt.preventDefault();

      // координаты клика относительно левого верхнего угла пина

      shift.x = evt.clientX - location.map.x - pin.offsetLeft;
      shift.y = evt.clientY - location.map.y - pin.offsetTop;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  };

  window.mainPin = {
    mousedown: onPinMousedown
  };
})();
