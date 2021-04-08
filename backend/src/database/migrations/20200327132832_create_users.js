
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.increments('id').primary()
        
        table.string('providerId')
        table.string('provider').defaultTo(null)
        
        table.string('name').notNullable()
        table.string('nickname').notNullable().unique()
        table.string('email').notNullable().unique()
        table.string('password')
        table.boolean('admin').notNullable().defaultTo(false)
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
