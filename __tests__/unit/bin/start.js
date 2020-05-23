import { start, onStart } from 'start.mjs'
jest.mock('llog')
jest.mock('@servicebus/register-handlers')
jest.mock('@servicebus/kafkabus-common')
jest.mock('../../../config.mjs')
jest.mock('sourced-repo-mongo/mongo')

describe('./bin/start.mjs', () => {
  it('should start our todolist-model-service', () => {
    const log = require('llog')

    start()

    onStart()
    expect(log.info).toBeCalled()
  })

  it('should throw an error if it cant connect to mongo', () => {
    const mongoClient = require('sourced-repo-mongo/mongo')
    mongoClient.connect = jest.fn(() => new Promise((resolve, reject) => { reject(new Error('MongoDB Error')) }))
    const mockOnStart = jest.fn()
    expect(start(mockOnStart)).rejects.toEqual(new Error('Error connecting to mongo'))
    expect(mockOnStart).not.toBeCalled()
  })
})
