import * as _ from 'lodash';

import Cache from '../../cache';
import getLeetcodeDataFromUsername from '../__mocks__/utils.mock';
import MockDatabaseProvider from '../__mocks__/database.mock';
import { users, mockDatabaseData } from '../__mocks__/data.mock';
import dictionary from '../../utils/dictionary';
import constants from '../../utils/constants';
import { CacheResponse } from '../../cache/response.model';
import { User } from '../../leetcode/models';

Cache.database = new MockDatabaseProvider();
Cache.getLeetcodeDataFromUsername = getLeetcodeDataFromUsername;
Cache.delayTime = 0;
const mockUser1: User = users[0];

beforeEach(async () => {
  await Cache.clearUsers();
});

afterEach(async () => {
  Cache.users.length = 0;
});

test('cache.index.Cache.allUsers method', () => {
  // Expect default Cache.users to be array
  expect(Array.isArray(Cache.users)).toBe(true);
  expect(Array.isArray(Cache.allUsers())).toBe(true);
});

test('cache.index.Cache.userAmount property', async () => {
  // User amount is 0 by default
  expect(Cache.userAmount).toBe(0);

  // Add 1st User
  const realUsername = 'random_username';
  const resultSuccess: CacheResponse = await Cache.addUser(realUsername);
  expect(resultSuccess.status).toBe(constants.STATUS.SUCCESS);
  expect(resultSuccess.detail).toBe(dictionary.BOT_MESSAGES.USERNAME_WAS_ADDED(
    realUsername, Cache.userAmount, Cache.userLimit,
  ));
  expect(Cache.userAmount).toBe(1);

  // Add 2nd User
  const realUsername2 = 'random_username_2';
  const resultSuccess2: CacheResponse = await Cache.addUser(realUsername2);
  expect(Cache.userAmount).toBe(2);
  expect(resultSuccess2.status).toBe(constants.STATUS.SUCCESS);
  expect(resultSuccess2.detail).toBe(dictionary.BOT_MESSAGES.USERNAME_WAS_ADDED(
    realUsername2, Cache.userAmount, Cache.userLimit,
  ));

  // Clear Users
  await Cache.clearUsers();
  expect(Cache.userAmount).toBe(0);
});

test('cache.index.Cache.addOrReplaceUserInCache method', async () => {
  // Add User
  await Cache.addUser('random_username');

  // Check if User Data is correct
  const firstUserData: User = Cache.users[0];
  expect(firstUserData.name).toBe('Random User Name');
  expect(firstUserData.solved).toBe(124);
  expect(firstUserData.all).toBe(1700);
  expect(firstUserData.profile.userAvatar)
    .toBe('https://example.com/random_link');
  expect(firstUserData.submissions.length).toBe(2);

  // Replace 1st User with 2nd User and compare data
  const secondUserDataBefore: User = (
    await getLeetcodeDataFromUsername('random_username_2')
  );
  Cache.addOrReplaceUserInCache('random_username', secondUserDataBefore);
  const secondUserData: User = Cache.users[0];
  expect(JSON.stringify(secondUserDataBefore))
    .toBe(JSON.stringify(secondUserData));
  expect(Cache.userAmount).toBe(1);

  // Replace non-existing User with 1st User (Add)
  const firstUserReaddedBefore: User = (
    await getLeetcodeDataFromUsername('random_username')
  );
  Cache.addOrReplaceUserInCache('unexisting_username', firstUserReaddedBefore);
  const firstUserReaddedAfter: User = Cache.users[1];
  expect(JSON.stringify(firstUserReaddedBefore))
    .toBe(JSON.stringify(firstUserReaddedAfter));
  expect(Cache.userAmount).toBe(2);
});

