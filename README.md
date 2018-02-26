# desafio-imersao-nodejs-api

Desafio proposto pelo treinamento Imersão Node.js - API

## Clonar o repositório do Git

$ git clone https://github.com/CharlesMendes/desafio-imersao-nodejs-api

## Criar as pastas para organização do código:

|-- app\								// folder root for application api
|   |-- api.js 							// link all objects *.route.js and swagger docs api
|   |-- logs\							// files logs application with version api
|   |   |-- v1\							// logs aggregate for version v1
|   |   |   |-- debug.log				// debug logs for business
|   |   |   |-- error.log				// erros logs for business
|   |-- v1\								// modules aggregate for version v1
|   |   |-- config\						// config general objects
|   |   |   |-- .env.dev				// config environment variables for development
|   |   |   |-- .env.prod				// config environment variables for production
|   |   |   |-- authorization.js		// config for administration: cors, jwt and tokens 
|   |   |   |-- documentation.js		// config documentation api with swagger
|   |   |   |-- logs.js					// config logs files with winstonjs
|   |   |-- db\							// connection with database use Mongoose
|   |   |   |-- database.js				// data connection with database MongoDB use Mongoose
|   |   |-- modules\					// separeted module by business
|   |   |   |-- user\					// separeted module user
|   |   |   |   |-- user.db.js			// a datasource defines other places a model can pull info from, OTHER than the db
|   |   |   |   |-- user.route.js		// define all routes availables, with version api and boom
|   |   |   |   |-- user.model.js		// class model specific, is something you can plug into any model. like user, company or employee
|   |   |   |   |-- user.entity.js		// define all routes availables, with version api
|   |   |   |   |-- user.spec.js		// spec bdd use mochajs
|   |   |   |-- company\				// separeted module company
|   |   |   |   |-- company.db.js		// a datasource defines other places a model can pull info from, OTHER than the db
|   |   |   |   |-- company.route.js	// define all routes availables, with version api and boom
|   |   |   |   |-- company.model.js	// class model specific, is something you can plug into any model. like user, company or employee
|   |   |   |   |-- company.entity.js	// define all routes availables, with version api
|   |   |   |   |-- company.spec.js		// spec bdd use mochajs
|   |   |   |-- employee\				// separeted module employee
|   |   |   |   |-- employee.db.js		// a datasource defines other places a model can pull info from, OTHER than the db
|   |   |   |   |-- employee.route.js	// define all routes availables, with version api and boom
|   |   |   |   |-- employee.model.js	// class model specific, is something you can plug into any model. like user, company or employee
|   |   |   |   |-- employee.entity.js	// define business logic and access employye.db.js 
|   |   |   |   |-- employee.spec.js	// spec bdd use mochajs
|-- docs\								// documentation general api
|-- node_modules\						// npm modules, duh
