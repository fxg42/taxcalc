"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _money = require("./money");

var Money = _money.Money;
var ZERO = _money.ZERO;
var BigDecimal = require("bigdecimal").BigDecimal;
var Immutable = _interopRequire(require("immutable"));

module.exports = function (items, salesTaxConfigs) {
  var taxAmountTotals = Immutable.Map();
  for (var _iterator = salesTaxConfigs[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) {
    var each = _step.value;
    taxAmountTotals = taxAmountTotals.set(each.id, ZERO);
  }

  var salesTotalWithoutTaxes = ZERO;
  for (var _iterator2 = items[Symbol.iterator](), _step2; !(_step2 = _iterator2.next()).done;) {
    var item = _step2.value;
    var itemTotalWithoutTaxes = new Money(new BigDecimal(item.unit).multiply(new BigDecimal(item.qty)));
    salesTotalWithoutTaxes = salesTotalWithoutTaxes.add(itemTotalWithoutTaxes);

    var itemTotalWithTaxes = itemTotalWithoutTaxes;
    for (var _iterator3 = salesTaxConfigs[Symbol.iterator](), _step3; !(_step3 = _iterator3.next()).done;) {
      var tax = _step3.value;
      if (item.isTaxable[tax.id]) {
        var rate = new BigDecimal(tax.rate);
        var taxAmount = ZERO;
        if (tax.isComposed) {
          taxAmount = itemTotalWithTaxes.multiply(rate);
        } else {
          taxAmount = itemTotalWithoutTaxes.multiply(rate);
        }
        itemTotalWithTaxes = itemTotalWithTaxes.add(taxAmount);
        taxAmountTotals = taxAmountTotals.set(tax.id, taxAmountTotals.get(tax.id).add(taxAmount));
      }
    }
  }

  var salesTotalWithTaxes = taxAmountTotals.reduce(function (acc, taxTotalAmount) {
    return acc.add(taxTotalAmount);
  }, salesTotalWithoutTaxes);

  return {
    subtotal: salesTotalWithoutTaxes.toFloat(),
    total: salesTotalWithTaxes.toFloat(),
    taxes: taxAmountTotals.map(function (amount) {
      return amount.toFloat();
    }).toJS()
  };
};
