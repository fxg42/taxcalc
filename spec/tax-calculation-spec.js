"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var calc = _interopRequire(require("../lib/index"));

describe("Tax calculations", function () {
  it("calculates taxes a single item invoice", function () {
    var taxConfig = [{ id: "tax1", rate: 0.05, isComposed: false }, { id: "tax2", rate: 0.09975, isComposed: false }];
    var items = [{ unit: 100, qty: 1, isTaxable: { tax1: true, tax2: true } }];

    var result = calc(items, taxConfig);

    expect(result.subtotal).toBe(100);
    expect(result.total).toBe(114.98);
    expect(result.taxes.tax1).toBe(5);
    expect(result.taxes.tax2).toBe(9.98);
  });

  it("calculates a 2 item invoice", function () {
    var taxConfig = [{ id: "tax1", rate: 0.05, isComposed: false }, { id: "tax2", rate: 0.09975, isComposed: false }];
    var items = [{ unit: 100, qty: 1, isTaxable: { tax1: true, tax2: true } }, { unit: 100, qty: 1, isTaxable: { tax1: true, tax2: true } }];

    var result = calc(items, taxConfig);

    expect(result.subtotal).toBe(200);
    expect(result.total).toBe(229.95);
    expect(result.taxes.tax1).toBe(10);
    expect(result.taxes.tax2).toBe(19.95);
  });

  it("calculates a 2 item invoice", function () {
    var taxConfig = [{ id: "tax1", rate: 0.05, isComposed: false }, { id: "tax2", rate: 0.09975, isComposed: false }];
    var items = [{ unit: 100, qty: 2, isTaxable: { tax1: true, tax2: true } }];

    var result = calc(items, taxConfig);

    expect(result.subtotal).toBe(200);
    expect(result.total).toBe(229.95);
    expect(result.taxes.tax1).toBe(10);
    expect(result.taxes.tax2).toBe(19.95);
  });

  it("calculates a 2 item invoice with composed taxes", function () {
    var taxConfig = [{ id: "tax1", rate: 0.05, isComposed: false }, { id: "tax2", rate: 0.095, isComposed: true }];
    var items = [{ unit: 100, qty: 2, isTaxable: { tax1: true, tax2: true } }];

    var result = calc(items, taxConfig);

    expect(result.subtotal).toBe(200);
    expect(result.total).toBe(229.95);
    expect(result.taxes.tax1).toBe(10);
    expect(result.taxes.tax2).toBe(19.95);
  });

  it("calculates a 2 item invoice with composed taxes", function () {
    var taxConfig = [{ id: "tax1", rate: 0.05, isComposed: false }, { id: "tax2", rate: 0.095, isComposed: true }];
    var items = [{ unit: 100, qty: 1, isTaxable: { tax1: true, tax2: true } }, { unit: 100, qty: 1, isTaxable: { tax1: true, tax2: true } }];

    var result = calc(items, taxConfig);

    expect(result.subtotal).toBe(200);
    expect(result.total).toBe(229.95);
    expect(result.taxes.tax1).toBe(10);
    expect(result.taxes.tax2).toBe(19.95);
  });
});
