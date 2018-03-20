const Mongoose = require('mongoose');

class UserModel {
  static getModel() {
    // para trabalhar com mongoose, precisamos definir
    // nossos Schemas (nosso mapeamento da base de dados)
    const userSchema = new Mongoose.Schema({
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
    });

    // Definimos um model collection para nosso documento
    const userModel = Mongoose.model('users', userSchema);

    return userModel;
  }
}

module.exports = UserModel;
