const bcrypt = require('bcrypt')

const encryptPassword = password => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { name: 'Admin',
          nickname: 'Boss',
          email: 'admin@admin.com',
          password: encryptPassword('123456') ,
          admin: true }
      ]);
    });
};
