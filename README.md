# desafio-imersao-nodejs-api

Desafio proposto pelo treinamento Imersão Node.js - API

## Passo a passo para construção:
### Clonar o repositório do Git
$ git clone https://github.com/CharlesMendes/desafio-imersao-nodejs-api

### Inicializar um novo projeto node
npm init -y

## Pacotes:
### Hapi para manipular rotas e construção da REST
npm i --save hapi@15

### Autenticação e padrão para controle de seus tokens, considerando a validação dos tokens nas rotas e descriptografia
npm i --save hapi-auth-jwt2 jsonwebtoken

### Rotas dinâmicas organizadas em arquivos
npm i --save hapi-router@3.5.0

### CORS para liberar acessos a uso externo
npm i --save hapi-cors

### Documentação de nossas APIs junto com o front end de consulta
npm i --save inert@4 vision@4 hapi-swagger@7

### Adicionar nossas variáveis customizadas ao ambiente
npm i --save dotenv

### Gerenciamento de Logs
npm i --save winston

### JOI para validar todos os nossos requests
npm i --save joi

### JOI extensão para formatar data
npm i --save joi-date-extensions

### BOOM para manipular erros de HTTP Status
npm i --save boom

### Criptografia
npm i --save bcrypt


