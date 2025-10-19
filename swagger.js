// References on how to get started with creating swagger.js:
// https://www.npmjs.com/package/swagger-autogen?activeTab=readme#documentation
// https://swagger-autogen.github.io/docs/getting-started/quick-start
// https://www.npmjs.com/package/swagger-ui-express
const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'LDS Sheet Music API',
        description: 'This is a LDS Sheet Music API for CSE 341 that includes customers and orders.'
    },
    servers: [
        {
            url: 'https://lds-sheet-music.onrender.com',
            description: 'Render site'
        },
        {
            url: 'http://localhost:3000',
            description: 'Localhost'
        }
    ],
    definitions: {
        Address: {
            street: '123 Peach Ln',
            city: 'Bountiful',
            state: 'UT',
            zip: '84010',
            country: 'US'
        },
        Customer: {
            firstName: 'Dallin',
            lastName: 'Stephens',
            email: 'dallinstephens1@gmail.com',
            billingAddress: { $ref: '#/definitions/Address' },
            shippingAddress: { $ref: '#/definitions/Address' },
            phone: '801-123-4567'
        }
    }    
}

const outputFile = './swagger.json';

// It is called endpointsFiles because [] indicate an array of items even though
// in this case there is only one endpoints file which is routes/index.js.
// npm run swagger is needed after comments are added or changed to show up in /api-docs.
const endpointsFiles = ['./routes/customers.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);