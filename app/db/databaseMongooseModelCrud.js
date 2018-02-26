// Para trabalhar com modelo validados vamos usar o ODM (Object Data Modeling) Mongoose
// validar nossos objetos e criar modelso para esses objetos
// para instalar o mongoose
// npm i --save mongoose

// para colocar um whatcher -> qualquer alteração
// no codigo, ao Ctrl+S
// ele reinicia a apicacao
// passamos o -g pois é uma lib global
// npm i -g nodemon
// nodemon nomeDoArquivo.js
const Mongoose = require('mongoose');
Mongoose.connect(process.env.MONGO_URL);

// para guardar a isntancia usaos a connection
// para entender quando o banco é conectado
const connection = Mongoose.connection;

connection.once('open', () => console.log('Base de dados, conectada MANOWWWWW'));
connection.once('error', () => console.error('Não foi possível conectar, VISHHHH'));

// importamos o carroModel
// const carroModel = require('./model/CarroModel');
// const model = carroModel.getModel();

// exportar apenas funções especificas
const { getModel } = require('./model/CarroModel');
const model = getModel();

class Database {
    // retiramos os async/await par ao cara que invocou 
    // resolva o promise por boa pratica, resolvemos a promise
    // somente quando necessario
    /*static async cadastrar(carro) {
        const item = new model(carro);
        const resultado = await item.save();
        return resultado;
    }*/

    static cadastrar(carro) {
        // o metodo save, caso o model possuir um _id, ele fará o update
        // para somente inserir
        // model.create(carro)
        const item = new model(carro);
        const resultado = item.save();
        return resultado;
    }

    static obterPorId(_id) {
        console.log({ _id });
        const resultado = model.findOne({ _id }, { __v: 0 });
        return resultado;
    }

    static atualizar(id, carro) {
        const resultado = model.update(
            {
                _id: id
            }
            , {
                $set: carro
            });

        return resultado;
    }

    static remover(id) {
        const resultado = model.remove({ _id: id });
        return resultado;
    }

    static listar({ nome, ano }) {

        // const -> quando nao alteramos o valor de uma variavel
        // let -> quando precisamos alterar apos defini-la, nunca usar o 'var'
        let query = {};

        // caso o usuario nao definir o nome, nao atribui o valor
        // passamos o options ao regex para definir o case insensitive (ignora upper/lower)
        // esse regex é um contains
        if (nome) {
            query = {
                $or: [
                    { nome: { $regex: `.*${nome}.*`, $options: 'i' } },
                    { ano }
                ]
            }
        }

        const resultado = model.find(query, { __v: 0 });
        return resultado;
    }

    static listar({ nome, skip, limit }) {

        // const -> quando nao alteramos o valor de uma variavel
        // let -> quando precisamos alterar apos defini-la, nunca usar o 'var'
        let query = {};

        // caso o usuario nao definir o nome, nao atribui o valor
        // passamos o options ao regex para definir o case insensitive (ignora upper/lower)
        // esse regex é um contains
        if (nome) {
            query = {
                $or: [
                    { nome: { $regex: `.*${nome}.*`, $options: 'i' } }
                ]
            }
        }

        const resultado = model.find(query, { __v: 0 })
            .skip(skip)
            .limit(limit);
        return resultado;
    }

    static somaDosAnos() {
        // o aggregate funciona como um PIPELINE
        // executa passos a cada passo, reaproveita o valor
        // resultante do passo anterior
        /*
            db.carros.aggregate([
                {
                    $group: {
                        _id: '$ano',
                        total: { $sum: 1 }
                    }
                }
            ]).pretty();

            db.carros.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$ano' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        total: 1
                    }
                }
            ]).pretty();
        */

        // O aggregate tem uma serie de operadores
        // trabalhamos com o group que é similar ao GroupBy do SQL
        const resultado = model.aggregate([
            {
                /*$group: {
                    // informamos qual é o campo que deve ser agrupado
                    _id: '$ano',
                    // para cada registro daquele ano, somamos sua quantidade por 1
                    total: { $sum: 1 }
                }*/

                $group: {
                    // informamos qual é o campo que deve ser agrupado
                    _id: null,
                    // para cada registro daquele ano, somamos sua quantidade por 1
                    total: { $sum: '$ano' }
                }
            },
            // baseado no resultado do group, mostramos somente os dados
            // desejados
            {
                $project: {
                    _id: 0,
                    total: 1
                }
            }
        ]);

        return resultado;
    }

    static quantidadePorAno() {
        const resultado = model.aggregate([
            {
                $group: {
                    // informamos qual é o campo que deve ser agrupado
                    _id: '$ano',
                    // para cada registro daquele ano, somamos sua quantidade por 1
                    total: { $sum: 1 }
                }
            },
            {
                $project: {
                    ano: '$_id',
                    _id: 0,
                    total: 1
                }
            }
        ]);

        return resultado;
    }
}


module.exports = Database;