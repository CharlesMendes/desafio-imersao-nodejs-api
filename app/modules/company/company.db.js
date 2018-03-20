// exportar apenas funções especificas
const { getModel } = require('./company.model');
const model = getModel();

class CompanyDB {
  static create(company) {
    const item = new model(company);
    const result = item.save();
    return result;
  }

  static getById(_id) {
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

  static list({ skip, limit }) {
    let query = {};

    const result = model
      .find(query, { __v: 0 })
      .skip(skip)
      .limit(limit);

    return result;
  }

  static listEmployeesByOffice(idCompany, office) {
    let query = {};

    if (office) {
      query = {
        $and: [{ _id: idCompany }, { 'employees.office': office }],
      };
    }

    const result = model.find(query, { __v: 0 });
    return result;
  }
}

module.exports = CompanyDB;
