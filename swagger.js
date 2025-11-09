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
    host: 'lds-sheet-music.onrender.com',
    schemes: ['https'],
    basePath: ['/'],
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
        },
        Order: {
            customer_id: '68f44871b43746b12b968024',
            firstName: 'Dallin',
            lastName: 'Stephens',
            billingAddress: { $ref: '#/definitions/Address' },
            shippingAddress: { $ref: '#/definitions/Address' },
            items: [
                {
                    // Reference for item info: https://jackmanmusic.com/products/50-hymn-preludes-for-the-bass-coupler-organist-vol-2?_pos=1&_sid=891647fba&_ss=r&variant=31775358910582
                    sku: '01965',
                    title: '50 Hymn Preludes for the Base Coupler Organist Vol. 2',
                    qty: 1,
                    price: 16.95
                }
            ],
            subtotal: 16.95,
            shippingPrice: 6.35,
            totalPrice: 23.30,
            orderDate: '2025-11-08T17:00:00:00.000Z0'
        }
    }    
}

const outputFile = './swagger.json';

// It is called endpointsFiles because [] indicate an array of items even though
// in this case there is only one endpoints file which is routes/index.js.
// npm run swagger is needed after comments are added or changed to show up in /api-docs.
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);