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
  return Groups.create({
    title,
    description,
    owner_id: user.id,
    members: [
      {UserId: user.id}
    ]
  }).then(group =>
    group.get()
  );
};

const getGroups = () =>
  Groups.findAll();

module.exports = [
  addUserToGroup,
  createGroup,
  getGroups,
];