const mongoose = require('mongoose');
const userSchema = require('../objects/user');
const { DB_NAME, DB_PORT, MONGO_URL } = require('../utils/constants');
const DICT = require('../utils/dictionary');
const { log, error } = require('../utils/helper');

// Main class for Database
class Database {
  constructor() {
    // Environment variables
    this.url = MONGO_URL;
    this.port = DB_PORT;
    this.name = DB_NAME;
    this.server = `${this.url}:${this.port}`;
    this.databaseUrl = `mongodb://${this.server}/${this.name}`;

    // Indicator
    this.isRefreshing = false;
    this.lastRefreshStartedAt = null;
    this.lastRefreshFinishedAt = null;

    // Models
    this.UserModel = mongoose.model('User', userSchema);
  }

  // Connect to Database
  async connect() {
    await mongoose
      .connect(this.databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => {
        log(DICT.DATABASE.CONNECTION_STATUS.SUCCESSFUL);
      })
      .catch((err) => {
        error(DICT.DATABASE.CONNECTION_STATUS.ERROR, err);
      });
  }

  // Find all Users
  async findAllUsers() {
    return this.UserModel.find();
  }

  // Load User by `username`
  async loadUser(username) {
    return this.UserModel.findOne({ username });
  }

  // Add User to Database
  async addUser(username) {
    const existingUser = await this.loadUser(username);

    // If User does exist, no need to add new
    if (existingUser) return null;

    // Create new User and save
    const newUser = new this.UserModel({ username });
    await newUser.save();

    return newUser;
  }

  async removeUser(username) {
    const user = await this.loadUser(username);

    // If User does exist, no delete him, otherwise
    if (!user) return false;

    // If User exists, delete him
    await this.UserModel.deleteOne({ username });

    return true;
  }
}

module.exports = new Database();