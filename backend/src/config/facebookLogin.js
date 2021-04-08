const FB = require('fb')
const connection = require('../database/connection')
const jwt = require('jwt-simple')
const validation = require('../validation')

const myAuthSecret = process.env.AUTH_SECRET || 'insiraUmSegredo'
const facebookAppId = process.env.FACE_APP_ID
const facebookAppSecret = process.env.FACE_APP_SECRET

module.exports = {
    async getFacebookAccessToken (req, res) { 
        
        let facebookToken = req.body.accessToken

        FB.options({version: 'v3.2'})
        FB.extend({appId: facebookAppId, appSecret: facebookAppSecret})
        FB.setAccessToken(facebookToken)

        await FB.api('me', {fields: ['id', 'name', 'first_name', 'email']}, async function(response) {
            const userFacebook = response

            let user = await connection('users')
                        .where('providerId', userFacebook.id)
                        .first()   
                             
            if (!user) {
                try {
                    const userEmailFromDB = await connection('users')
                                                .where('email', userFacebook.email)
                                                .first()

                    validation.notExistsOrError(userEmailFromDB, 'Email já cadastrado')
                } catch(msg) {
                    return res.status(400).send(msg)
                }
                
                await connection('users')
                    .insert({
                        providerId: userFacebook.id,
                        provider: 'facebook',
                        name: userFacebook.first_name,
                        nickname: userFacebook.name.replace(/\s+/g, '').toLowerCase() + '.' + userFacebook.id,
                        email: userFacebook.email,
                        password: null
                    })
                user = await connection('users')
                        .where('providerId', userFacebook.id)
                        .first()  
            }

            const now = Math.floor(Date.now() / 1000)

            const payload = {
                id: user.id,
                name: user.name,
                nickname: user.nickname,
                email: user.email,
                admin: user.admin,
                iat: now,
                exp: now + (60 * 60 * 24 * 7)
            }

            let credential = {
                ...payload,
                token: jwt.encode(payload, myAuthSecret)
            }

            return res.json(credential)
        })

    }
}