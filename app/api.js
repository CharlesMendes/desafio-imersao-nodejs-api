const Hapi = require('hapi');
const HapiCors = require('hapi-cors');
const HapiJwt = require('hapi-auth-jwt2');
const HapiRouter = require('hapi-router');
const HapiSwagger = require('hapi-swagger');
const Jwt = require('jsonwebtoken');
const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);
const Boom = require('boom');
const Vision = require('vision');
const Inert = require('inert');
const Winston = require('winston');
const Bcrypt = require('bcrypt');

var logger = new Winston.Logger({
  transports: [
    new Winston.transports.File({
      name: 'info-file',
      filename: 'logs/debug.log',
      level: 'info',
    }),
    new Winston.transports.File({
      name: 'error-file',
      filename: 'logs/error.log',
      level: 'error',
    }),
  ],
});

const logInfo = req =>
  logger.info(
    `method: ${req.method}, path: ${req.path}, origem: ${
      req.info.remoteAddress
    }`,
  );

const logError = (req, error) =>
  logger.error(
    `method: ${req.method}, path: ${req.path}, origem: ${
      req.info.remoteAddress
    }, mensagem: ${error}`,
  );

// importamos o dotenv
const { config } = require('dotenv');
if (process.env.NODE_ENV === 'production')
  config({ path: './config/.env.prod' });
else config({ path: './config/.env.dev' });

console.log('MONGO_URL', process.env.MONGO_URL);

const UserEntity = require('./modules/user/user.entity');
const CompanyEntity = require('./modules/company/company.entity');

const KEY = process.env.KEY_JWT;
const KEY_CRYPTO = Number(process.env.KEY_CRYPT);

