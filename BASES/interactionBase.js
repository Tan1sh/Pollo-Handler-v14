module.exports = {
    name: '', //name of the command
    description: '', //description of the command
    description_localizations: {
        'es-ES': ''
    }, //description of the command in diferent languages
    type: 1, //type of interaction  (1 = chatInputCmd | 2 = applicationCmd)
    userPermissions: [], //user permissions required to use the command
    botPermissions: [], //bot permissions required to use the command
    disabled: false, //enable/disable the command
    ownerOnly: false, //only the owner can use the command
    
    async execute(client, interaction, args, lang, languageFind) {


    }

}