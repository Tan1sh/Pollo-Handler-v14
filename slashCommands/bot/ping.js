module.exports = {
    name: 'ping', //name of the command
    description: 'ping command', //description of the command
    description_localizations: {
        "es-ES": "comando de ping"
    }, //description of the command in diferent languages
    type: 1, //type of interaction  (1 = chatInputCmd | 2 = applicationCmd)
    userPermissions: [], //user permissions required to use the command
    botPermissions: [], //bot permissions required to use the command
    disabled: false, //enable/disable the command
    ownerOnly: true, //only the owner can use the command
    
    async execute(client, interaction, args, lang, languageFind) {

        interaction.reply({
            content: "pong"
        })
    }

}