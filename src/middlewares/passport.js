import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'

// Todo user getter logic
passport.use(new LocalStrategy({

}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  done(null, id)
})

export default passport