test('cache.index.Cache.refreshUsers method', async () => {
  // Save original array
  const usersClone: User[] = _.cloneDeep(users);

  // Adding in this order, because they will be sorted by solved count
  await Cache.addUser('random_username_2');
  await Cache.addUser('random_username');

  // Change values in LeetCode Mock, refresh and check
  users[0].name = 'New Name 1';
  users[1].name = 'New Name 2';
  await Cache.refreshUsers();
  expect(Cache.users[0].name).toBe('New Name 2');
  expect(Cache.users[1].name).toBe('New Name 1');

  // Clear array and bring back original array
  users.length = 0;
  usersClone.forEach((user: User) => users.push(user));

  // Check refreshing case
  Cache.database.isRefreshing = true;
  const result: CacheResponse = await Cache.refreshUsers();
  expect(result.status).toBe(constants.STATUS.ERROR);
  expect(result.detail).toBe(dictionary.BOT_MESSAGES.IS_ALREADY_REFRESHING);
  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith(
    dictionary.SERVER_MESSAGES.IS_ALREADY_REFRESHING,
  );
  Cache.database.isRefreshing = false;

  // Check case, where User is deleted from LeetCode
  const fakeUsername = 'non_existing_username';
  mockDatabaseData.users = [fakeUsername];
  await Cache.refreshUsers();
  // eslint-disable-next-line no-console
  expect(console.log).toHaveBeenCalledWith(
    dictionary.SERVER_MESSAGES.USERNAME_WAS_NOT_REFRESHED(fakeUsername),
  );
});

test('cache.index.Cache.sortUsers method', async () => {
  const unsortedUsers: Record<string, string | number>[] = [
    {
      username: 'user_1',
      solved: 123,
    },
    {
      username: 'user_2',
      solved: 0,
    },
    {
      username: 'user_3',
      solved: 23,
    },
    {
      username: 'user_4',
      solved: 1452,
    },
    {
      username: 'user_5',
      solved: 700,
    },
    {
      username: 'user_6',
      solved: 0,
    },
    {
      username: 'user_7',
      solved: undefined,
    },
    {
      username: 'user_8',
      solved: undefined,
    },
  ];

  const sortedUsers: Record<string, string | number>[] = [
    {
      username: 'user_4',
      solved: 1452,
    },
    {
      username: 'user_5',
      solved: 700,
    },
    {
      username: 'user_1',
      solved: 123,
    },
    {
      username: 'user_3',
      solved: 23,
    },
    {
      username: 'user_2',
      solved: 0,
    },
    {
      username: 'user_6',
      solved: 0,
    },
    {
      username: 'user_7',
      solved: undefined,
    },
    {
      username: 'user_8',
      solved: undefined,
    },
  ];

  const sortedUsersModified: User[] = (
    sortedUsers.map((user) => ({ ...mockUser1, ...user }))
  );
  unsortedUsers.forEach((user) => Cache.users.push({ ...mockUser1, ...user }));

  Cache.sortUsers();

  expect(_.isEqual(Cache.users, sortedUsersModified)).toBe(true);
});

test('cache.index.Cache.addUser method', async () => {
  // Add 1st User
  const realUsername = 'random_username';
  const resultSuccess: CacheResponse = await Cache.addUser(realUsername);
  expect(resultSuccess.status).toBe(constants.STATUS.SUCCESS);
  expect(resultSuccess.detail).toBe(dictionary.BOT_MESSAGES.USERNAME_WAS_ADDED(
    realUsername, Cache.userAmount, Cache.userLimit,
  ));
  const firstUserData: User = Cache.users[0];
  expect(firstUserData.name).toBe('Random User Name');
  expect(firstUserData.solved).toBe(124);
  expect(firstUserData.all).toBe(1700);
  expect(firstUserData.profile.userAvatar)
    .toBe('https://example.com/random_link');
  expect(firstUserData.submissions.length).toBe(2);
  const firstUserDataDirect: User = (
    await getLeetcodeDataFromUsername('random_username')
  );
  expect(_.isEqual(firstUserData, firstUserDataDirect)).toBe(true);

  // Test User Limit
  const userLimit = 1;
  Cache.userLimit = userLimit;
  const secondUsername = 'random_username_2';
  const resultFailUserLimit: CacheResponse = (
    await Cache.addUser(secondUsername)
  );
  expect(resultFailUserLimit.status).toBe(constants.STATUS.ERROR);
  expect(resultFailUserLimit.detail).toBe(
    dictionary.BOT_MESSAGES.USERNAME_NOT_ADDED_USER_LIMIT(
      secondUsername, userLimit,
    ),
  );
  Cache.userLimit = 30;

  // Test Remove User if not exist in LeetCode
  const fakeUsername = 'not_existing_username';
  const resultFailNotExists: CacheResponse = await Cache.addUser(fakeUsername);
  expect(resultFailNotExists.status).toBe(constants.STATUS.ERROR);
  expect(resultFailNotExists.detail).toBe(
    dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND_ON_LEETCODE(fakeUsername),
  );

  // Test Username already exists
  const resultFailAlreadyExists: CacheResponse = (
    await Cache.addUser(realUsername)
  );
  expect(resultFailAlreadyExists.status).toBe(constants.STATUS.ERROR);
  expect(resultFailAlreadyExists.detail).toBe(
    dictionary.BOT_MESSAGES.USERNAME_ALREADY_EXISTS(realUsername),
  );
});

