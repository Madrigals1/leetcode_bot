import {token} from './config';
import TeleBot from 'telebot';

import Database from './database';
import system from './models/system';

const bot = new TeleBot(token);

function addListenerIfNotExist(username) {
    if(!system.addedListeners.includes(username)){
        bot.on(['/' + username.toLowerCase()], (msg) => callbackForUser(msg, username));
        system.addedListeners.push(username);
    }
}

function callbackForUser(msg, username) {
    Database.loadUser(username).then(data => {
        const {name, username, solved, error} = data;
        if (error) {
            return msg.reply.text(`Error is encountered: ${error}`);
        }
        return msg.reply.text(`Name: ${name} \nUsername: ${username} \nSolved: ${solved} \n`);
    });
}

async function refreshUsers () {
    await Database.refreshUsers()
        .then(() => {
            system.users.forEach(user => {
                addListenerIfNotExist(user.username);
            });
        })
        .catch(err => console.error(err));
}

bot.on(['/start'], (msg) => {
    return msg.reply.text(system.welcomeText, { parseMode: 'HTML' });
});

bot.on(['/add'], async (msg) => {
    const userNameList = msg.text.split(' ');
    if (userNameList.length === 1) return msg.reply.text('Please, enter at least 1 username after /add command');
    let userNameListText = '';
    for(let i = 1; i < userNameList.length; i++){
        await Database.addUser(userNameList[i])
            .then(user => {
                if (user) {
                    system.users.push(user);
                    userNameListText += `${user.username}\n`;
                    addListenerIfNotExist(user.username);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }
    refreshUsers().then(() => msg.reply.text(`Users that were added:\n ${userNameListText}`));
});

bot.on(['/refresh'], (msg) => {
    refreshUsers().then(() => {});
    msg.reply.text('Database will be refreshed');
});

bot.on(['/rating'], async msg => {
    return msg.reply.text(system.ratingText, { parseMode: 'Markdown' });
});

bot.start();

refreshUsers().then(() => console.log('Database is refreshed'));