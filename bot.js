const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection
} = require ('discord.js');
require('dotenv').config();
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        //GatewayIntentBits.GuildMembers,
        //GatewayIntentBits.GuildBans,
        //GatewayIntentBits.GuildEmojisAndStickers,
        //GatewayIntentBits.GuildIntegrations,
        //GatewayIntentBits.GuildWebhooks,
        //GatewayIntentBits.GuildInvites,
        //GatewayIntentBits.GuildVoiceStates,
        //GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        //GatewayIntentBits.GuildMessageReactions,
        //GatewayIntentBits.GuildMessageTyping,
        //GatewayIntentBits.DirectMessages,
        //GatewayIntentBits.DirectMessageReactions,
        //GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
       // GatewayIntentBits.GuildScheduledEvents,
    ],
  
      partials: [ 
        //Partials.User,
        //Partials.Channel,
        //Partials.GuildMember,
        Partials.Message, 
        //Partials.Reaction,
        //Partials.GuildScheduledEvent,
        //Partials.ThreadMember          
      ],
      
      allowedMentions: {
        parse: [
          'users',
          'roles',
        ],
        //repliedUser: false
      }
});

module.exports = client;

client.commands = new Collection();
client.slashCommands = new Collection();
client.log = require('./util/logger.js');

require('./handler')(client);

client.login(process.env.TOKEN);
