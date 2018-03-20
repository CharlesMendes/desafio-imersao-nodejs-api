const app = require('./v1/config/authorization');
const HapiCors = require('hapi-cors');
const HapiJwt = require('hapi-auth-jwt2');

(async () => {
  try {
    await app.register({
      register: HapiCors,
      options: {
        origins: ['*'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      },
    });

    // registramos o json web token
    await app.register(HapiJwt);

    // Modulo User: adicionar as rotas
    const ModuleUser = require('./v1/modules/user/user.route');

    // inicializamos nossa API
    await app.start();

    console.log('Servidor rodando...MANOWWWWW', process.env.PORT);
  } catch (error) {
    console.error(error);
    //logError(req, error);
  }
})();