(async () => {
  try {
    const Bcrypt = require('bcrypt');
    const UserDB = require('./modules/user/user.db');
    const CompanyDB = require('./modules/company/company.db');

    const app = new Hapi.Server();
    app.connection({ port: process.env.PORT });

    await app.register({
      register: HapiCors,
      options: {
        origins: ['*'],
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      },
    });

    // registramos o swagger
    await app.register([
      Inert,
      Vision,
      {
        register: HapiSwagger,
        options: {
          info: {
            version: 'v1.0',
            title: 'API do Desafio H4',
            description:
              'Documentação parte do projeto do desafio H4 do curso de Imersão NodeJS',
          },
          documentationPath: '/docs',
        },
      },
    ]);

    // registramos o json web token
    await app.register(HapiJwt);

    // criamos uma estratégia de autenticação
    app.auth.strategy('jwt', 'jwt', {
      key: KEY,
      //antes de qualquer requisição esse método é
      // chamado para validar seu token
      validateFunc: (tokenDescriptografado, request, callback) => {
        // aqui podemos fazer validações customizadas
        return callback(null, true);
      },
      verifyOptions: { algorithms: ['HS256'] },
    });

    app.auth.default('jwt');

    // try {
    //   // registramos as rotas
    //   await app.register({
    //     register: HapiRouter,
    //     options: {
    //       routes: 'modules/**/*.route.js', // uses glob to include files
    //     },
    //   });
    // } catch (error) {
    //   console.error('>>>>>>>>>>>>>>>>>>>>>>>');
    //   console.error(error);
    //   console.error('>>>>>>>>>>>>>>>>>>>>>>>');
    // }

    // definimos as rotas para a aplicação
    app.route([
      {
        method: 'POST',
        path: '/login',
        handler: async (req, reply) => {
          logInfo(req);

          const { payload } = req;
          const user = new UserEntity(payload);
          const result = await UserDB.login(user);

          if (result.length == 0) {
            return reply(Boom.unauthorized());
          } else {
            // verifica se a senha esta correta (criptografada)
            if (Bcrypt.compareSync(user.password, result[0].password)) {
              // geramos um token de acesso, para o usuário logado com o tempo de expiração 12horas
              const token = Jwt.sign({ usuario: result[0].email }, KEY, {
                expiresIn: '12h',
              });

              return reply({ token });
            } else {
              return reply(Boom.unauthorized());
            }
          }
        },
        config: {
          auth: false, //desativamos a autenticação para esse método
          notes: 'Login',
          description: 'Autenticação do usuário',
          tags: ['api'],
          validate: {
            payload: {
              email: Joi.string()
                .email()
                .required()
                .default('charles.mendes@gmail.com'),
              password: Joi.string()
                .max(20)
                .required(),
            },
          },
        },
      },

      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      // User - Rotas
      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      {
        method: 'GET',
        path: '/user',
        handler: async (req, reply) => {
          try {
            logInfo(req);

            const { query } = req;
            const { skip, limit } = query;

            const result = await UserDB.list({ skip, limit });
            return reply(result);
          } catch (error) {
            logError(req, error);
            return reply(Boom.badRequest(error));
          }
        },
        config: {
          notes: 'Listar todos os usuários cadastrados',
          description: 'Retorna os usuários localizados',
          tags: ['api'],
          validate: {
            headers: Joi.object({
              authorization: Joi.string().required(),
            }).unknown(),
            query: {
              limit: Joi.number()
                .max(100)
                .default(10),
              skip: Joi.number().default(0),
            },
          },
        },
      },
      {
        method: 'POST',
        path: '/user',
        handler: async (req, reply) => {
          try {
            logInfo(req);

            const { payload } = req;
            const user = new UserEntity(payload);
            let hash = Bcrypt.hashSync(user.password, KEY_CRYPTO);
            user.password = hash;

            const result = await UserDB.create(user);

            return reply(result);
          } catch (error) {
            logError(req, error);
            return reply(Boom.badRequest(error));
          }
        },
        config: {
          notes: 'Cadastrar Usuário',
          description: 'Criar um novo usuário',
          tags: ['api'],
          validate: {
            headers: Joi.object({
              authorization: Joi.string().required(),
            }).unknown(),
            payload: {
              email: Joi.string()
                .email()
                .required()
                .default('charles.mendes@gmail.com'),
              password: Joi.string()
                .max(20)
                .required(),
            },
          },
        },
      },
      {
        method: 'PATCH',
        path: '/user/{id}',
        handler: async (req, reply) => {
          try {
            logInfo(req);
            const { id } = req.params;
            const { payload } = req;
            let hash = Bcrypt.hashSync(payload.password, KEY_CRYPTO);
            payload.password = hash;

            const user = new UserEntity(payload);

            // removemos as propriedades que estiverem
            // com null, caso o usuario nao as envie nao cadastramos
            Object.keys(user).map(key => {
              if (user[key]) return key;
              delete user[key];
            });

            const result = await UserDB.update(id, user);

            return reply(result);
          } catch (error) {
            logError(req, error);
            return reply(Boom.badRequest(error));
          }
        },
        config: {
          notes: 'Atualizar um usuário',
          description: 'Atualizar um usuário existente',
          tags: ['api'],
          validate: {
            headers: Joi.object({
              authorization: Joi.string().required(),
            }).unknown(),
            params: {
              id: Joi.string(),
            },
            payload: {
              email: Joi.string()
                .email()
                .required()
                .default('charles.mendes@gmail.com'),
              password: Joi.string()
                .max(20)
                .required(),
            },
          },
        },
      },
      {
        method: 'DELETE',
        path: '/user/{id}',
        handler: async (req, reply) => {
          try {
            logInfo(req);
            const { id } = req.params;
            const result = await UserDB.delete(id);

            return reply(result);
          } catch (error) {
            return reply(Boom.badRequest(error));
          }
        },
        config: {
          notes: 'Remover um usuário',
          description: 'Remove um usuário existente',
          tags: ['api'],
          validate: {
            headers: Joi.object({
              authorization: Joi.string().required(),
            }).unknown(),
            params: {
              id: Joi.string(),
            },
          },
        },
      },
      {
        method: 'GET',
        path: '/user/{id}',
        handler: async (req, reply) => {
          try {
            logInfo(req);
            const { id } = req.params;
            const result = UserDB.getById(id);

            return reply(result);
          } catch (error) {
            logError(req, error);
            return reply(Boom.badRequest(error));
          }
        },
        config: {
          notes: 'Buscar usuário por id',
          description: 'Detalhes de um usuário existente',
          tags: ['api'],
          validate: {
            headers: Joi.object({
              authorization: Joi.string().required(),
            }).unknown(),
            params: {
              id: Joi.string(),
            },
          },
        },
      },

      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      // Company - Rotas
      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      {
        method: 'GET',
        path: '/company',
        handler: async (req, reply) => {
          try {
            logInfo(req);

            const { query } = req;
            const { skip, limit } = query;

            const result = await CompanyDB.list({ skip, limit });
            return reply(result);
          } catch (error) {
            logError(req, error);
            return reply(Boom.badRequest(error));
          }
        },
        config: {
          notes: 'Listar todas as empresas cadastradas',
          description: 'Retorna as empresas localizadas',
          tags: ['api'],
          validate: {
            headers: Joi.object({
              authorization: Joi.string().required(),
            }).unknown(),
            query: {
              limit: Joi.number()
                .max(100)
                .default(10),
              skip: Joi.number().default(0),
            },
          },
        },
      },
      {
        method: 'POST',
        path: '/company',
        handler: async (req, reply) => {
          try {
            logInfo(req);

            const { payload } = req;
            const company = new CompanyEntity(payload);
            const result = await CompanyDB.create(company);

            return reply(result);
          } catch (error) {
            logError(req, error);
            return reply(Boom.badRequest(error));
          }
        },
        config: {
          notes: 'Cadastrar Empresa',
          description: 'Criar uma nova empresa',
          tags: ['api'],
          validate: {
            headers: Joi.object({
              authorization: Joi.string().required(),
            }).unknown(),
            payload: {
              name: Joi.string()
                .max(60)
                .required()
                .default('Dominando API Ltda.'),
              cnpj: Joi.string()
                .max(14)
                .required()
                .default('99999999999999'),
              employees: Joi.array().items(
                Joi.object({
                  name: Joi.string()
                    .max(60)
                    .required()
                    .default('Charles Mendes'),
                  age: Joi.number()
                    .required()
                    .default('32'),
                  birthdate: Joi.date()
                    .format('DD/MM/YYYY')
                    .iso()
                    .required()
                    .default('20/08/1985'),
                  office: Joi.string()
                    .max(15)
                    .required()
                    .default('ANALISTA'),
                  user: Joi.object({
                    email: Joi.string()
                      .required()
                      .email()
                      .default('charles.mendes@gmail.com'),
                  }),
                }),
              ),
            },
          },
        },
      },
      {
        method: 'PATCH',
        path: '/company/{id}',
        handler: async (req, reply) => {
          try {
            logInfo(req);
            const { id } = req.params;
            const { payload } = req;
            const company = new CompanyEntity(payload);

            // removemos as propriedades que estiverem
            // com null, caso o usuario nao as envie nao cadastramos
            Object.keys(company).map(key => {
              if (company[key]) return key;
              delete company[key];
            });

            const result = await CompanyDB.update(id, company);

            return reply(result);
          } catch (error) {
            logError(req, error);
            return reply(Boom.badRequest(error));
          }
        },
        config: {
          notes: 'Atualizar uma empresa',
          description: 'Atualizar uma empresa existente',
          tags: ['api'],
          validate: {
            headers: Joi.object({
              authorization: Joi.string().required(),
            }).unknown(),
            params: {
              id: Joi.string(),
            },
            payload: {
              name: Joi.string()
                .max(60)
                .required()
                .default('Dominando API Ltda.'),
              cnpj: Joi.string()
                .max(14)
                .required()
                .default('99999999999999'),
              employees: Joi.array().items(
                Joi.object({
                  name: Joi.string()
                    .max(60)
                    .required()
                    .default('Charles Mendes'),
                  age: Joi.number()
                    .required()
                    .default('32'),
                  birthdate: Joi.date()
                    .format('DD/MM/YYYY')
                    .iso()
                    .required()
                    .default('20/08/1985'),
                  office: Joi.string()
                    .max(15)
                    .required()
                    .default('ANALISTA'),
                  user: Joi.object({
                    email: Joi.string()
                      .required()
                      .email()
                      .default('charles.mendes@gmail.com'),
                  }),
                }),
              ),
            },
          },
        },
      },
      {
        method: 'DELETE',
        path: '/company/{id}',
        handler: async (req, reply) => {
          try {
            logInfo(req);
            const { id } = req.params;
            const result = await CompanyDB.delete(id);

            return reply(result);
          } catch (error) {
            return reply(Boom.badRequest(error));
          }
        },
        config: {
          notes: 'Remover uma empresa',
          description: 'Remove uma empresa existente',
          tags: ['api'],
          validate: {
            headers: Joi.object({
              authorization: Joi.string().required(),
            }).unknown(),
            params: {
              id: Joi.string(),
            },
          },
        },
      },
      {
        method: 'GET',
        path: '/company/{id}',
        handler: async (req, reply) => {
          try {
            logInfo(req);
            const { id } = req.params;
            const result = CompanyDB.getById(id);

            return reply(result);
          } catch (error) {
            logError(req, error);
            return reply(Boom.badRequest(error));
          }
        },
        config: {
          notes: 'Buscar empresa por id',
          description: 'Detalhes de uma empresa existente',
          tags: ['api'],
          validate: {
            headers: Joi.object({
              authorization: Joi.string().required(),
            }).unknown(),
            params: {
              id: Joi.string(),
            },
          },
        },
      },
      {
        method: 'GET',
        path: '/company/{id}/employees',
        handler: async (req, reply) => {
          try {
            logInfo(req);
            const { id } = req.params;
            const { office } = req.query;

            const result = CompanyDB.listEmployeesByOffice(id, office);

            return reply(result);
          } catch (error) {
            logError(req, error);
            return reply(Boom.badRequest(error));
          }
        },
        config: {
          notes: 'Pesquisar funcionários por cargo',
          description:
            'Pesquisa todos os funcionários de uma empresa por um determinado cargo',
          tags: ['api'],
          validate: {
            headers: Joi.object({
              authorization: Joi.string().required(),
            }).unknown(),
            params: {
              id: Joi.string(),
            },
            query: {
              office: Joi.string().required(),
            },
          },
        },
      },
      // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    ]);

    // inicializamos nossa API
    await app.start();

    console.log('Servidor rodando...MANOWWWWW', process.env.PORT);
  } catch (error) {
    logError(req, error);
  }
})();
