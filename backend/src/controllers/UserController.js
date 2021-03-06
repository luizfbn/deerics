const connection = require('../database/connection')
const bcrypt = require('bcrypt')
const validation = require('../validation')
const pagination = 10

const encryptPassword = password => {
    const salt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password, salt)
}

module.exports = {

    async get (req, res) {
        const { page = 1 } = req.query
        const result = await connection('users').count('id').first()
        const count = result['count(`id`)']

        connection('users').select('id', 'name', 'nickname', 'email', 'admin')
            .limit(pagination)
            .offset((page - 1) * pagination)
            .then(users => res.json({ userList: users, count, pagination }))
            .catch(err => res.status(500).send(err))
    },
    
    getById (req, res) {
        connection('users').select('id', 'name', 'nickname', 'email', 'admin')
            .where('id', req.params.id)
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))

    },

    async create(req, res) {
        const user = req.body

        if(!req.originalUrl.startsWith('/users')) user.admin = false
        if(!req.user || !req.user.admin) user.admin = false

        try {
            validation.existsOrError(user.name, 'Nome não informado')
            validation.existsOrError(user.nickname, 'Apelido não informado')
            validation.existsOrError(user.email, 'E-mail não informado')
            validation.existsOrError(user.password, 'Senha não informada')
            validation.existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
            validation.equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            const regex = /\W/ // Proibe tudo, exceto letras, numeros e underline
            user.nickname = user.nickname.replace(' ', '').toLowerCase()

            if (regex.test(user.nickname)) {
                validation.notExistsOrError(user.nickname, 'Apelido com caracteres proibidos')
            }
            
            const userEmailFromDB = await connection('users')
                .where('email', user.email)
                .first()
            const userNickFromDB = await connection('users')
                .where('nickname', user.nickname)
                .first()
            
            validation.notExistsOrError(userEmailFromDB, 'Email já cadastrado')
            validation.notExistsOrError(userNickFromDB, 'Apelido já cadastrado')
            

        } catch(msg) {
            return res.status(400).send(msg)
        }

        user.password = encryptPassword(user.password) 
        delete user.confirmPassword

        connection('users')
            .insert(user)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))

    },
    
    async update (req, res) {
        const user = req.body

        if(!req.user || !req.user.admin) user.admin = false

        const userIdfromDB = await connection('users')
                .where('id', req.user.id)
                .select('id')
                .first()
        // Verifica se o ID do usuário do params é o mesmo do usuário autenticado 
        // Se for ADM pode fazer update de qualquer maneira
        if(req.params.id != userIdfromDB.id  && !req.user.admin) {
            return res.status(401).json({ error: 'Operation not permitted' })
        }
        try {

            validation.existsOrError(user.name, 'Nome não informado')
            validation.existsOrError(user.email, 'E-mail não informado')

            if(user.email) {
                const userEmailFromDB = await connection('users')
                    .where('email', user.email)
                    .whereNot('id', req.params.id)
                    .first()
                
                validation.notExistsOrError(userEmailFromDB, 'E-mail já cadastrado')
            }

            if (user.password || user.confirmPassword) {
                validation.existsOrError(user.password, 'Senha não informada')
                validation.existsOrError(user.confirmPassword, 'Confirmação de Senha inválida')
                validation.equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem')

                user.password = encryptPassword(user.password)
            }
            
        } catch(msg) {
            return res.status(400).send(msg)
        }

        let updatedUser = {
            name: user.name,
            email: user.email,
            password: user.password,
            admin: user.admin,
        }

        /* Remove qualquer atributo enviado por engano. Exemplo: uma string vazia */
        if(user.password == null || !user.password.trim()) delete updatedUser.password
        delete user.confirmPassword

        connection('users')
            .update(updatedUser)
            .where('id', req.params.id)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    },

    async delete (req, res) {
        try {
            const lyrics = await connection('lyrics')
                .where('user_id', req.params.id)
            validation.notExistsOrError(lyrics, 'Usuário possui letras.')

            const userDeleted = await connection('users')
                .where('id', req.params.id).delete()
            
            try {
                validation.existsOrError(userDeleted, 'Usuário não foi encontrado.')
            } catch(msg) {
                return res.status(400).send(msg)
            }

            try {
                await connection('lyrics_rating')
                    .where('user_id', req.params.id).delete()
                await connection('lyrics_comments')
                    .where('user_id', req.params.id).delete()
            } catch {
                return res.status(400).send('Erro ao deletar avaliações e/ou comentários do usuário')
            }

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }

}