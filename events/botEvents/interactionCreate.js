const client = require(`${process.cwd()}/bot.js`);
const { EmbedBuilder } = require('discord.js')
const { ColorRed, devsID } = require(`${process.cwd()}/config.js`)
const LanguageDB = require(`${process.cwd()}/models/languageDB.js`);


client.on('interactionCreate', async (interaction) => {

    if(interaction.isChatInputCommand()) {

        //languages
        const languageFind = await LanguageDB.findOne({ GuildID: interaction.guild.id }).catch(err => client.log.error(err.stack.toString()));
        let lang;
        
        if(languageFind !== null && languageFind?.lang !== undefined) {

            if(languageFind.lang === "es") lang = client.es;
            else if(languageFind.lang == "en")lang = client.en;
            else lang = client.en;

        }else lang = client.en


        const command = client.slashCommands.get(interaction.commandName);

        /**
         * if the command is not found it sends a response to the interaction 
         * saying that it was not found or has been modified
        */
        if(!command) {

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(lang.interactioncreate["This command no longer exists or has been modified."])
                        .setColor(ColorRed)
                ],

                ephemeral: true
            })
        }

        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }

        //Check if the command is disabled
        if(command?.disabled == true) {

            if(devsID.some(id => interaction.member.id.toString() !== id)) {

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`${lang?.interactioncreate["This command is disabled."]}`)
                            .setColor(ColorRed)
                    ],

                    ephemeral: true
                }).catch(err => client.log.error(err.stack.toString()));
            }

        }

        //Check if the command is owner only
        if(command?.ownerOnly === true && devsID.some(id => interaction.member.id.toString() !== id)) 
        return interaction.reply({
            embeds:[
                new EmbedBuilder()
                    .setTitle(`${lang?.interactioncreate["This command is only for bot developers."]}`)
                    .setColor(ColorRed)

            ],
             
            ephemeral: true
        }).catch(err => client.log.error(err.stack.toString()))

        //Check member permissions
        if(!interaction.memberPermissions.has(command.userPermissions)) {

            const missingPerms = command.userPermissions.filter(perm => !interaction.memberPermissions.has(perm));

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `${interaction.member.user.tag}`,
                            iconURL: interaction.member.user.avatarURL()
                        })
                        .setTitle(`${lang?.interactioncreate["You don't have the next permissions: {permissions}"]
                        .replace("{permissions}", missingPerms)}`
                        )

                        .setColor(ColorRed)
                ],

                ephemeral: true

            }).catch(err => client.log.error(err.stack.toString()))

        }

        //Check bot permissions
        if(!interaction.guild.members.me.permissions.has(command.botPermissions)) {

            const missingPerms = command?.botPermissions.filter(perm => !interaction.guild.members.me.permissions.has(perm));

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: `${interaction.member.user.tag}`,
                            iconURL: interaction.member.user.avatarURL()
                        })
                        .setTitle(`${lang?.interactioncreate["I don't have the next permissions: {permissions}"]
                        .replace("{permissions}", missingPerms)}`
                        )
                        .setColor(ColorRed)
                ],

                ephemeral: true

            }).catch(err => client.log.error(err.stack.toString()))
        }

        command.execute(client, interaction, args, lang, languageFind)
        .catch(err => client.log.error(err.stack.toString()));
        

    }

})