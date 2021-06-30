import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import passport from '@/middlewares/passport'
import User from '@/models/user'

const handler = nextConnect()

handler.use(middleware)

/**
 * @method GET
 * @endpoint /api/auth
 * @description For getting user credentials if exists
 */
handler.get(async (req, res) => {
  const isAuthenticated = req.isAuthenticated()

  res.status(isAuthenticated ? 200 : 401)
    .json({
      success: true,
      message: isAuthenticated ? 'Credentials found' : 'No credentials found',
      data: {
        user: await User.findById(req.user.id),
        timestamp: req.user && new Date()
      }
    })
})

/**
 * @method POST
 * @endpoint /api/auth
 * @description Login for signing credentials in server session
 * 
 * @param username
 * @param password
 */
handler.post((req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) {
      return res.status(500).json({ success: false, message: info.message })
    }

    if (!user) {
      return res.status(401).json({ success: false, message: info.message })
    }

    req.login(user, (loginError) => {
      if (loginError) {
        return res.status(401).json({ success: false, message: loginError })
      }

      return res.status(200).json({ success: true, message: info.message })
    })
  })(req, res, next)
})

/**
 * @method DELETE
 * @endpoint /api/auth
 * @description Logout and remove credentials from server session
 */
handler.delete((req, res) => {
  req.logout()

  res
    .status(200)
    .json({
      sucess: true,
      message: 'Logged out successfully'
    })
})

export default handler