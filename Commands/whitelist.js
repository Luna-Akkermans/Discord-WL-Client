const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports ={
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('lol'),
    async execute(interaction) {
        Interaction.reply({ content: 'works' })
    }
}