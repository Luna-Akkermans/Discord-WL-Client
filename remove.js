// const {
//     SlashCommandBuilder
// } = require('@discordjs/builders');
// const {
//     Host,
//     Port,
//     Username,
//     Password
// } = require('../FTP_config/config.json')
// const fs = require('fs');
// const Client = require('ssh2-sftp-client');
// const internal = require('stream');
// let sftp = new Client;


// //Load in fetch async
// const fetch = (...args) => import('node-fetch').then(({
//     default: fetch
// }) => fetch(...args));

// //Load in api function
// async function uuid(username) {
//     try {
//         const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`)
//         const userInformation = await response.json();
//         return userInformation;
//     } catch (err) {
//         return false;
//     }

// }



// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('remove')
//         .setDescription('Removes user from the whistelist!')
//         .addStringOption(Options =>
//             Options.setName("username")
//             .setDescription("Username to be removed from whitelist")
//             .setRequired(true)),
//     async execute(Interaction) {
//         if (Interaction.member.roles.cache.some(r => r.name === "Admin")) {
//             sftp.connect({
//                 host: Host,
//                 port: Port,
//                 username: Username,
//                 password: Password
//             }).then(() => {
//                 sftp.get('/whitelist.json', 'whitelist.json').then(stream => {
//                     fs.readFile('whitelist.json', (err, res) => {
//                         err && Interaction.reply({
//                             content: "Oops, I'm having trouble reading the file! "
//                         })
//                         let localWL = JSON.parse(res);
//                         if (localWL.filter((e) => {
//                             return e.name === player.name
//                         }).length > 0) {

//                         }
//                     })
//                 })
//             })
//         }
//     }
// }