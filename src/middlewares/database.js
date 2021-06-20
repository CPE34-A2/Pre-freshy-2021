import { MongoClient } from 'mongodb'

const { MONGODB_URI, MONGODB_DB } = process.env

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable on .env.local')
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable on .env.local')
}

// Prevents connections growing during API Route usage on ho reloads in development
global.mongo = global.mongo || {}

// MongoDB client instance can be reused later by this middleware
export default async function database(req, res, next) {
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    await global.mongo.client.connect()
    console.log('Cached new mongodb instance')
  }

  req.dbClient = global.mongo.client
  req.db = global.mongo.client.db(MONGODB_DB)
  return next()
}