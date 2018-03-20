const Database = require('./user.db');
// const app = require('../../config/authorization');

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

// definimos as rotas para a aplicação
app.route([
  {
    method: 'POST',
    path: '/login',
    handler: (req, reply) => {
      logInfo(req);

      const { email, senha } = req.payload;

      if (
        USUARIO_VALIDO.email.toLowerCase() !== email.toLowerCase() ||
        USUARIO_VALIDO.senha !== senha
      )
        return reply(Boom.unauthorized());

      // geramos um token de acesso, para o usuário logado com o tempo de expiração 12horas
      const token = Jwt.sign({ usuario: email }, KEY, { expiresIn: '12h' });
      return reply({ token });
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
            .default('xuxadasilva@xuxa.org'),
          senha: Joi.number().required(),
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/carros',
    handler: async (req, reply) => {
      try {
        //throw new Error('TESTE');
        logInfo(req);

        const { query } = req;
        const { limit, skip, nome } = query;

        const resultado = await Database.listar({ nome, limit, skip });
        return reply(resultado);
      } catch (error) {
        logError(req, error);
        //console.error('DEU RUIM', error);
        //return reply('Erro interno manooooo').statusCode = 500;
        return reply(Boom.internal(error));
      }
    },
    config: {
      // adicionamos a configuração da autenticação (jwt)

      notes: 'Pesquisar Carro',
      description: 'Retorna os carros localizados',
      tags: ['api'],
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required(),
        }).unknown(),
        query: {
          nome: Joi.string()
            //.required()
            .min(2)
            .max(10),
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
    path: '/carros',
    handler: async (req, reply) => {
      try {
        logInfo(req);
        const { payload } = req;
        const carro = new Carro(payload);
        const resultado = await Database.cadastrar(carro);

        return reply(resultado);
      } catch (error) {
        logError(req, error);
        //console.error('DEU RUIM', error);
        return reply(Boom.internal(error));
      }
    },
    config: {
      notes: 'Cadastrar Carro',
      description: 'Criação de um novo carro',
      tags: ['api'],
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required(),
        }).unknown(),
        // validar as querystrings parametros na url
        // -> query

        // validar os parametros que vem no padrao
        // -> params
        // produtos/{id} = param

        // validar o corpo da requisição
        // payload

        // validar o token no header
        // headers

        payload: {
          ano: Joi.number().required(),
          nome: Joi.string()
            .min(2)
            .max(100)
            .required(),
          placa: Joi.string()
            .max(8)
            .required(),
        },
      },
    },
  },
  {
    method: 'PATCH',
    path: '/carros/{id}',
    handler: async (req, reply) => {
      try {
        logInfo(req);
        const { id } = req.params;
        const { payload } = req;
        const carro = new Carro(payload);

        // fizemos uma pequena gambiarra
        // removemos as propriedades que estiverem
        // com null, caso o usuario nao as envie nao cadastramos
        Object.keys(carro).map(key => {
          if (carro[key]) return key;
          delete carro[key];
        });

        const resultado = await Database.atualizar(id, carro);

        return reply(resultado);
      } catch (error) {
        logError(req, error);
        //console.error('DEU RUIM', error);
        return reply(Boom.internal(error));
      }
    },
    config: {
      notes: 'Atualizar Carro',
      description: 'Atualizar um carro carro existente',
      tags: ['api'],
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required(),
        }).unknown(),
        params: {
          id: Joi.string(),
        },
        payload: {
          ano: Joi.number(),
          nome: Joi.string()
            .min(2)
            .max(100),
          placa: Joi.string().max(8),
        },
      },
    },
  },
  {
    method: 'DELETE',
    path: '/carros/{id}',
    handler: async (req, reply) => {
      try {
        logInfo(req);
        const { id } = req.params;
        const resultado = await Database.remover(id);

        return reply(resultado);
      } catch (error) {
        console.error('DEU RUIM', error);
        return reply(Boom.internal(error));
      }
    },
    config: {
      notes: 'Remover um Carro',
      description: 'Remove um carro carro existente',
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
    path: '/carros/{id}',
    handler: async (req, reply) => {
      try {
        logInfo(req);
        const { id } = req.params;
        // por baixo dos panos, o Hapi resolve a promise
        // caso não precisar reutilizar o valor que veio da promise
        // não precisa passar o await
        //const resultado = await Database.obterPorId(id);
        const resultado = Database.obterPorId(id);

        return reply(resultado);
      } catch (error) {
        logError(req, error);
        //console.error('DEU RUIM', error);
        return reply(Boom.internal(error));
      }
    },
    config: {
      notes: 'Buscar carro por ID',
      description: 'Detalhes de um carro existente',
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
    path: '/carros/relatorios/somadosanos',
    handler: async (req, reply) => {
      try {
        logInfo(req);
        const [{ total }] = await Database.somaDosAnos();
        return reply({ total });
      } catch (error) {
        logError(req, error);
        //console.error('DEU RUIM', error);
        return reply(Boom.internal(error));
      }
    },
    config: {
      notes: 'Relatorio - Soma dos Anos',
      description: 'Retorna relatório de Soma dos Anos',
      tags: ['api'],
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required(),
        }).unknown(),
      },
    },
  },
  {
    method: 'GET',
    path: '/carros/relatorios/quantidadeporano',
    handler: async (req, reply) => {
      try {
        logInfo(req);
        const resultado = Database.quantidadePorAno();

        return reply(resultado);
      } catch (error) {
        //logError(req, error);
        console.error('DEU RUIM', error);
        return reply(Boom.internal(error));
      }
    },
    config: {
      notes: 'Relatorio - Quantidade por Ano',
      description: 'Retorna relatório de Quantidade por Ano',
      tags: ['api'],
      validate: {
        headers: Joi.object({
          authorization: Joi.string().required(),
        }).unknown(),
      },
    },
  },
]);
