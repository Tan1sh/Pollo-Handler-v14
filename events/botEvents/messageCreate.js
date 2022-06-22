const { EmbedBuilder } = require("discord.js");
const client = require(`${process.cwd()}/bot.js`);
const { defaultPrefix, devsID, ColorRed, ColorBlue } = require(`${process.cwd()}/config.js`);
const LanguageDB = require(`${process.cwd()}/models/languageDB.js`);

client.on('messageCreate', async (message) => {

    //Prefix Commands
    if(!message.guild ||
       !message.guild.available ||
       message.author.bot ||
       !client.prefixes) return;
    
    let prefixFind = await client.prefixes.find(x => x.GuildID === message.guild.id.toString())
    let prefix;

    if(prefixFind) prefix = prefixFind.prefix;
    else prefix = defaultPrefix;

    if(message.content.startsWith(prefix)) {

        const args = message.content.slice(prefix.length).trim().split(/ +/)
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if(!command) return;

        //languages
        const languageFind = await LanguageDB.findOne({ GuildID: message.guild.id }).catch(err => client.log.error(err.stack.toString()));
        let lang;
        
        if(languageFind !== null && languageFind?.lang !== undefined) {

            if(languageFind.lang === "es") lang = client.es;
            else if(languageFind.lang == "en")lang = client.en;
            else lang = client.en;

        }else lang = client.en

        //Check if bot has the Send Messages permission
        if(!message.channel.permissionsFor(client.user).has('SendMessages')) {

            if(message.channel.permissionsFor(client.user).has('AddReactions')) 
            return message.react('❌').catch(err => client.log.error(err.stack.toString()));

            return;
        }

        //Check if bot has the Embed Links permission
        if(!message.channel.permissionsFor(client.user).has("EmbedLinks")) 
        return message.channel.send({
            content: `${lang?.prefix["I don't have permission to send embed messages."]}`
        }).catch(err => client.log.error(err.stack.toString()));

        //Check if the command is disabled
        if(command?.disabled === true) {

            //if the user is not a developer, it does not allow the command to be executed
            if(devsID.some(id => message.author.id.toString() !== id)) {

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${lang?.prefix["This command is disabled."]}`)
                            .setColor(ColorRed)
                    ]
                }).catch(err => client.log.error(err.stack.toString()));

            }

            message.channel.send({
                content: `${lang?.prefix["This command is disabled but you have developer permissions."]}`
            })

        }

        //Check if the command is owner only
        if(command?.ownerOnly === true && devsID.some(id => message.author.id.toString() !== id))  
        return;

        //Check user permissions
        if(command?.userPermissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            const missingPerms = command.userPermissions.filter(perm => !authorPerms.has(perm));

            if(!authorPerms || !authorPerms.has(command.userPermissions)) {

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setAuthor({
                            name: `${message.author.tag}`,
                            iconURL: message.author.avatarURL()
                        })
                        .setTitle(
                            `${lang?.prefix["You don't have the next permissions: {permissions}"]}`
                            .replace("{permissions}", missingPerms.join(', ')
                        ))
                        .setColor(ColorRed)
                    ]
                }).catch(err => client.log.error(err.stack.toString()));

            }

        }

        //Check bot permissions
        if(command?.botPermissions) {

            if(!message.guild.members.me.permissions.has(command.botPermissions)) {

                const missingPerms = command?.botPermissions.filter(perm => !message.guild.members.me.permissions.has(perm));
                
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setAuthor({
                            name: `${message.author.tag}`,
                            iconURL: message.author.avatarURL()
                        })
                        .setTitle(
                            `${lang?.prefix["I don't have the next permissions: {permissions}"]}`
                            .replace("{permissions}", missingPerms.join(', '))
                        )
                        .setColor(ColorRed)
                    ]
                }).catch(err => client.log.error(err.stack.toString()));
            }
        }

        //Command arguments
        if(command?.args && !args.length) {

            const usage = command.usage.split("+");

            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: message.author.username,
                            iconURL: message.author.avatarURL()
                        })
                        .setDescription(
                            `**${lang?.prefix["<> required [] optional"]}\n\n**➤ ${prefix}${command.name} ${languageFind?.lang === "es" ? usage[0] : usage[1]}`
                        )
                        .setColor(ColorBlue)
                ]
            }).catch(err => client.log.error(err.stack.toString()));
        }

        //Execute command
        command.execute(client, message, args, lang, languageFind, prefix)
        .catch(err => client.log.error(err.stack.toString()));
  
    }
})