import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'
import User from '@/models/user'

const IS_AUTO_REGISTER = true

const handleAuthentication = async (req, username, password, done) => {
  try {
    let user = await User.findOne({ username: username }).lean().exec()

    // Create new user into users collection if user doesn't exists
    // In other words, auto register when login as the first time
    if (!user && IS_AUTO_REGISTER) {
      const hashedPassword = await bcrypt.hash(password, 10)
      
      user = new User({
        username: username,
        password: hashedPassword
      })
      await user.save()

      console.log(`User ${username} has been created!`)
    }

    if (user && await bcrypt.compare(password, user.password)) {
      done(null, user, { message: 'Logged in successfully' })
    } else {
      done(null, false, { message: 'Username or password is incorrect' })
    }
  } catch (error) {
    done(error)
  }
}

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    handleAuthentication
  )
)

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser((id, done) => {
  User
    .findById(id)
    .then((user) => done(null, user))
    .catch(done)
})

export default passport