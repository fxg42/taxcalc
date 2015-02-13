import {Money, ZERO} from './money'
import {BigDecimal} from 'bigdecimal'
import Immutable from 'immutable'
import {Validator} from 'jsonschema'

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

function isValid(candidate, schema) {
  const validator = new Validator().validate(candidate, schema)
  return validator.errors.length === 0
}

function calculateTaxes(items, taxConfigs) {
  let taxTotals = taxConfigs.reduce((acc, tax) => acc.set(tax.id, ZERO), Immutable.Map())
  let salesSubtotal = ZERO

  items.forEach( item => {
    let itemSubtotal = new Money(new BigDecimal(item.unit).multiply(new BigDecimal(item.qty)))
    salesSubtotal = salesSubtotal.add(itemSubtotal)

    taxConfigs
      .filter(tax => item.isTaxable[tax.id])
      .reduce((runningTotal, taxConfig) => {
        const taxRate = new BigDecimal(taxConfig.rate)
        const taxTotal = taxConfig.isComposed ? runningTotal.multiply(taxRate) : itemSubtotal.multiply(taxRate)
        taxTotals = taxTotals.set(taxConfig.id, (taxTotals.get(taxConfig.id).add(taxTotal)))
        return runningTotal.add(taxTotal)
      }, itemSubtotal)
  })

  const total = taxTotals.reduce((acc, taxTotalAmount) => acc.add(taxTotalAmount), salesSubtotal)

  return {
    subtotal: salesSubtotal.toFloat(),
    taxes: taxTotals.map( amount => amount.toFloat() ).toJS(),
    total: total.toFloat()
  }
}

export default function (items, taxConfigs) {
  if (isValid(items, ITEMS_SCHEMA) && isValid(taxConfigs, TAX_CONFIGS_SCHEMA)) {
    return calculateTaxes(Immutable.List(items), Immutable.List(taxConfigs))
  } else {
    return null
  }
}
