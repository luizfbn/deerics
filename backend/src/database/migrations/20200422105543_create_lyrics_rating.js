
exports.up = function(knex) {
    return knex.schema.createTable('lyrics_rating', function(table) {
        table.increments('id').primary()
        table.boolean('rating').notNullable()

        table.integer('user_id').notNullable()
        table.foreign('user_id').references('id').inTable('users')
        table.integer('lyric_id').notNullable()
        table.foreign('lyric_id').references('id').inTable('lyrics')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('lyrics_rating')
};
