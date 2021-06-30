import nextConnect from 'next-connect'
import middleware from '@/middlewares/middleware'
import passport from '@/middlewares/passport'
import bcrypt from 'bcryptjs'

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


const MINIMUM_PASSWORD_LENGTH = 10
/**
 * @method PATCH
 * @endpoint /api/auth
 * @description let user changed password
 * 
 * @param old_password
 * @param new_password
 */
handler.patch(async (req, res) => {
  const oldPassword = req.body.old_password
  const newPassword = req.body.new_password

  if (!newPassword || newPassword < MINIMUM_PASSWORD_LENGTH)
    return res
      .status(400)
      .json({
        sucess: false,
        message: `new password doesn't match the criteria`
      })

  const user = await User.findById(req.user.id).select('password').exec()

  if (!oldPassword || !await bcrypt.compare(oldPassword, user.password))
    return res
      .status(401)
      .json({
        sucess: false,
        message: 'old password is not matching the database'
      })

  user.password = await bcrypt.hash(newPassword, 10)
  await user.save()

  req.logout()

  res
    .status(200)
    .json({
      sucess: true,
      message: 'password changed successfully'
    })
})

export default handler