const express = require('express');
const translationController = require('../controllers/translationController');
require('isomorphic-fetch');

const translationRoute = express.Router();

translationRoute.get('/test', (req, res) => {console.log('************************************test************************************')});
translationRoute.post('/translate', translationController.translate);
translationRoute.post('/recognize', translationController.recognize);
// translationRoute.get('/speak', translationController.speak);

module.exports = translationRoute;