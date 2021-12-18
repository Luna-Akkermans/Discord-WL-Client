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
var userList = "";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('showwl')
        .setDescription('Shows the current whitelist!'),
    async execute(Interaction) {
        let USER = Interaction.options.getString('username')
            sftp.connect({
                host: Host,
                port: Port,
                username: Username,
                password: Password
            }).then(() => {
                sftp.get('/whitelist.json', 'whitelist.json').then(stream => {
                    fs.readFile('whitelist.json', (err, res) => {
                        let localWL = JSON.parse(res);
                        localWL.forEach(element => {
                            userList += element.name += '\n'
                        })
                       Interaction.reply({content: `\n **Current whitelisted users are:** \n ${userList}`})
                       sftp.end();

                    })
                })
            })
    }
}