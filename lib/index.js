"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _money = require("./money");

var Money = _money.Money;
var ZERO = _money.ZERO;
var BigDecimal = require("bigdecimal").BigDecimal;
var Immutable = _interopRequire(require("immutable"));

var Validator = require("jsonschema").Validator;


var ITEMS_SCHEMA = {
  type: "array",
  required: true,
  items: {
    type: "object",
    required: true,
    additionnalProperties: true,
    properties: {
      unit: { type: "number", required: true },
      qty: { type: "number", required: true },
      isTaxable: {
        type: "object",
        required: true,
        patternProperties: {
          ".*": { type: "boolean", required: true }
        }
      }
    }
  }
};

var TAX_CONFIGS_SCHEMA = {
  type: "array",
  required: true,
  items: {
    type: "object",
    required: true,
    additionnalProperties: false,
    properties: {
      id: { type: "string", required: true },
      rate: { type: "number", required: true },
      isComposed: { type: "boolean", required: true }
    }
  }
};

function isValid(candidate, schema) {
  var validator = new Validator().validate(candidate, schema);
  return validator.errors.length === 0;
}

function calculateTaxes(items, taxConfigs) {
  var taxTotals = taxConfigs.reduce(function (acc, tax) {
    return acc.set(tax.id, ZERO);
  }, Immutable.Map());
  var salesSubtotal = ZERO;

  items.forEach(function (item) {
    var itemSubtotal = new Money(new BigDecimal(item.unit).multiply(new BigDecimal(item.qty)));
    salesSubtotal = salesSubtotal.add(itemSubtotal);

    taxConfigs.filter(function (tax) {
      return item.isTaxable[tax.id];
    }).reduce(function (runningTotal, taxConfig) {
      var taxRate = new BigDecimal(taxConfig.rate);
      var taxTotal = taxConfig.isComposed ? runningTotal.multiply(taxRate) : itemSubtotal.multiply(taxRate);
      taxTotals = taxTotals.set(taxConfig.id, taxTotals.get(taxConfig.id).add(taxTotal));
      return runningTotal.add(taxTotal);
    }, itemSubtotal);
  });

  var total = taxTotals.reduce(function (acc, taxTotalAmount) {
    return acc.add(taxTotalAmount);
  }, salesSubtotal);

  return {
    subtotal: salesSubtotal.toFloat(),
    taxes: taxTotals.map(function (amount) {
      return amount.toFloat();
    }).toJS(),
    total: total.toFloat()
  };
}

module.exports = function (items, taxConfigs) {
  if (isValid(items, ITEMS_SCHEMA) && isValid(taxConfigs, TAX_CONFIGS_SCHEMA)) {
    return calculateTaxes(Immutable.List(items), Immutable.List(taxConfigs));
  } else {
    return null;
  }
};
