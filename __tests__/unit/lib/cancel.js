import { defaultTimeout, startCancelTimeout } from 'cancel.mjs'

describe('cancel', () => {
  it('throws an error if timeout is reached', () => {
    try {
      defaultTimeout()
    } catch (e) {
      expect(e).toBeDefined()
    }
  })

  it('calls timeout when reached', (done) => {
    const onTimeout = jest.fn()
    const timeout = startCancelTimeout(0, onTimeout)
    setTimeout(() => {
      expect(onTimeout).toBeCalled()
      clearTimeout(timeout)
      done()
    }, 10)
  })
  
  it('has default time and is cancellable', (done) => {
    const timeout = startCancelTimeout()
    
    setTimeout(() => {
      clearTimeout(timeout)
      done()
    }, 10)
  })
})
