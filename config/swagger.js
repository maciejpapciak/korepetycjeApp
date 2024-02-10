const { serve, setup } = require('swagger-ui-express');
const YAML = require('yamljs');
const express = require('express');

const swaggerDocs = YAML.load('./config/swagger.yaml');
const router = express.Router();

router.use('/', serve, setup(swaggerDocs));

module.exports = router;
