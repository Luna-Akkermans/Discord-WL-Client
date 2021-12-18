const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const {
    Host,
    Port,
    Username,
    Password
} = require('../FTP_config/config.json')
const fs = require('fs');
const Client = require('ssh2-sftp-client');
const internal = require('stream');
const { User } = require('discord.js');
let sftp = new Client;


//Load in fetch async
const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args));

//Load in api function
async function uuid(username) {
    try {
        const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`)
        const userInformation = await response.json();
        return userInformation;
    } catch (err) {
        return false;
    }

}



module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes user from the whistelist!')
        .addStringOption(Options =>
            Options.setName("username")
            .setDescription("Username to be removed from whitelist")
            .setRequired(true)),
    async execute(Interaction) {
        let USER = Interaction.options.getString('username')
        if (Interaction.member.roles.cache.some(r => r.name === "Admin")) {
            sftp.connect({
                host: Host,
                port: Port,
                username: Username,
                password: Password
            }).then(() => {
                sftp.get('/whitelist.json', 'whitelist.json').then(stream => {
                    fs.readFile('whitelist.json', (err, res) => {
                        err && Interaction.reply({content: "Oops, I'm having trouble reading the file! "});
                        let localWL = JSON.parse(res);
                        localWL = localWL.filter(( obj ) => {
                            return obj.name.toLowerCase() !== USER.toLowerCase();
                        });
                        fs.writeFile('whitelist.json', JSON.stringify(localWL, null, 4), (err, res) => {
                            sftp.put(stream, 'whitelist.json').then(() => {
                                sftp.end().then(() => {
                                    console.log(USER, ' Removed from whitelist')
                                    Interaction.reply({
                                        content: `Removed ${USER} from the whitelist!`
                                    });
                                })
                            }) 
                        })

                    })
                })
            })
        }
    }
}