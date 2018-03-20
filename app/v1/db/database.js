const Mongoose = require('mongoose');
//Mongoose.connect(process.env.MONGO_URL);
Mongoose.connect('mongodb://localhost/desafioh4');

// para guardar a isntancia usaos a connection
// para entender quando o banco é conectado
const connection = Mongoose.connection;

connection.once('open', () =>
  console.log('Base de dados, conectada MANOWWWWW'),
);
connection.once('error', () =>
  console.error('Não foi possível conectar, VISHHHH'),
);

module.exports(connection);
