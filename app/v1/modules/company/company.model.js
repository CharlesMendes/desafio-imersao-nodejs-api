const Mongoose = require('mongoose');

class CompanyModel {
  static getModel() {
    // para trabalhar com mongoose, precisamos definir
    // nossos Schemas (nosso mapeamento da base de dados)
    const companySchema = new Mongoose.Schema({
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
    });

    // Definimos um model collection para nosso documento
    const companyModel = Mongoose.model('companies', companySchema);

    return companyModel;
  }
}

module.exports = CompanyModel;
