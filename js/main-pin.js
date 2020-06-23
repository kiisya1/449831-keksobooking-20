'use strict';

(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT_ACTIVE = 84;

  var setPinAddress = window.form.setPinAddress;

  var map = document.querySelector('.map');
  var pin = map.querySelector('.map__pin--main');

  var startPinOffsetX = pin.offsetLeft;
  var startPinOffsetY = pin.offsetTop;

  var location = {
    map: {
      minX: 0,
      maxX: map.offsetWidth,
      minY: 130,
      maxY: 630
    }
  };

  var setStartState = function () {
    pin.style.left = startPinOffsetX + 'px';
    pin.style.top = startPinOffsetY + 'px';
  };

  var movePin = function (evt, startCoords, pinOffset) {
    var shift = {
      x: startCoords.x - evt.clientX,
      y: startCoords.y - evt.clientY
    };

    var pinCoords = {
      x: pinOffset.x - shift.x,
      y: pinOffset.y - shift.y
    };

    if (pinCoords.x + MAIN_PIN_WIDTH / 2 <= location.map.minX) {
      pin.style.left = location.map.minX - MAIN_PIN_WIDTH / 2 + 'px';
    } else if (pinCoords.x + MAIN_PIN_WIDTH / 2 >= location.map.maxX) {
      pin.style.left = location.map.maxX - MAIN_PIN_WIDTH / 2 + 'px';
    } else {
      pin.style.left = pinCoords.x + 'px';
    }

    if (pinCoords.y + MAIN_PIN_HEIGHT_ACTIVE <= location.map.minY) {
      pin.style.top = location.map.minY - MAIN_PIN_HEIGHT_ACTIVE + 'px';
    } else if (pinCoords.y + MAIN_PIN_HEIGHT_ACTIVE >= location.map.maxY) {
      pin.style.top = location.map.maxY - MAIN_PIN_HEIGHT_ACTIVE + 'px';
    } else {
      pin.style.top = pinCoords.y + 'px';
    }

    setPinAddress(MAIN_PIN_WIDTH, MAIN_PIN_HEIGHT_ACTIVE);
  };

  var onPinMousedown = function (evt) {
    if (evt.button === 0) {
      evt.preventDefault();

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var pinOffset = {
        x: pin.offsetLeft,
        y: pin.offsetTop
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();
        movePin(moveEvt, startCoords, pinOffset);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();
        movePin(upEvt, startCoords, pinOffset);

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  };

  window.mainPin = {
    mousedown: onPinMousedown,
    setStartState: setStartState
  };
})();
