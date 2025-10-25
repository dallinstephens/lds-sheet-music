const router = require('express').Router();

// References for Swagger API Documentation:
// https://www.npmjs.com/package/swagger-autogen?activeTab=readme#documentation
// https://swagger-autogen.github.io/docs/getting-started/quick-start
// https://www.npmjs.com/package/swagger-ui-express
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;