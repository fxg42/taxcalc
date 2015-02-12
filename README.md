# taxcalc

A simple line item tax calculator.

## Usage

```javascript
var calc = require('taxcalc');

var taxConfig = [
  { id:'tax1', rate:0.05, isComposed:false },
  { id:'tax2', rate:0.09975, isComposed:false }
];

var items = [
  {unit:100, qty:1, isTaxable: {tax1: true, tax2: true}},
  {unit:100, qty:1, isTaxable: {tax1: true, tax2: true}}
];

calc(items, taxConfig)
// => { subtotal:200, total:229.95, taxes: { tax1:10, tax2:19.95 } }
```
