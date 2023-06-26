import { describe, it, expect } from 'vitest'

import add from '../components/math'

describe('Testing all payment systems', () => {
  it('Addition works fine', () => {
    const result = add(2, 5, 7, 8, 10)

    expect(result).to.equal(2 + 5 + 7 + 8 + 10)
  })

  it('Addition returns null if non-integer is passed', () => {
    const result1 = add(2, NaN, 7, 8, 10)
    expect(result1).to.equal(null)
  })

  it('Addition should throw on empty call', () => {
    const fn = () => {
      add()
    }

    expect(fn).toThrow()
  })
})
