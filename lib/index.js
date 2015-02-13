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

function haveValidReferences(items, taxConfigs) {
  var possible = taxConfigs.map(function (taxConfig) {
    return taxConfig.get("id");
  }).toSet();
  var actual = items.flatMap(function (item) {
    return item.get("isTaxable").keys();
  }).toSet();
  return actual.isSubset(possible);
}

function areValid(items, taxConfigs) {
  return isValid(items.toJS(), ITEMS_SCHEMA) && isValid(taxConfigs.toJS(), TAX_CONFIGS_SCHEMA) && haveValidReferences(items, taxConfigs);
}

function calculateTaxes(items, taxConfigs) {
  var taxTotals = taxConfigs.reduce(function (acc, tax) {
    return acc.set(tax.get("id"), ZERO);
  }, Immutable.Map());
  var salesSubtotal = ZERO;

  items.forEach(function (item) {
    var itemSubtotal = new Money(new BigDecimal(item.get("unit")).multiply(new BigDecimal(item.get("qty"))));
    salesSubtotal = salesSubtotal.add(itemSubtotal);

    taxConfigs.filter(function (taxConfig) {
      return item.get("isTaxable").get(taxConfig.get("id"));
    }).reduce(function (runningTotal, taxConfig) {
      var taxRate = new BigDecimal(taxConfig.get("rate"));
      var taxTotal = taxConfig.get("isComposed") ? runningTotal.multiply(taxRate) : itemSubtotal.multiply(taxRate);
      taxTotals = taxTotals.set(taxConfig.get("id"), taxTotals.get(taxConfig.get("id")).add(taxTotal));
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
  var items = Immutable.fromJS(items);
  var taxConfigs = Immutable.fromJS(taxConfigs);

  return areValid(items, taxConfigs) ? calculateTaxes(items, taxConfigs) : null;
};
