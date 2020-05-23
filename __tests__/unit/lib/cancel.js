import { defaultTimeout, startCancelTimeout } from 'cancel.mjs'

describe('cancel', () => {
  it('throws an error if timeout is reached', () => {
    expect(() => {
      defaultTimeout()
    }).toThrow()
  })

  it('calls timeout when reached', (done) => {
    const onTimeout = jest.fn()
    startCancelTimeout(0, onTimeout)
    setTimeout(() => {
      expect(onTimeout).toBeCalled()
      done()
    }, 50)
  })
})
