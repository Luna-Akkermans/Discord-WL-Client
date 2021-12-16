//Require classes needed for discord.js
const {Client, Intents, Collection} = require('discord.js');
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
    //Let console know that bot is online
    console.log("Ready");
    //Registering commands to the client!
    const ID_CLIENT = client.user.id;
    const rest = new REST({
        version: '9'
    });
    (async () => {
        try{
            if(!GuildID){
                await rest.put(
                    Routes.applicationCommands(ID_CLIENT),  {
                        body: commands
                    },
                );
                console.log("added");
            }   else {
                await rest.put(
                    Routes.applicationGuildCommands(ID_CLIENT, GuildID), {
                        body: commands
                    },
                );
                console.log("added application commands")
            }
        }catch  (error) {
            if (error) console.error(error);
        }
    })
})();


//Client ready!
client.on('ready', () => {
    console.log("online!")
})




client.login(TOKEN);