// Conexão com o MongoDB
const MongoConn = require('../../db/database');

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
    console.log({ _id });
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

  static list() {
    // const -> quando nao alteramos o valor de uma variavel
    // let -> quando precisamos alterar apos defini-la, nunca usar o 'var'
    let query = {};

    const result = model.find(query, { __v: 0 });
    return result;
  }
  
  static login({ email, password }) {
    // const -> quando nao alteramos o valor de uma variavel
    // let -> quando precisamos alterar apos defini-la, nunca usar o 'var'
    let query = {};

    // caso o usuario nao definir o nome, nao atribui o valor
    // passamos o options ao regex para definir o case insensitive (ignora upper/lower)
    // esse regex é um contains
    if (email) {
      query = {
        $and: [{ email }, { password }],
      };
    }

    const result = model.find(query, { __v: 0 });
    return result;
  }
}

module.exports = UserDB;
