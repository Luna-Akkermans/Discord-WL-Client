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
        .setName('whitelist')
        .setDescription('Add user to the whistelist!')
        .addStringOption(Options =>
            Options.setName("username")
            .setDescription("Username of to be whitelisted user")
            .setRequired(true)),
    async execute(Interaction) {
        if (Interaction.member.roles.cache.some(r => r.name === "Admin")) {
            //Get parameter string
            const USER = Interaction.options.getString('username')
            //Open connection through sftp
            sftp.connect({
                host: Host,
                port: Port,
                username: Username,
                password: Password
            }).then(() => {
                sftp.get('/whitelist.json', 'whitelist.json').then(stream => {
                    uuid(USER).then(player => {
                        if (!player) {
                            sftp.end();
                            Interaction.reply({
                                content: "Oops, I can't find this user!"
                            })
                        } else {
                            //read content of whitelist
                            fs.readFile('whitelist.json', (err, res) => {
                                err && Interaction.reply({
                                    content: "Oops, I'm having trouble reading the file! "
                                })

                                let localWL = JSON.parse(res);
                                if (localWL.filter((e) => {
                                        return e.name.toLowerCase() === player.name.toLowerCase()
                                    }).length > 0) {
                                    console.error("User is already defined in whitelist.json")
                                    Interaction.reply({
                                        content: "This user is already whitelisted!"
                                    })
                                    sftp.end();
                                } else {
                                    localWL.push({
                                        'uuid': player.id,
                                        'name': player.name
                                    })
                                    fs.writeFile('whitelist.json', JSON.stringify(localWL, null, 4), (err, res) => {
                                        if (err) {
                                            console.error("Error writing to file");
                                            Interaction.reply({
                                                content: 'Oops, could not write to file ;(('
                                            });
                                            sftp.end();
                                        } else {
                                            sftp.put(stream, 'whitelist.json').then(() => {
                                                sftp.end().then(() => {
                                                    console.log(USER, ' added to whitelist')
                                                    Interaction.reply({
                                                        content: `Added ${USER} to the whitelist! \n Enjoy playing!`
                                                    });
                                                })
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                })
            })
        } else {
            Interaction.reply({
                content: 'You do not have access to this command!'
            })
        }
    }
}