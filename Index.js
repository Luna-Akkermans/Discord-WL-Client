//Require classes needed for discord.js
const {Client, Intents, Collection, interaction} = require('discord.js');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9')
//Require discord bot TOKEN
const {TOKEN, GuildID, ClientID} = require('./DISC_config/config.json');
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
    client.commands.set(command.data.name, command);
}


//Client ready?
client.once('ready', () => {
    console.log('Ready!');
    // Registering the commands in the client
    const CLIENT_ID = client.user.id;
    const rest = new REST({
        version: '9'
    }).setToken(TOKEN);
    (async () => {
        try {
            if (!GuildID) {
                await rest.put(
                    Routes.applicationCommands(CLIENT_ID), {
                        body: commands
                    },
                );
                console.log('Successfully registered application commands globally');
            } else {
                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, GuildID), {
                        body: commands
                    },
                );
                console.log('Successfully registered application commands for development guild');
            }
        } catch (error) {
            if (error) console.error(error);
        }
    })();
});


//Client ready!
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
            await command.execute(interaction);
    } catch (error) {
        if (error) console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(TOKEN);