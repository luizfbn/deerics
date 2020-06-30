const connection = require('../database/connection')
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

const myAuthSecret = process.env.AUTH_SECRET || 'insiraUmSegredo'

const params = {
    secretOrKey: myAuthSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const strategy = new Strategy(params, (payload, done) => {
    connection('users')
        .where({ id: payload.id })
        .first()
        .then(user => done(null, user ? { ...payload } : false))
        .catch(err => done(err, false))
})

passport.use(strategy)

module.exports = {
    initialize: () => passport.initialize(),
    authenticate: () => passport.authenticate('jwt', { session: false })
}