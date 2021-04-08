const connection = require('../database/connection')
const validation = require('../validation')
const pagination = 4

module.exports = {

    async get(req, res) {
        const { page = 1 } = req.query
        const result = await connection('lyrics').count('id').first()
        const count = result['count(`id`)']

        connection('lyrics')
            .join('users', 'users.id', '=', 'lyrics.user_id')
            .orderBy([{ column: 'lyrics.verified', order: 'desc' }, { column: 'lyrics.created_at', order: 'desc' }])
            .limit(pagination)
            .offset((page - 1) * pagination)
            .select(['lyrics.id',
                    'lyrics.track_id',
                    'lyrics.title',
                    'lyrics.content',
                    'lyrics.translation',
                    'lyrics.created_at',
                    'lyrics.modified_at', 
                    'lyrics.likes',
                    'lyrics.dislikes',
                    'lyrics.verified',
                    'users.name',
                    'users.nickname'])
            .then(lyrics => res.json({ lyricList: lyrics, count, pagination }))
            .catch(err => res.status(500).send(err))
    },
    
    getById(req, res) {
        connection('lyrics')
            .join('users', 'users.id', '=', 'lyrics.user_id')
            .where('lyrics.id', req.params.id)
            .select(['lyrics.*',
                    'users.name',
                    'users.nickname'])
            .first()
            .then(lyric => res.json(lyric))
            .catch(err => res.status(500).send(err))
    },

    async getByUserId(req, res) {
        const { page = 1 } = req.query
        const userId = req.params.id
        const result = await connection('lyrics').where('user_id', userId).count('id').first()
        const count = result['count(`id`)']

        connection('lyrics')
            .join('users', 'users.id', '=', 'lyrics.user_id')
            .where('user_id', userId)
            .limit(pagination)
            .offset((page - 1) * pagination)
            .select(['lyrics.*',
                    'users.name',
                    'users.nickname'])
            .then(lyrics => res.json({ lyricList: lyrics, count, pagination }))
            .catch(err => res.status(500).send(err))
    },

    async getByTrackId(req, res) {
        const { page = 1 } = req.query
        const trackId = req.params.id
        const result = await connection('lyrics').where('track_id', trackId).count('id').first()
        const count = result['count(`id`)']

        connection('lyrics')
            .join('users', 'users.id', '=', 'lyrics.user_id')
            .orderBy([{ column: 'lyrics.verified', order: 'desc' }, { column: 'lyrics.likes', order: 'desc' }])
            .where('track_id', trackId)
            .limit(pagination)
            .offset((page - 1) * pagination)
            .select(['lyrics.*',
                    'users.name',
                    'users.nickname'])
            .then(lyrics => res.json({ lyricList: lyrics, count, pagination }))
            .catch(err => res.status(500).send(err))
    },

    create(req, res) {
        const lyric = req.body

        if(!req.user.admin || lyric.verified == undefined) lyric.verified = false

        try {
            validation.existsOrError(lyric.track_id, 'Track ID não informado')
            validation.existsOrError(lyric.title, 'Título não informado')
            validation.existsOrError(lyric.content, 'Conteúdo não informado')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        connection('lyrics')
            .insert({
                track_id: lyric.track_id,
                title: lyric.title,
                content: lyric.content,
                translation: lyric.translation,
                verified: lyric.verified,
                created_at: new Date(),
                user_id: req.user.id
            })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    },

    async update(req, res) {
        const lyric = req.body

        const userId = await connection('lyrics')
                .where('id', req.params.id)
                .select('user_id')
                .first()
        // Verifica se o ID do dono da letra é o mesmo do usuário autenticado 
        // Se for ADM pode fazer update de qualquer maneira
        if(req.user.id != userId.user_id  && !req.user.admin) {
            return res.status(401).json({ error: 'Operation not permitted' })
        }

        if(!req.user.admin && lyric.verified != undefined) lyric.verified = false

        try {
            validation.existsOrError(lyric.title, 'Título não informado')
            validation.existsOrError(lyric.content, 'Conteúdo não informado')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        let updatedLyric = { 
            title: lyric.title,
            content: lyric.content,
            translation: lyric.translation,
            verified: lyric.verified,
            modified_at: new Date() 
        }
 
        connection('lyrics')
            .update(updatedLyric)
            .where('id', req.params.id)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err)) 
    },

    async delete(req, res) {
        const userId = req.user.id
        const lyric = await connection('lyrics')
            .where('id', req.params.id)
            .select('user_id')
            .first()

        try {
            validation.existsOrError(lyric, 'Letra não encontrada.')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        if(lyric.user_id != userId && !req.user.admin) {
            return res.status(401).json({ error: 'Operation not permitted' })
        }

        // Deleta os registros de likes e dislikes da tabela lyrics_rating correspondentes a letra
        // Deleta os registros de comentários da tabela lyrics_comments correspondentes a letra
        try {
            await connection('lyrics_rating')
                .where('lyric_id', req.params.id).delete()

            await connection('lyrics_comments')
                .where('lyric_id', req.params.id).delete()
        } catch {
            return res.status(400).send('Erro ao deletar avaliações e/ou comentários da letra')
        }
        
        connection('lyrics')
            .where('id', req.params.id)
            .delete()
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))

    }
}