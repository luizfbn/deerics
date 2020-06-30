const connection = require('../database/connection')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt')

const myAuthSecret = process.env.AUTH_SECRET || 'insiraUmSegredo'

module.exports = {

    async signin (req, res) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!')
        }

        const user = await connection('users')
            .where('email', req.body.email)
            .first()

        if (!user) return res.status(400).send('Usuário não encontrado!')

        const isMatch = bcrypt.compareSync(req.body.password, user.password)
        if (!isMatch) return res.status(400).send('Email/Senha inválidos!')

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

        return res.json({
            ...payload,
            token: jwt.encode(payload, myAuthSecret)
        })
    },
    async validateToken(req, res) {
        const userData = req.body || null
        try {
            if(userData) {
                const token = jwt.decode(userData.token, myAuthSecret)
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch(msg) {
            // problema com o token
        }

        return res.send(false)
    },
    async validateAdmin(req, res) {
        const userData = req.body || null
        try {
            if(userData) {
                const userDB = await connection('users').where('id', userData.id).first()
                if (userDB.admin) {
                    return res.send(true) 
                } else {
                    return res.send(false)
                }
            }
        } catch(msg) {
            //problema com os dados do usuario
        }

        return res.send(false)
    }

}
