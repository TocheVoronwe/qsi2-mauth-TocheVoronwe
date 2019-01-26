const {Groups} = require('../model');
const logger = require('../logger');

const addUserToGroup = (userId, groupId) => {
  logger.debug('addUserToGroup');
  return Groups.addMember({
      userId,
      where: {
        groupId
      }
    })
    .then(group => group.get());
};

const createGroup = ({title, description}, user) => {
  logger.info('|||||||||CREATE GROUP|||||||||||');
  logger.debug(user);
  logger.debug(title);
  logger.debug(description);
  logger.debug(user);
  logger.info('||||||||||||||||||||||');
  return Groups.create({
    title,
    description,
    owner_id: user.id
  }).then(group => group.get());
};

const getGroups = ({user, all}) =>
  all
    ? Groups.findAll()
    : Groups.findAll({
      where: {
        owner: user.id
      }
    });

module.exports = [
  addUserToGroup,
  createGroup,
  getGroups,
];