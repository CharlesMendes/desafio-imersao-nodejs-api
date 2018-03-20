// exportar apenas funções especificas
const { getModel } = require('./employee.model');
const model = getModel();

class EmployeeDB {
  static create(employee) {
    // o metodo save, caso o model possuir um _id, ele fará o update
    // para somente inserir
    // model.create(user)
    const item = new model(employee);
    const result = item.save();
    return result;
  }

  static getById(_id) {
    console.log({ _id });
    const result = model.findOne({ _id }, { __v: 0 });
    return result;
  }

  static update(id, employee) {
    const result = model.update(
      {
        _id: id,
      },
      {
        $set: employee,
      },
    );

    return result;
  }

  static delete(id) {
    const result = model.remove({ _id: id });
    return result;
  }
}

module.exports = EmployeeDB;
