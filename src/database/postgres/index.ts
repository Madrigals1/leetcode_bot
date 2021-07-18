import pg from 'pg';

import { error, log } from '../../utils/helper';
import constants from '../../utils/constants';
import dictionary from '../../utils/dictionary';
import DatabaseProvider from '../database.proto';

import QUERIES from './queries';

class Postgres extends DatabaseProvider {
  client = new pg.Client({
    user: constants.POSTGRES.DB_USER,
    host: constants.POSTGRES.DB_URL,
    database: constants.POSTGRES.DB_NAME,
    password: constants.POSTGRES.DB_PASSWORD,
    port: constants.POSTGRES.DB_PORT,
  });

  // Connect database
  async connect() {
    this.client.connect();

    // Query for creating users table
    const query = QUERIES.CREATE_USERS_TABLE;

    // Create table for users if not exist
    return this.client.query(query)
      .then(() => {
        log(dictionary.SERVER_MESSAGES.CONNECTION_STATUS.SUCCESSFUL);
        return true;
      })
      .catch((err) => {
        error(dictionary.SERVER_MESSAGES.CONNECTION_STATUS.ERROR(err));
        this.client.end();
        return false;
      });
  }

  // Find all Users
  async findAllUsers() {
    return this.client.query(QUERIES.GET_ALL_USERS)
      .then((res) => res.rows)
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }

  // Load User by `username`
  async loadUser(username: string) {
    return this.client.query(QUERIES.LOAD_USER(username))
      .then((res) => res.rows[0])
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }

  // Add User to Database
  async addUser(username: string) {
    // Check if user already exists is in database
    const exists = await this.loadUser(username);

    // If user already exists, do not add User to Database
    if (exists) return false;

    return this.client.query(QUERIES.ADD_USER(username))
      .then(() => true)
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }

  // Remove User from Database
  async removeUser(username: string) {
    // Check if user exists is in database
    const exists = await this.loadUser(username);

    // If user does not exist, return false
    if (!exists) return false;

    return this.client.query(QUERIES.REMOVE_USER(username))
      .then(() => true)
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }

  // Remove all Users from Database
  async removeAllUsers() {
    return this.client.query(QUERIES.REMOVE_ALL_USERS)
      .then(() => true)
      .catch((err) => {
        error(err);
        this.client.end();
        return false;
      });
  }
}

export default Postgres;
