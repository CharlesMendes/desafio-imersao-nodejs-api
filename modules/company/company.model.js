const Mongoose = require('mongoose');

class CompanyModel {
  static getModel() {
    // para trabalhar com mongoose, precisamos definir
    // nossos Schemas (nosso mapeamento da base de dados)
    const companySchema = new Mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      cnpj: {
        type: String,
        required: true,
        unique: true,
      },
      employees: [
        {
          name: {
            type: String,
            required: true,
          },
          age: {
            type: Number,
          },
          birthdate: {
            type: Date,
            required: true,
          },
          office: {
            type: String,
            enum: ['DIRETOR', 'DESENVOLVEDOR', 'ANALISTA'],
            required: true,
          },
          user: {
            email: {
              type: String,
              required: true,
              unique: true,
            },
          },
        },
      ],
    });

    // Definimos um model collection para nosso documento
    const companyModel = Mongoose.model('companies', companySchema);

    return companyModel;
  }
}

module.exports = CompanyModel;
