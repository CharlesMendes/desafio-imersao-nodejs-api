// importamos o dotenv
const { config } = require('dotenv');
if (process.env.NODE_ENV === 'production')
  config({ path: './v1/config/.env.prod' });
else config({ path: './v1/config/.env.dev' });

console.log('NODE_ENV', process.env.NODE_ENV);
console.log('MONGO_URL', process.env.MONGO_URL);
console.log('PORT', process.env.PORT);
console.log('KEY_JWT', process.env.KEY_JWT);

const Hapi = require('hapi');

// instalamos o CORS para liberar acessos a uso externo
// npm i --save hapi-cors
const Jwt = require('jsonwebtoken');

// instalamos o JOI para validar todos os nossos requests
// npm i --save joi
const Joi = require('joi');

// instalamos o BOOM para manipular erros de HTTP Status
// npm i --save boom
const Boom = require('boom');

// const KEY = process.env.KEY_JWT;
const KEY = 'MINHA_SENHA';

const USUARIO_VALIDO = {
  email: 'xuxadasilva@xuxa.org',
  senha: 1234,
};

const app = new Hapi.Server();
// app.connection({ port: process.env.PORT });
app.connection({ port: 3000 });
/*
// criamos uma estratégia de autenticação
app.auth.strategy('jwt', 'jwt', {
  key: KEY,
  // antes de qualquer requisição esse método é
  // chamado para validar seu token
  validateFunc: (tokenDescriptografado, request, callback) => {
    // aqui podemos fazer validações customizadas
    return callback(null, true);
  },
  verifyOptions: { algorithms: ['HS256'] },
});

app.auth.default('jwt');
*/
module.exports = app;
