import { command, listen } from 'list.item.add.mjs'

jest.mock('llog')
jest.mock('models/TodoList', () => {
  let Entity = require('sourced').Entity
  class TodoList extends Entity {
    constructor () {
      super()
      this.items = []
      this.initialize = jest.fn()
      this.addItem = jest.fn()
    }
  }
  return { TodoList }
})
jest.mock('repos/todoListRepository', () => {
  let TodoList = require('models/TodoList').TodoList
  return {
    todoListRepository: {
      getAsync: jest.fn(() => new Promise((resolve) => {
        let todoList = new TodoList()
        todoList.initialize({ id: 'list-item-add-test' })
        resolve(todoList)
      })),
      commitAsync: jest.fn(() => new Promise((resolve) => { resolve() }))
    }
  }
})

describe('The list.item.add command handler', () => {
  it('should exist', () => {
    expect(command).toBeDefined()
    expect(typeof command === 'string').toBe(true)
    expect(listen).toBeDefined()
    expect(typeof listen === 'function').toBe(true)
  })

  it('should call callback with error when called without a todoListId', (done) => {
    let command = {
      type: 'list.item.add',
      data: {
        item: {
          todo: 'write this test'
        }
      }
    }
    let context = {
      bus: {
        publish: jest.fn()
      }
    }

    let cb = jest.fn((err) => {
      expect(err).toBe('Command Handler Failed for list.item.add - Error: list.item.add - todoListId must be defined!')
      done()
    })

    listen.call(context, command, cb)
  })

  it('should handle an command with the listen function', (done) => {
    let command = {
      type: 'list.item.add',
      data: {
        todoListId: 'test',
        item: {
          todo: 'write this test',
          completed: false
        }
      },
      datetime: new Date()
    }

    let context = {
      bus: {
        publish: jest.fn()
      }
    }

    let cb = jest.fn(() => {
      expect(context.bus.publish).toBeCalledWith('list.item.added', { 'completed': false, 'todo': 'write this test' })
      expect(cb).toBeCalled()
      done()
    })

    listen.call(context, command, cb)
  })

  it('should handle an command with the listen function', (done) => {
    let command = {
      type: 'list.item.add',
      data: {
        todoListId: 'test',
        item: {
          todo: 'write this test',
          completed: false
        }
      },
      datetime: new Date()
    }

    let context = {
      bus: {
        publish: jest.fn()
      }
    }

    let cb = jest.fn(() => {
      expect(context.bus.publish).toBeCalledWith('list.item.added', { 'completed': false, 'todo': 'write this test' })
      expect(cb).toBeCalled()
      done()
    })

    listen.call(context, command, cb)
  })

  it('throw an error if one occurs while getting the repository', (done) => {
    let command = {
      type: 'list.item.add',
      data: {
        todoListId: 'test',
        item: {
          todo: 'write this test',
          completed: false
        }
      },
      datetime: new Date()
    }

    let context = {
      bus: {
        publish: jest.fn()
      }
    }

    let cb = jest.fn((err) => {
      expect(err).toBeDefined()
      done()
    })

    let todoListRepository = require('repos/todoListRepository').todoListRepository
    todoListRepository.getAsync = jest.fn(() => new Promise((resolve, reject) => { reject(new Error('Repo Error')) }))

    listen.call(context, command, cb)
  })
})