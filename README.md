# taxcalc

A simple line item tax calculator.

## Usage

```javascript
var calc = require('taxcalc');

var taxConfigs = [
  { id:'tax1', rate:0.05, isComposed:false },
  { id:'tax2', rate:0.09975, isComposed:false }
];

var items = [
  {unit:100, qty:1, isTaxable: {tax1: true, tax2: true}},
  {unit:100, qty:1, isTaxable: {tax1: true, tax2: true}}
];

calc(items, taxConfigs)
// => { subtotal:200, total:229.95, taxes: { tax1:10, tax2:19.95 } }
```

Inputs must conform with the following schemas. If not, `calc` returns null.

```
const ITEMS_SCHEMA = {
  type: 'array',
  required: true,
  items: {
    type: 'object',
    required: true,
    additionnalProperties: true,
    properties: {
      unit: { type:'number', required:true },
      qty: { type:'number', required:true },
      isTaxable: {
        type: 'object',
        required: true,
        patternProperties: {
          ".*": { type:'boolean', required:true }
        }
      }
    }
  }
}

const TAX_CONFIGS_SCHEMA = {
  type: 'array',
  required: true,
  items: {
    type: 'object',
    required: true,
    additionnalProperties: false,
    properties: {
      id: { type:'string', required:true },
      rate: { type:'number', required:true },
      isComposed: { type:'boolean', required:true }
    }
  }
}
```
