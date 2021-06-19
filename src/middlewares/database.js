import { MongoClient } from 'mongodb'

const { MONGODB_URI, MONGODB_DB } = process.env

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable on .env.local')
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable on .env.local')
}

// Prevents connections growing during API Route usage on ho reloads in development
const cache = global.mongo

// MongoDB client instance can be reused later by this middleware
export default async function database(req, res, next) {
  if (!cache.client) {
    const client = new MongoClient.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    cache.client = await client.connect()
    console.log('Cached new mongodb instance')
  }

  req.dbClient = cache.client
  req.db = cache.client.db(MONGODB_DB)
  return next()
}