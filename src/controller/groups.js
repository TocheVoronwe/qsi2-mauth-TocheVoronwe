const {Groups} = require('../model');

const addUserToGroup = (groupId, ownerId, userId) =>
  Groups.findOne({
    where: {
      id: groupId,
      owner_id: ownerId
    }
  }).then(group => group.addUsers(userId)
    .then(() => Promise.resolve(`User ${userId} succesfully added`)))
    .catch((error) => Promise.reject(new Error(`User ${userId} couldn't be deleted ${error}`)));

const createGroup = ({title, description}, user) =>
  Groups.create({
    title,
    description,
    owner_id: user.id,
    members: [
      {UserId: user.id}
    ]
  }).then(group =>
    group.get()
  );

const deleteMemberFromGroup = (groupId, ownerId, userId) =>
  Groups.findOne({
    where: {
      group_id: groupId,
      owner_id: ownerId,
    }
  }).then(group =>
    !group
      ? Promise.reject(new Error(`Group is null`))
      : group.removeUsers(userId))
    .then(() => Promise.resolve(`User ${userId} deleted`))
    .catch(() => Promise.reject(new Error(`User ${userId} couldn't be deleted`)));

const getGroups = () => Groups.findAll();

const getGroupsByOwner = (ownerId) =>
  Groups.findAll({
    where: {owner_id: ownerId}
  }).then(group => group);

module.exports = [
  addUserToGroup,
  createGroup,
  deleteMemberFromGroup,
  getGroups,
  getGroupsByOwner,
];