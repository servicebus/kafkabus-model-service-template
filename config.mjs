import cconfig from 'cconfig'

// Using cconfig, a "cascading config" library, env variables will be
// cascaded on top of the default configuration.

const defaultConfig = {
  PORT: 3000,
  secretPath: '/run/secrets/',
  servicebus: {
    serviceName: 'todolist-model-service',
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || '6379',
      password: process.env.REDIS_PASSWORD,
    },
    kafka: {
      host: process.env.KAFKA_HOST || '127.0.0.1',
      port: process.env.KAFKA_PORT || '9092',
      brokers: process.env.KAFKA_BROKERS && process.env.KAFKA_BROKERS.split(',') || ['localhost:9092', 'localhost:9095', 'localhost:9098']
    },
  },
  sourced: {
    mongo: {
      host: process.env.MONGODB_HOST || "localhost",
      port: process.env.MONGODB_PORT || "27017",
      database: process.env.MONGODB_DATABASE || "todolist-model-service",
      username: process.env.MONGODB_USERNAME,
      password: process.env.MONGODB_PASSWORD
    }
  }
}

// add env variables on top of defaultConfig
let cascadedConfig = cconfig(defaultConfig)

export const getMongoUrl = ({ host, port, database, username, password } = {}) => {
  let auth = username && password ? `${username}:${password}@` : ''
  return `mongodb://${auth}${host}:${port}/${database}`
}
cascadedConfig.sourced.mongo.url = getMongoUrl(cascadedConfig.sourced.mongo)

// Everything that comes in from command line is a string,
// if you need a type, convert it here by the key name
const finalConfig = Object.keys(cascadedConfig).reduce((finalConfig, key) => {
  let value = cascadedConfig[key]

  switch (key) {
  case 'PORT':
    value = parseInt(value, 10)
    break

  default:
    break
  }

  finalConfig[key] = value
  return finalConfig
}, {})


export const config = finalConfig
