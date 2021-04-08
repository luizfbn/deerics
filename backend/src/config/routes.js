const express = require('express')
const passport = require('./passport')
const admin = require('./admin')

const UserController = require('../controllers/UserController')
const LyricController = require('../controllers/LyricController')
const LyricIncController = require('../controllers/LyricIntController')
const CommentController = require('../controllers/CommentController')
const AuthController = require('../controllers/AuthController')

const routes = express.Router()

const FacebookLogin = require('./facebookLogin')

routes.post('/facebook', FacebookLogin.getFacebookAccessToken)

routes.post('/signin', AuthController.signin)
routes.post('/signup', UserController.create)
routes.post('/validateToken', AuthController.validateToken)
routes.post('/validateAdmin', AuthController.validateAdmin)

routes.get('/users', passport.authenticate(), admin(UserController.get))

routes.get('/users/:id', UserController.getById)
routes.post('/users', passport.authenticate(), admin(UserController.create))
routes.put('/users/:id', passport.authenticate(), UserController.update)
routes.delete('/users/:id', passport.authenticate(), admin(UserController.delete))

routes.get('/track/:id', LyricController.getByTrackId)
routes.put('/verify/:id', passport.authenticate(), admin(LyricIncController.verifyLyric))
routes.post('/rating/:id', passport.authenticate(), LyricIncController.ratingLyric)
routes.get('/rating/:id', passport.authenticate(), LyricIncController.getUserRate)

routes.get('/comments/:id', CommentController.getByLyricId)
routes.post('/comment/:id', passport.authenticate(), CommentController.create)
routes.delete('/comment/:id', passport.authenticate(), CommentController.delete)

routes.get('/lyrics', LyricController.get)
routes.get('/lyrics/:id', LyricController.getById)
routes.get('/lyrics/user/:id', LyricController.getByUserId)
routes.post('/lyrics', passport.authenticate(), LyricController.create)
routes.put('/lyrics/:id', passport.authenticate(), LyricController.update)
routes.delete('/lyrics/:id', passport.authenticate(), LyricController.delete)

module.exports = routes