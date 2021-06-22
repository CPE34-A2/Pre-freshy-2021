import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'
import User from '@/models/user'

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      const user = await User
        .findOne({ username: username })
        .exec()

      if (user && await bcrypt.compare(password, user.password)) {
        done(null, user)
      } else {
        done(null, false, { message: 'Username or password is incorrect' })
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, { id: user._id })
})

passport.deserializeUser((id, done) => {
  done(null, id)
})

export default passport