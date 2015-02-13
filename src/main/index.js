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

function haveValidReferences(items, taxConfigs) {
  const possible = taxConfigs.map(taxConfig => taxConfig.get('id')).toSet()
  const actual = items.flatMap(item => item.get('isTaxable').keys()).toSet()
  return actual.isSubset(possible)
}

function areValid(items, taxConfigs) {
  return isValid(items.toJS(), ITEMS_SCHEMA) &&
         isValid(taxConfigs.toJS(), TAX_CONFIGS_SCHEMA) &&
         haveValidReferences(items, taxConfigs)
}

function calculateTaxes(items, taxConfigs) {
  let taxTotals = taxConfigs.reduce((acc, tax) => acc.set(tax.get('id'), ZERO), Immutable.Map())

  const subtotal = items.reduce((runningSubtotal, item) => {
    const itemSubtotal = new Money(new BigDecimal(item.get('unit')).multiply(new BigDecimal(item.get('qty'))))

    taxConfigs
      .filter(taxConfig => item.get('isTaxable').get(taxConfig.get('id')))
      .reduce((runningItemTotal, taxConfig) => {
        const taxRate = new BigDecimal(taxConfig.get('rate'))
        const taxTotal = taxConfig.get('isComposed') ? runningItemTotal.multiply(taxRate) : itemSubtotal.multiply(taxRate)
        taxTotals = taxTotals.set(taxConfig.get('id'), (taxTotals.get(taxConfig.get('id')).add(taxTotal)))
        return runningItemTotal.add(taxTotal)
      }, itemSubtotal)

    return runningSubtotal.add(itemSubtotal)
  }, ZERO)

  const total = taxTotals.reduce((acc, taxTotal) => acc.add(taxTotal), subtotal)

  return {
    subtotal: subtotal.toFloat(),
    taxes: taxTotals.map(taxTotal => taxTotal.toFloat()).toJS(),
    total: total.toFloat()
  }
}

export default function (items, taxConfigs) {
  const items = Immutable.fromJS(items)
  const taxConfigs = Immutable.fromJS(taxConfigs)
  return areValid(items, taxConfigs) ? calculateTaxes(items, taxConfigs) : null
}
