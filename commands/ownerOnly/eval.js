const { inspect } = require("util")
const { EmbedBuilder } = require("discord.js")
const { ColorBlue } = require(process.cwd()+"/config.js")

module.exports = {
    name: 'eval', //name of the command
    aliases: ['e', 'evaluate', 'evaluar'], //aliases of the command
    description: 'Eval code on discord.', //description of the command
    userPermissions: [], //user permissions required to use the command
    botPermissions: [], //bot permissions required to use the command
    disabled: false , //enable/disable the command
    ownerOnly: true, //only the owner can use the command
    args: true, //if the command needs arguments
    usage: '<codigo>+<code>', //Use: 'Use in Spanish + Use in English'
    
    async execute(client, message, args, lang, languageFind, prefix) {
        
        const ingreso = args.join(" ")
                    
        try {

            const result = await eval(ingreso)
            let output = result
            if (typeof result !== "string")
            output = inspect(result)
            
        
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(ColorBlue)
                        .setDescription(":outbox_tray: **Output**"+`\`\`\`js\n${output.substring(0, 4000)}\n\`\`\``)
                        .addFields(
                            { name: ":inbox_tray: Input", value: `\`\`\`js\n${ingreso}\`\`\``, inline: true }
                        )
                ]
            })

        }catch (err) {
            client.log.error(err.stack.toString())
            return message.channel.send({ 
                content: `**Something went wrong**\n` +`\`\`\`js\n${err.stack.toString()}\n\`\`\`` 
            })

        }
        
    }
}