import mongoose from 'mongoose'

const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env

if (!MONGO_USER || !MONGO_PASS || !MONGO_HOST || !MONGO_PORT || !MONGO_DB) {
  throw new Error('Please define the MONGO environment variable on .env.local')
}

const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

// Prevents connections growing during API Route usage on ho reloads in development
global.mongoose = global.mongoose || {}
const cache = global.mongoose

export default async function database(req, res, next) {
  if (!cache.connection) {
    console.log('Connecting to MongoDB...')
    try {
      const { connection } = await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      })

      cache.connection = connection
      cache.client = connection.getClient()

      console.log('MongoDB connection established')
    } catch (error) {
      throw new Error(error)
    }
  }

  req.dbClient = cache.client
  return next()
}