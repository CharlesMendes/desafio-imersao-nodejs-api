// exportar apenas funções especificas
const { getModel } = require('./company.model');
const model = getModel();

class CompanyDB {
  static create(company) {
    // o metodo save, caso o model possuir um _id, ele fará o update
    // para somente inserir
    // model.create(user)
    const item = new model(company);
    const result = item.save();
    return result;
  }

  static getById(_id) {
    console.log({ _id });
    const result = model.findOne({ _id }, { __v: 0 });
    return result;
  }

  static update(id, company) {
    const result = model.update(
      {
        _id: id,
      },
      {
        $set: company,
      },
    );

    return result;
  }

  static delete(id) {
    const result = model.remove({ _id: id });
    return result;
  }

  static listEmployees(id, office) {
    // const -> quando nao alteramos o valor de uma variavel
    // let -> quando precisamos alterar apos defini-la, nunca usar o 'var'
    let query = {};

    // caso o usuario nao definir o nome, nao atribui o valor
    // passamos o options ao regex para definir o case insensitive (ignora upper/lower)
    // esse regex é um contains
    if (office) {
      query = {
        $and: [{ _id: id }, { office }],
      };
    }

    const result = model.find(query, { __v: 0 });
    return result;
  }
}

module.exports = CompanyDB;
