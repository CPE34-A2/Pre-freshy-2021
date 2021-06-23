import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import passport from '@/middlewares/passport'

const handler = nextConnect()

handler.use(middleware)

/**
 * @method GET
 * @endpoint /api/auth
 * @description For getting user credentials if exists
 */
handler.get((req, res) => {
  const isAuthenticated = req.isAuthenticated()

  res.status(isAuthenticated ? 200 : 401)
    .json({
      success: true,
      message: isAuthenticated ? 'Credentials found' : 'No credentials found',
      data: {
        user: req.user,
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
handler.post(
  passport.authenticate('local'),
  (req, res) => {
    res
      .status(200)
      .json({
        sucess: true,
        ...req.authInfo
      })
  }
)

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