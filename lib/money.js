"use strict";

var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _bigdecimal = require("bigdecimal");

var BigDecimal = _bigdecimal.BigDecimal;
var RoundingMode = _bigdecimal.RoundingMode;
var Money = exports.Money = (function () {
  function Money(_amount) {
    _classCallCheck(this, Money);

    var amount = _amount;
    if (!(amount instanceof BigDecimal)) {
      amount = new BigDecimal(amount);
    }
    this.amount = amount;
  }

  _prototypeProperties(Money, null, {
    add: {
      value: function add(money) {
        return new Money(this.amount.add(money.amount));
      },
      writable: true,
      configurable: true
    },
    subtract: {
      value: function subtract(money) {
        return new Money(this.amount.subtract(money.amount));
      },
      writable: true,
      configurable: true
    },
    multiply: {
      value: function multiply(bigDecimal) {
        return new Money(this.amount.multiply(bigDecimal));
      },
      writable: true,
      configurable: true
    },
    divide: {
      value: function divide(bigDecimal) {
        return new Money(this.amount.divide(bigDecimal));
      },
      writable: true,
      configurable: true
    },
    toString: {
      value: function toString() {
        return this.amount.toString();
      },
      writable: true,
      configurable: true
    },
    toFloat: {
      value: function toFloat() {
        return parseFloat(new Money(this.amount.setScale(2, RoundingMode.HALF_UP())).toString() || 0);
      },
      writable: true,
      configurable: true
    }
  });

  return Money;
})();
var ZERO = exports.ZERO = new Money(0);
Object.defineProperty(exports, "__esModule", {
  value: true
});
