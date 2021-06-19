import session from 'next-session'
import connectMongo from 'connect-mongo'

const { SESSION_SECRET } = process.env

if (!SESSION_SECRET) {
  throw new Error('Please define the SESSION_SECRET environment variable on .env.local')
}

const MongoStore = connectMongo(session)

export default function sessionMiddleware(req, res, next) {
  const mongoStore = new MongoStore({
    client: req.dbClient,
    stringify: false,
  })

  return session({
    secret: process.env.SESSION_SECRET,
    store: mongoStore,
  })(req, res, next)
}