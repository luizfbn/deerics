const connection = require('../database/connection')
const validation = require('../validation')

module.exports = {

    verifyLyric(req, res) {
        const lyricId = req.params.id

        connection('lyrics')
            .where('id', lyricId)
            .update({ verified: req.body.verified })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    },

    async ratingLyric(req, res) {
        const lyricId = req.params.id

        // Verifica se a letra é existente
        const verifyLyric = await connection('lyrics').where('id', lyricId).first()
        try {
            validation.existsOrError(verifyLyric, 'Letra não encontrada')
        } catch(msg) {
            return res.status(400).send(msg)
        }

        // Verifica se o usuário já avaliou alguma vez. Caso seja positivo, é feito um update do registro
        const ratingFromDB = await connection('lyrics_rating')
                .where('user_id', req.user.id)
                .andWhere('lyric_id', lyricId).first()

        if(!ratingFromDB) {
            await connection('lyrics_rating')
                .insert({
                    user_id: req.user.id,
                    lyric_id: lyricId,
                    rating: req.body.rating
                })
                .catch(err => res.status(500).send(err))
        } else {
            await connection('lyrics_rating')
                .update({
                    rating: req.body.rating
                })
                .where('user_id', req.user.id)
                .andWhere('lyric_id', lyricId)
                .catch(err => res.status(500).send(err))
        }

        // Atualiza o total de likes e dislikes da letra na tabela lyrics
        const likesFromDB = await connection('lyrics_rating')
                                    .where('lyric_id', lyricId)
                                    .andWhere('rating', 1)
                                    .count('rating')
                                    .first()
        const dislikesFromDB = await connection('lyrics_rating')
                                        .where('lyric_id', lyricId)
                                        .andWhere('rating', 0)
                                        .count('rating')
                                        .first()

        await connection('lyrics')
            .update( { 
                likes: likesFromDB['count(`rating`)'],
                dislikes: dislikesFromDB['count(`rating`)']
            })
            .where('id', lyricId)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
    }

}