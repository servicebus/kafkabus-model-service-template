export const defaultTimeout = () => {
  throw new Error('the request is taking too long')
}

export const startCancelTimeout = (timeout = 60 * 1000, onTimeout = defaultTimeout) => setTimeout(onTimeout, timeout)