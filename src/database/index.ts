import constants from '../utils/constants';

import DatabaseProvider from './database.proto';
import MongoDB from './mongo';
import Postgres from './postgres';
import SQLite from './sqlite3';

// Get map of database
const databaseMap = {
  mongo: MongoDB,
  postgres: Postgres,
  sqlite3: SQLite,
  sqlite: SQLite,
};

// Get specific Database
const Database: typeof DatabaseProvider = (
  databaseMap[constants.DB_PROVIDER] || SQLite
);

export default new Database();
