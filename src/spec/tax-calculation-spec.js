import calc from '../lib/index'

describe('Tax calculations', () => {

  it('calculates taxes a single item invoice', () => {
    const taxConfig = [
      {id:'tax1', rate:0.05, isComposed:false},
      {id:'tax2', rate:0.09975, isComposed:false}
    ]
    const items = [
      {unit:100, qty:1, isTaxable: {tax1: true, tax2: true}}
    ]

    const result = calc(items, taxConfig)
    
    expect(result.subtotal).toBe(100)
    expect(result.total).toBe(114.98)
    expect(result.taxes.tax1).toBe(5)
    expect(result.taxes.tax2).toBe(9.98)
  })

  it('calculates a 2 item invoice', () => {
    const taxConfig = [
      {id:'tax1', rate:0.05, isComposed:false},
      {id:'tax2', rate:0.09975, isComposed:false}
    ]
    const items = [
      {unit:100, qty:1, isTaxable: {tax1: true, tax2: true}},
      {unit:100, qty:1, isTaxable: {tax1: true, tax2: true}}
    ]

    const result = calc(items, taxConfig)
    
    expect(result.subtotal).toBe(200)
    expect(result.total).toBe(229.95)
    expect(result.taxes.tax1).toBe(10)
    expect(result.taxes.tax2).toBe(19.95)
  })

  it('calculates a 2 item invoice', () => {
    const taxConfig = [
      {id:'tax1', rate:0.05, isComposed:false},
      {id:'tax2', rate:0.09975, isComposed:false}
    ]
    const items = [
      {unit:100, qty:2, isTaxable: {tax1: true, tax2: true}}
    ]

    const result = calc(items, taxConfig)
    
    expect(result.subtotal).toBe(200)
    expect(result.total).toBe(229.95)
    expect(result.taxes.tax1).toBe(10)
    expect(result.taxes.tax2).toBe(19.95)
  })

  it('calculates a 2 item invoice with composed taxes', () => {
    const taxConfig = [
      {id:'tax1', rate:0.05, isComposed:false},
      {id:'tax2', rate:0.095, isComposed:true}
    ]
    const items = [
      {unit:100, qty:2, isTaxable: {tax1: true, tax2: true}}
    ]

    const result = calc(items, taxConfig)
    
    expect(result.subtotal).toBe(200)
    expect(result.total).toBe(229.95)
    expect(result.taxes.tax1).toBe(10)
    expect(result.taxes.tax2).toBe(19.95)
  })

  it('calculates a 2 item invoice with composed taxes', () => {
    const taxConfig = [
      {id:'tax1', rate:0.05, isComposed:false},
      {id:'tax2', rate:0.095, isComposed:true}
    ]
    const items = [
      {unit:100, qty:1, isTaxable: {tax1: true, tax2: true}},
      {unit:100, qty:1, isTaxable: {tax1: true, tax2: true}}
    ]

    const result = calc(items, taxConfig)
    
    expect(result.subtotal).toBe(200)
    expect(result.total).toBe(229.95)
    expect(result.taxes.tax1).toBe(10)
    expect(result.taxes.tax2).toBe(19.95)
  })

  it('calculates when items are not taxable', () => {
    const taxConfig = [
      {id:'tax1', rate:0.05, isComposed:false},
      {id:'tax2', rate:0.095, isComposed:true}
    ]
    const items = [
      {unit:100, qty:1, isTaxable: {tax1: false, tax2: false}},
      {unit:100, qty:1, isTaxable: {tax1: false, tax2: false}}
    ]

    const result = calc(items, taxConfig)
    
    expect(result.subtotal).toBe(200)
    expect(result.total).toBe(200)
    expect(result.taxes.tax1).toBe(0)
    expect(result.taxes.tax2).toBe(0)
  })

  it('fails for invalid items', () => {
    const taxConfig = [
      {id:'tax1', rate:0.05, isComposed:false},
      {id:'tax2', rate:0.095, isComposed:true}
    ]
    const items = [
      {qty:1, isTaxable: {tax1: true, tax2: true}},
    ]

    const result = calc(items, taxConfig)
    
    expect(result).toBe(null)
  })

  it('fails for invalid tax configurations', () => {
    const taxConfig = [
      {id:'tax1', rate:"0.05", isComposed:false},
      {id:'tax2', rate:0.095, isComposed:true}
    ]
    const items = [
      {unit:100, qty:1, isTaxable: {tax1: true, tax2: true}},
    ]

    const result = calc(items, taxConfig)
    
    expect(result).toBe(null)
  })

  it('fails if items contain tax ids which arent in taxConfigs', () => {
    const taxConfig = [
      {id:'tax1', rate:"0.05", isComposed:false},
      {id:'tax2', rate:0.095, isComposed:true}
    ]
    const items = [
      {unit:100, qty:1, isTaxable: {nope: true, tax2: true}},
    ]

    const result = calc(items, taxConfig)
    
    expect(result).toBe(null)
  })

  it('calculates when there are no items', () => {
    const taxConfig = [
      {id:'tax1', rate:0.05, isComposed:false},
      {id:'tax2', rate:0.095, isComposed:true}
    ]
    const items = []

    const result = calc(items, taxConfig)
    
    expect(result.subtotal).toBe(0)
    expect(result.total).toBe(0)
    expect(result.taxes.tax1).toBe(0)
    expect(result.taxes.tax2).toBe(0)
  })

  it('calculates when there are no taxes', () => {
    const taxConfig = []
    const items = [
      {unit:100, qty:1, isTaxable: {}},
    ]

    const result = calc(items, taxConfig)
    
    expect(result.subtotal).toBe(100)
    expect(result.total).toBe(100)
    expect(result.taxes).toEqual({})
  })

  it('calculates when there are no taxes and no items', () => {
    const taxConfig = []
    const items = []

    const result = calc(items, taxConfig)
    
    expect(result.subtotal).toBe(0)
    expect(result.total).toBe(0)
    expect(result.taxes).toEqual({})
  })

})

