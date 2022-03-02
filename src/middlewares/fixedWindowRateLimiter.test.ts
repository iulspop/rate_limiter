import { makeIsWithinFixedWindow } from './fixedWindowRateLimiter'

describe('isWithinFixedWindow()', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('returns true if request count not crossed limit', () => {
    const isWithinFixedWindow = makeIsWithinFixedWindow(1, 1)

    expect(isWithinFixedWindow('192.168.1.1')).toBe(true)
  })

  it('returns false if request count crossed limit', () => {
    const isWithinFixedWindow = makeIsWithinFixedWindow(1, 1)

    isWithinFixedWindow('192.168.1.1')
    expect(isWithinFixedWindow('192.168.1.1')).toBe(false)
  })

  it('request count is reset every window interval', () => {
    const isWithinFixedWindow = makeIsWithinFixedWindow(1, 1)

    isWithinFixedWindow('192.168.1.1')
    jest.advanceTimersByTime(1 * 60 * 1000)
    expect(isWithinFixedWindow('192.168.1.1')).toBe(true)
  })

  afterEach(() => {
    jest.useRealTimers()
  })
})
