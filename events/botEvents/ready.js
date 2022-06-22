const client = require(`${process.cwd()}/bot.js`);
const prefixDB = require(`${process.cwd()}/models/prefixDB.js`);
const es = require(`${process.cwd()}/locales/es.json`);
const en = require(`${process.cwd()}/locales/en.json`);
const { ActivityType } = require("discord.js");

client.once("ready", async () => {

    //Load Prefix Commands
    client.prefixes = await prefixDB.find({}).catch(err => { client.log.error(`Error trying to load prefixes: ${err}`) })
    client.log.success(`Prefix loaded.`)

    //set lang
    client.en = en //english
    client.es = es //spanish

    client.log.success(`Languages loaded.`)

    //Set bot activity
    const activities_list = [
        ` /help | ${client.guilds.cache.size} Servers`
    ]

    setInterval(() => {
        function presense() {
  
            client.user.setActivity(activities_list[Math.floor(Math.random() * activities_list.length)], { type: ActivityType.Watching })
            //client.user.setPresence({ status: "online" })
        }
  
        presense();
    }, 10000);

    client.log.debug(`${client.user.tag} online.`);
    client.log.debug(`${client.guilds.cache.size} guilds cached.`);
    client.log.debug(`${client.users.cache.size} users cached.`);
    

})