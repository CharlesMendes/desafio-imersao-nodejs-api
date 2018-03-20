const HapiSwagger = require('hapi-swagger');
const Vision = require('vision');
const Inert = require('inert');

// registramos o swagger
await app.register([
    Inert,
    Vision,
    {
        register: HapiSwagger,
        options: {
            info: { version: "v1.0", title: "API de Carros" },
            documentationPath: "/docs"
        }

    }
]);
