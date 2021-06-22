import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import passport from '@/middlewares/passport'

const handler = nextConnect()

handler.use(middleware)

handler.get((req, res) => {
  res.status(200).json({
    data: req.user,
    message: req.isAuthenticated() ? 'logged in' : 'not logged in'
  })
})

handler.post(
  passport.authenticate('local'),
  (req, res) => {
    res.status(200).end()
  }
)

handler.delete((req, res) => {
  req.logout()
  res.status(200).end()
})

export default handler