const connection = require('../database/connection')
const validation = require('../validation')
const pagination = 3

module.exports = {

    async getByLyricId(req, res) {
        const { page = 1 } = req.query
        const result = await connection('lyrics_comments').where('lyric_id', req.params.id).count('id').first()
        const count = result['count(`id`)']

        connection('lyrics_comments')
            .where('lyric_id', req.params.id)
            .join('users', 'users.id', '=', 'lyrics_comments.user_id')
            .orderBy('lyrics_comments.created_at', 'desc')
            .limit(pagination)
            .offset((page - 1) * pagination)
            .select(['lyrics_comments.*', 'users.name', 'users.nickname'])
            .then(comments => res.json({ commentList: comments, count, pagination }))
            .catch(err => res.status(500).send(err))
    },

    async create(req, res) {
        const lyric = req.body

        const verifyLyric = await connection('lyrics').where('id', req.params.id).first()

        try {
            validation.existsOrError(lyric.comment, 'Comentário não informado')
            validation.existsOrError(verifyLyric, 'Letra não encontrada')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        connection('lyrics_comments')
            .insert({
                comment: lyric.comment,
                created_at: new Date(),
                user_id: req.user.id,
                lyric_id: req.params.id
            })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    },

    async delete(req, res) {
        const comment = await connection('lyrics_comments').where('id', req.params.id).first()

        try {
            validation.existsOrError(comment, 'Comentário não encontrado')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        if(comment.user_id != req.user.id && !req.user.admin) {
            return res.status(401).json({ error: 'Operation not permitted' })
        }

        connection('lyrics_comments')
            .where('id', req.params.id)
            .delete()
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

}