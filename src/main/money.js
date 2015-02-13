import {BigDecimal, RoundingMode} from 'bigdecimal'

export class Money {
  
  constructor(amount) {
    if (! (amount instanceof BigDecimal)) amount = new BigDecimal(amount)
    this.amount = amount
  }

  add(money) {
    return new Money(this.amount.add(money.amount))
  }

  subtract(money) {
    return new Money(this.amount.subtract(money.amount))
  }

  multiply(bigDecimal) {
    return new Money(this.amount.multiply(bigDecimal))
  }

  divide(bigDecimal) {
    return new Money(this.amount.divide(bigDecimal))
  }

  toString() {
    return this.amount.toString()
  }

  toFloat() {
    return parseFloat(new Money(this.amount.setScale(2, RoundingMode.HALF_UP())).toString() || 0)
  }
}

export const ZERO = new Money(0)
