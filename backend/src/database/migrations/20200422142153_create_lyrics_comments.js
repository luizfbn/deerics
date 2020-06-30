
exports.up = function(knex) {
    return knex.schema.createTable('lyrics_comments', function(table) {
        table.increments('id').primary()
        table.text('comment').notNullable()

        table.timestamp('created_at').notNullable()

        table.integer('user_id').notNullable()
        table.foreign('user_id').references('id').inTable('users')
        table.integer('lyric_id').notNullable()
        table.foreign('lyric_id').references('id').inTable('lyrics')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('lyrics_comments')
};
