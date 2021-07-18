import { User } from '../../../leetcode/models';

export interface MockDatabaseInterface {
  users: string[];
  mockUser1: () => User;
  savedUsers: () => User[];
  fakeResult: boolean;
}

export interface OtherModel {
  field: string;
}
