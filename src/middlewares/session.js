import session from 'express-session'
import MongoStore from 'connect-mongo'

const { SESSION_SECRET, MONGO_URI } = process.env

if (!SESSION_SECRET) {
  throw new Error('Please define the SESSION_SECRET environment variable on .env.local')
}

export default function sessionMiddleware(req, res, next) {
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
  })(req, res, next)
}