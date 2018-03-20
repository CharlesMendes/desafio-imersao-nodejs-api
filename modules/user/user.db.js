// nodemon nomeDoArquivo.js
const Mongoose = require('mongoose');
Mongoose.connect(process.env.MONGO_URL);

const connection = Mongoose.connection;

connection.once('open', () =>
  console.log('Base de dados, conectada MANOWWWWW'),
);
connection.once('error', () =>
  console.error('Não foi possível conectar, VISHHHH'),
);

// exportar apenas funções especificas
const { getModel } = require('./user.model');
const model = getModel();

class UserDB {
  static create(user) {
    // o metodo save, caso o model possuir um _id, ele fará o update
    // para somente inserir
    // model.create(user)
    const item = new model(user);
    const result = item.save();
    return result;
  }

  static getById(_id) {
    const result = model.findOne({ _id }, { __v: 0 });
    return result;
  }

  static update(id, user) {
    const result = model.update(
      {
        _id: id,
      },
      {
        $set: user,
      },
    );

    return result;
  }

  static delete(id) {
    const result = model.remove({ _id: id });
    return result;
  }

  static list({ skip, limit }) {
    let query = {};

    const result = model
      .find(query, { __v: 0 })
      .skip(skip)
      .limit(limit);

    return result;
  }

  static login(user) {
    let query = {};

    query = {
      //$and: [{ email: user.email }, { password: user.password }],
      $and: [{ email: user.email }],
    };

    const result = model.find(query, { __v: 0 });
    return result;
  }
}

module.exports = UserDB;
