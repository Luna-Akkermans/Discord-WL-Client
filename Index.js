//Require classes needed for discord.js
const {Client, Intents} = require('discord.js');
//Require discord bot TOKEN
const {TOKEN} = require('./DISC_config/config.json');

//Create new client instance
const client = new Client({intents: [Intents.FLAGS.GUILDS]});

//Client ready?
client.once('ready', () => {
    console.log("Ready");

})

client.login(TOKEN);