test('cache.index.Cache.removeUser method', async () => {
  // Add 2 Users
  await Cache.addUser('random_username');
  await Cache.addUser('random_username_2');
  expect(Cache.userAmount).toBe(2);

  // Remove existing User
  const realUsername = 'random_username';
  const result: CacheResponse = await Cache.removeUser(realUsername);
  expect(Cache.userAmount).toBe(1);
  expect(result.status).toBe(constants.STATUS.SUCCESS);
  expect(result.detail).toBe(
    dictionary.BOT_MESSAGES.USERNAME_WAS_DELETED(realUsername),
  );

  // Check remaining User
  const userLeft: User = Cache.users[0];
  expect(userLeft.name).toBe('Random User Name 2');

  // Remove unexisting User
  const fakeUsername = 'not_existing_user';
  const resultFail: CacheResponse = await Cache.removeUser(fakeUsername);
  expect(resultFail.status).toBe(constants.STATUS.ERROR);
  expect(resultFail.detail).toBe(
    dictionary.BOT_MESSAGES.USERNAME_NOT_FOUND(fakeUsername),
  );
});

test('cache.index.Cache.clearUsers method', async () => {
  // Add 2 Users
  await Cache.addUser('random_username');
  await Cache.addUser('random_username_2');
  expect(Cache.userAmount).toBe(2);

  // Clear Users
  const resultSuccess: CacheResponse = await Cache.clearUsers();
  expect(resultSuccess.status).toBe(constants.STATUS.SUCCESS);
  expect(resultSuccess.detail).toBe(
    dictionary.BOT_MESSAGES.DATABASE_WAS_CLEARED,
  );
  expect(Cache.userAmount).toBe(0);

  // Check case, where clearing Users fails
  mockDatabaseData.fakeResult = false;
  const resultFail: CacheResponse = await Cache.clearUsers();
  expect(resultFail.status).toBe(constants.STATUS.ERROR);
  expect(resultFail.detail).toBe(
    dictionary.BOT_MESSAGES.DATABASE_WAS_NOT_CLEARED,
  );
});

test('cache.index.Cache.loadUser method', async () => {
  // Add 2 Users
  await Cache.addUser('random_username');
  await Cache.addUser('random_username_2');

  // Check if loadUser returns correct data
  const userData: User = await getLeetcodeDataFromUsername('random_username');
  const cachedUserData: User = Cache.loadUser('random_username');
  expect(_.isEqual(userData, cachedUserData)).toBe(true);

  // Shouldn't be able to remove unexisting User
  expect(_.isEmpty(Cache.loadUser('not_existing_user'))).toBe(true);

  // Shouldn't be able to remove already removed User
  await Cache.removeUser('random_username');
  expect(_.isEmpty(Cache.loadUser('random_username'))).toBe(true);
});
