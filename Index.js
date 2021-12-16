//Require classes needed for discord.js
const {Client, Intents, Collection} = require('discord.js');
//Require discord bot TOKEN
const {TOKEN} = require('./DISC_config/config.json');
//Require filesystem (fs)
const fs = require('fs');


//Create new client instance
const client = new Client({intents: [Intents.FLAGS.GUILDS]});


//Loop through all commands created by making a new file in the Commands folder.
//Read files
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));
//Array to later save commands
const commands = [];
//Create new Collection.
client.commands = new Collection();
//Loop through every file found in Commands folder
for (const fileName of commandFiles) {
    const command = require(`./Commands/${fileName}`);
    commands.push(command.data.toJSON());
    client.command.set(command.data.name, command);
}





//Client ready?
client.once('ready', () => {
    console.log("Ready");

})







client.login(TOKEN);