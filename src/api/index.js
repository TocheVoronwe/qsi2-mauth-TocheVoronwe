const express = require('express');
const cors = require('cors');
const hpp = require('hpp');
const helmet = require('helmet');
const enforce = require('express-sslify');
const { apiUsers, apiUsersProtected } = require('./users');
const { apiGroups, apiGroupsProtected } = require('./groups');
const { isAuthenticated, initAuth } = require('../controller/auth');
// create an express Application for our api
const api = express();
initAuth();

// apply a middelware to parse application/json body
api.use(express.json({ limit: '1mb' }));
api.use(cors());
api.use(hpp());
api.use(helmet());
api.use(enforce.HTTPS({trustProtoHeader: true}));
// create an express router that will be mount at the root of the api
const apiRoutes = express.Router();
apiRoutes
// test api
  .get('/', (req, res) =>
    res.status(200).send({ message: 'hello from my api' })
  )
  // connect api users router
  .use('/users', apiUsers)
  // api bellow this middelware require Authorization
  .use(isAuthenticated)
  .use('/users', apiUsersProtected)
  .use((err, req, res, next) => {
    res.status(403).send({
      success: false,
      message: `${err.name} : ${err.message}`,
    });
    next();
  })
  .use('groups', apiGroups)
  .use(isAuthenticated)
  .use('/groups', apiGroupsProtected)
  .use((err, req, res, next) => {
    res.status(403).send({
      success: false,
      message: `${err.name} : ${err.message}`,
    });
    next();
  })
;

// root of our API will be http://localhost:8080/api/v1
api.use('/api/v1', apiRoutes);
module.exports = api;