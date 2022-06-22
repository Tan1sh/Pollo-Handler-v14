const { glob } = require('glob');
const { promisify } = require('util');
const { Client } = require('discord.js');
const globPromise = promisify(glob);
const mongoose = require('mongoose');
const { readdirSync } = require('fs');
require('dotenv').config();
const { 
    slashCommandsGlobal, 
    SlashCommandsServidor 
} = require(`${process.cwd()}/config.js`);

/**
 * @param {Client} client
 */

 module.exports = async (client) => {

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/*/*.js`);
    eventFiles.map((value) => require(value));

    client.log.debug(`${eventFiles.length} events loaded.`);

    // Slash Commands
    const slashCommands = await globPromise(`${process.cwd()}/slashCommands/*/*.js`);

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });

    client.log.debug(`${client.slashCommands.size} slash commands loaded.`);

    //Prefix Commands
    const commandFolders = readdirSync(process.cwd() + '/commands');
    for (const folder of commandFolders) {
    const commandFiles = readdirSync(`${process.cwd()}/commands/${folder}`).filter(file => file.endsWith(".js"))
    for (const file of commandFiles) {
        const command = require(`${process.cwd()}/commands/${folder}/${file}`);
        client.commands.set(command.name, command)
        }
    }

    client.log.debug(`${client.commands.size} prefix commands loaded.`);

    client.once("ready", async () => {

        if(slashCommandsGlobal === true){

            client.log.debug('(/) Slash Commands Globally loaded.');
            await client.application.commands.set(arrayOfSlashCommands);
        } 

        if(slashCommandsGlobal === null){

            SlashCommandsServidor.forEach(async (value) => {
                client.log.debug(`(/) Slash Commands removed on the server: ${value}`)
                await client.guilds.cache.get(value).commands.set([]);
            })
            
        }

        if(slashCommandsGlobal === false){

            SlashCommandsServidor.forEach(async (value) => {
                client.log.debug(`(/) Slash Commands enabled for the server: ${value}`)
                await client.guilds.cache.get(value).commands.set(arrayOfSlashCommands);
                
            })
            
        }
       
    });

    

    //Mongo Database
    mongoose.connect(process.env.MongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() =>  {
        client.log.success('[DATABASE] Connected to MongoDB')
        
    }).catch(err => {
        client.log.error(`[DATABASE] Error connecting to MongoDB: ${err}`)
        
    })

};
