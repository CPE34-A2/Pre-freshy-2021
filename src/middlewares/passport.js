import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'

passport.use(
  new LocalStrategy(
    { passReqToCallback: true },
    async (req, username, password, done) => {
      const user = await req.db
        .collection('users')
        .findOne({ username: username })

      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      
      return done(null, (isPasswordCorrect ? user : false))
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  done(null, id)
})

export default passport