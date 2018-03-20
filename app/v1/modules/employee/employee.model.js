const Mongoose = require('mongoose');

class EmployeeModel {
  static getModel() {
    // para trabalhar com mongoose, precisamos definir
    // nossos Schemas (nosso mapeamento da base de dados)
    const employeeSchema = new Mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
        required: true,
      },
      birthdate: {
        type: Date,
        required: true,
      },
      office: {
        type: String,
        enum: [
          'DIRETOR',
          'DESENVOLVEDOR',
          'ANALISTA',
          'DIRECTOR',
          'DEVELOPER',
          'ANALYST',
        ],
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
      userEmail: {
        type: String,
        required: true,
      },
    });

    // Definimos um model collection para nosso documento
    const employeeModel = Mongoose.model('employees', employeeSchema);

    return employeeModel;
  }
}

module.exports = EmployeeModel;
