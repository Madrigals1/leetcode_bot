/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
import { User } from '../../leetcode/models';
import DatabaseProvider from '../../database/database.proto';

import { mockDatabaseData } from './data.mock';

class MockDatabaseProvider extends DatabaseProvider {
  isRefreshing = false;

  // Connect to Database
  async connect(): Promise<boolean> {
    return new Promise((resolve) => resolve(mockDatabaseData.fakeResult));
  }

  // Create Users table if not exists
  createUserTable(): boolean {
    return mockDatabaseData.fakeResult;
  }

  // Find all Users
  async findAllUsers(): Promise<User[]> {
    return mockDatabaseData.users.map((username) => (
      { ...mockDatabaseData.mockUser1(), username }
    ));
  }

  // Load User by `username`
  async loadUser(username: string): Promise<boolean> {
    return mockDatabaseData.fakeResult;
  }

  // Add User to Database
  async addUser(username: string): Promise<boolean> {
    if (mockDatabaseData.users.includes(username)) {
      return false;
    }
    mockDatabaseData.users.push(username);
    return true;
  }

  // Remove User from Database
  async removeUser(username: string): Promise<boolean> {
    if (!mockDatabaseData.users.includes(username)) {
      return false;
    }
    mockDatabaseData.users = (
      mockDatabaseData.users.filter((uname) => uname !== username)
    );
    return true;
  }

  // Remove all Users from Database
  async removeAllUsers(): Promise<boolean> {
    mockDatabaseData.users = [];
    return mockDatabaseData.fakeResult;
  }
}

export default MockDatabaseProvider;
