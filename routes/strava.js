const passport = require('passport')
const StravaStrategy = require('passport-strava-oauth2').Strategy
const router = require('express').Router()

// const stravaConfig = {
//   clientID: process.env.STRAVA_CLIENT_ID || '32705',
//   clientSecret: process.env.STRAVA_CLIENT_SECRET || 'd3255f33d495951f29565493b2cc67312d472cf5',
//   callbackURL: process.env.STRAVA_CALLBACK || 'http://localhost:9000/callback'
// }

/*const strategy = new StravaStrategy(stravaConfig, (accessToken, refreshToken, profile, done) => {
  const stravaId = profile.id
  const name = profile.displayName
  const email = profile.emails[0].value
  User.find({where: {stravaId}})
    .then(foundUser => (foundUser
      ? done(null, foundUser)
      : User.create({name, email, stravaId})
        .then(createdUser => done(null, createdUser))
    ))
    .catch(done)
}) */

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(obj, done) {
  done(null, obj)
})

const strategy = new StravaStrategy({
    clientID: process.env.STRAVA_CLIENT_ID || '32705',
    clientSecret: process.env.STRAVA_CLIENT_SECRET || 'd3255f33d495951f29565493b2cc67312d472cf5',
    callbackURL: process.env.STRAVA_CALLBACK || 'https://localhost:9000/auth/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Strava profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Strava account with a user record in your database,
      // and return that user instead.
      console.log(`AccessToken: ${accessToken}`)
      console.log('strava profile: ' + JSON.stringify(profile, null, 2))
      return done(null, profile)
    })
})

passport.use(strategy)

router.get('/', passport.authenticate('strava', {scope:['public']}))

//The '/callback' route below is up to you, but it must match your //Strava callback URL
router.get('/callback', passport.authenticate('strava', {
  successRedirect: '/',
  failureRedirect: '/login'
}))

module.exports = router