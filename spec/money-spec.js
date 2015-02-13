"use strict";

var BigDecimal = require("bigdecimal").BigDecimal;
var Money = require("../lib/money").Money;


describe("A Money instance", function () {
  it("can convert floats and back", function () {
    expect(new Money(0).toFloat()).toBe(0);
  });

  it("can add to instances", function () {
    expect(new Money(5).add(new Money(10)).toFloat()).toBe(15);
  });

  it("can multiply by some rate", function () {
    expect(new Money(100).multiply(new BigDecimal("0.05")).toFloat()).toBe(5);
  });

  it("can round numbers using half up method with a scale of 2", function () {
    expect(new Money(1.1).toFloat()).toBe(1.1);
    expect(new Money(1.5).toFloat()).toBe(1.5);
    expect(new Money(1.6).toFloat()).toBe(1.6);
    expect(new Money(1.001).toFloat()).toBe(1);
    expect(new Money(1.004).toFloat()).toBe(1);
    expect(new Money(1.005).toFloat()).toBe(1);
    expect(new Money(1.006).toFloat()).toBe(1.01);
  });
});
