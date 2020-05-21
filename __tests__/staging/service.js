import debug from 'debug'
import { makeBus } from '@servicebus/kafkabus-common'
import readableId from 'readable-id-mjs'

const config = {
  servicebus: {
    serviceName: `test-todolist-model-service-${readableId()}`,
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || '6379'
    },
    kafka: {
      host: process.env.KAFKA_HOST || '127.0.0.1',
      port: process.env.KAFKA_PORT || '9093',
      brokers: process.env.KAFKA_BROKERS && process.env.KAFKA_BROKERS.split(',') || ['localhost:9093', 'localhost:9095', 'localhost:9097']
    },
    mongo: {
      url: process.env.MONGO_URL || 'mongodb://localhost:27017/todolist-model-service'
    },
  }
}

const log = debug('todolist-model-service')

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15 * 1000

describe('service', () => {
  let bus

  beforeAll(async function (done) {
    log('preparing for tests', config)

    bus = await makeBus(config.servicebus)

    done()
  })

  afterAll(() => {
    // give messages some time to send before closing bus
    bus.close()
    log('closing bus', bus.channels)
    // bus.channels.forEach(function (channel) {
    //   channel.close();
    // });
    // bus.connection.close();

    log('closed')
  })

  it('list.item.add command', async (done) => {
    const testCommand = 'list.item.add'
    const newItem = {
      item: {
        todo: 'write tests',
        complete: false
      },
      todoListId: 'test - list.item.add command'
    }

    const doTest = () => {
      return new Promise(async (resolve, reject) => {
        await bus.subscribe('list.item.added', (event, cb) => {
          log('list.item.added', event.data)
          resolve(event)
        })

        setTimeout(async () => {
          await bus.send(testCommand, newItem, { ack: true, correlationId: 'test-id' })
          log(`sent ${testCommand} command`)
        }, 500)
      })
    }

    const event = await doTest()

    expect(event).toBeDefined()
    expect(event.data).toEqual(newItem.item)
    expect(event.datetime).toBeDefined()
    expect(event.type).toBe('list.item.added')
    done()
  })
})
