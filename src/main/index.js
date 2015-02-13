import {Money, ZERO} from './money'
import {BigDecimal} from 'bigdecimal'
import Immutable from 'immutable'

export default function (items, salesTaxConfigs) {

  let taxAmountTotals = Immutable.Map()
  salesTaxConfigs.forEach(function(tax) {
    taxAmountTotals = taxAmountTotals.set(tax.id, ZERO)
  })

  let salesTotalWithoutTaxes = ZERO
  items.forEach(function(item) {
    let itemTotalWithoutTaxes = new Money(new BigDecimal(item.unit).multiply(new BigDecimal(item.qty)))
    salesTotalWithoutTaxes = salesTotalWithoutTaxes.add(itemTotalWithoutTaxes)

    let itemTotalWithTaxes = itemTotalWithoutTaxes
    salesTaxConfigs.forEach(function(tax) {
      if (item.isTaxable[tax.id]) {
        let rate = new BigDecimal(tax.rate)
        let taxAmount = ZERO
        if (tax.isComposed) {
          taxAmount = itemTotalWithTaxes.multiply(rate)
        } else {
          taxAmount = itemTotalWithoutTaxes.multiply(rate)
        }
        itemTotalWithTaxes = itemTotalWithTaxes.add(taxAmount)
        taxAmountTotals = taxAmountTotals.set(tax.id, (taxAmountTotals.get(tax.id).add(taxAmount)))
      }
    })
  })

  let salesTotalWithTaxes = taxAmountTotals.reduce(
    ( (acc, taxTotalAmount) => acc.add(taxTotalAmount) ),
      salesTotalWithoutTaxes)

  return {
    subtotal: salesTotalWithoutTaxes.toFloat(),
    total: salesTotalWithTaxes.toFloat(),
    taxes: taxAmountTotals.map( amount => amount.toFloat() ).toJS()
  }
}