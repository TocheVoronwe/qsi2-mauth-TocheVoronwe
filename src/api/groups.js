const express = require('express');
const [addUserToGroup, createGroup, deleteMemberFromGroup, getGroups, getGroupsByOwner] = require('../controller/groups');

const logger = require('../logger');


const apiGroups = express.Router();

const apiGroupsProtected = express.Router();

apiGroupsProtected.post('/', (req, res) =>
  !req.body.description || !req.body.title
    ? res.status(400).send({
      success: false,
      message: 'description and title are required'
    })
    : createGroup(req.body, req.user)
    .then(group => res.status(200).send(group))
    .catch(error => {
      logger.error(error);
      return res.status(500).send('Unable to create group');
    }));

apiGroupsProtected.put('/user', ({user, body}, res) =>
  !body.userId || !body.groupId
    ? res.status(400).send({
      success: false,
      message: 'userId and groupId are required'
    })
    : addUserToGroup(body.groupId, user.id, body.userId)
    .then(() => res.status(204).send(`${body.userId} added`))
    .catch(error => {
      logger.error(error);
      return res.status(500).send('Unable to put user in group');
    }));

apiGroupsProtected.delete('/user', ({user, body}, res) =>
  !body.userId || !body.groupId
    ? res.status(400).send({
      success: false,
      message: 'userId and groupId are required'
    })
    : deleteMemberFromGroup(body.groupId, user.id, body.userId)
    .then((success) => res.status(204).send(success))
    .catch(error => {
      logger.error(error);
      return res.status(500).send(error);
    }));

apiGroupsProtected.get('/', (req, res) =>
  getGroups().then(groups => res.status(200).send(groups))
    .catch((error) => {
      logger.error(error);
      return res.status(500).send('Unable to get groups');
    }));

apiGroupsProtected.get('/owner', ({user}, res) => {
  getGroupsByOwner(user.id).then(groups => res.status(200).send(groups))
    .catch(error => {
      logger.error(error);
      return res.status(500).send('Unable to get groups');
    });
});

module.exports = {apiGroups, apiGroupsProtected, getGroups};
