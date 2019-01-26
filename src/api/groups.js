const express = require('express');
const [addUserToGroup, createGroup] = require('../controller/groups');

const logger = require('../logger');


const apiGroups = express.Router();

const apiGroupsProtected = express.Router();

apiGroupsProtected.post('/', (req, res) => {
  logger.debug('POST GROUP');
  return !req.body.description || !req.body.title
    ? res.status(400).send({
      success: false,
      message: 'description and title are required'
    })
    : createGroup(req.body, req.user)
    .then(group => res.status(200).send(group))
});

apiGroupsProtected.put('/user', ({body}, res) => {
  logger.debug('PUT GROUP');
  logger.debug(body);
  return !body.userId || !body.groupId
    ? res.status(400).send({
      success: false,
      message: 'userId and groupId are required'
    })
    : addUserToGroup(body.userId, body.groupId)
      .then(() => res.status(204))
});

apiGroupsProtected.delete('/', (req, res) => {
  !req.body.email
    ? res.status(400).send({
      success: false,
      message: 'impossible to delete'
    })
    : res.status(200).send(`I'll have to delete that`)
});

apiGroupsProtected.get('/', (req, res) => {
  !req.body.email
    ? res.status(400).send({
      success: false,
      message: 'getting everything'
    })
    : res.status(200).send(`I'll have to delete that`)
});

module.exports = {apiGroups, apiGroupsProtected};
