const omit = require('lodash.omit');
const {Users} = require('../model');
const logger = require('../logger');

const createUser = ({firstName, lastName, email, password}) =>
  Users.create({
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    hash: password
  }).then(user =>
    omit(
      user.get({
        plain: true
      }),
      Users.excludeAttributes
    )
  );

const loginUser = ({email, password}) =>
  Users.findOne({
    where: {
      email
    }
  }).then(user =>
    user && !user.deletedAt
      ? Promise.all([
        omit(
          user.get({
            plain: true
          }),
          Users.excludeAttributes
        ),
        user.comparePassword(password)
      ])
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  );

const getUser = ({id}) =>
  Users.findOne({
    where: {
      id
    }
  }).then(user =>
    user && !user.deletedAt
      ? omit(
      user.get({
        plain: true
      }),
      Users.excludeAttributes
      )
      : Promise.reject(new Error('UNKOWN OR DELETED USER')));

const updateUser = (id, user) => {
  logger.debug('updating user', user);
  return Users.update(
    user, {
      where: {
        id
      }
    })
    .catch((error) => {
      Promise.reject(new Error(`UNKOWN OR DELETED USER, IMPOSSIBLE TO UPDATE ${error}`));
    });
};

const deleteUser = (id) =>
  Users.update({
    deletedAt: Date.now()
  }, {
    where: {
      id
    }
  }).catch((error) => {
    Promise.reject(new Error(`UNKOWN OR DELETED USER, IMPOSSIBLE TO DELETE ${error}`));
  });

module.exports = {
  createUser,
  deleteUser,
  getUser,
  loginUser,
  updateUser,
};
