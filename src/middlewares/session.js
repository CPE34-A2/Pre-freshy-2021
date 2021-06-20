import session from 'express-session'
import MongoStore from 'connect-mongo'

const { SESSION_SECRET, MONGODB_DB } = process.env

if (!SESSION_SECRET) {
  throw new Error('Please define the SESSION_SECRET environment variable on .env.local')
}

export default function sessionMiddleware(req, res, next) {
  const dbClient = req.dbClient
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ client: dbClient, dbName: MONGODB_DB }),
  })(req, res, next)
}