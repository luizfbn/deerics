
exports.up = function(knex) {
    return knex.schema.createTable('lyrics', function(table) {
        table.increments('id').primary()
        table.string('track_id').notNullable()
        table.string('title').notNullable()
        table.text('content').notNullable()
        table.text('translation')

        table.timestamp('created_at').notNullable()
        table.timestamp('modified_at')
        
        table.integer('likes').notNullable().defaultTo(0)
        table.integer('dislikes').notNullable().defaultTo(0)
        table.boolean('verified').notNullable().defaultTo(false)

        table.integer('user_id').notNullable()
        table.foreign('user_id').references('id').inTable('users')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('lyrics')
};
