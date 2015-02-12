"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _money = require("./money");

var Money = _money.Money;
var ZERO = _money.ZERO;
var BigDecimal = require("bigdecimal").BigDecimal;
var Immutable = _interopRequire(require("immutable"));

module.exports = function (items, salesTaxConfigs) {
  var taxAmountTotals = Immutable.Map();
  salesTaxConfigs.forEach(function (tax) {
    taxAmountTotals = taxAmountTotals.set(tax.id, ZERO);
  });

  var salesTotalWithoutTaxes = ZERO;
  items.forEach(function (item) {
    var itemTotalWithoutTaxes = new Money(new BigDecimal(item.unit).multiply(new BigDecimal(item.qty)));
    salesTotalWithoutTaxes = salesTotalWithoutTaxes.add(itemTotalWithoutTaxes);

    var itemTotalWithTaxes = itemTotalWithoutTaxes;
    salesTaxConfigs.forEach(function (tax) {
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
    });
  });

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
