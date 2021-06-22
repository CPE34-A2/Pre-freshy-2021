import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import passport from '@/middlewares/passport'

const handler = nextConnect()

handler.use(middleware)

// Todo login logic
handler.post(
  passport.authenticate(('local'), (req, res) => {
    res.json('')
  })
)

handler.delete((req, res) => {
  req.logout()
  res.status(200).end()
})

export default handler