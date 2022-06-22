const { ShardingManager } = require('discord.js');
require("dotenv").config();
console.clear();

const manager = new ShardingManager('./bot.js', {
    token: process.env.TOKEN,
    totalShards: 'auto',
    respawn: false,
});

manager.on('shardCreate', async shard => {

    console.log(`\x1b[32m [ ShardManager ] \x1b[37m Shard ${shard.id} se ha iniciado con exito. \x1b[0m`);

    shard.on('death', process => {
        console.log(`\x1b[32m [ Shard ${shard.id} ] \x1b[37m Ha sido apagada. \x1b[0m`);
    });

    shard.on('disconnect', () => {
        console.log(`\x1b[32m [ Shard ${shard.id} ] \x1b[37m Se ha descontectado. \x1b[0m`);
    });

    shard.on('reconnecting', () => {
        console.log(`\x1b[32m [ Shard ${shard.id} ] \x1b[37m Se esta reconectando. \x1b[0m`);
    });

    shard.on('spawm', process => {
        console.log(`\x1b[32m [ Shard ${shard.id} ] \x1b[37m Ha iniciado. \x1b[0m`);    
    });

});

process.on("uncaughtException", (err, origin) => {
    console.error("\x1b[31m", `[${new Date().toLocaleString()}] | Uncaught Exception: ${err} | Origin: ${origin} \x1b[0m`);
});

process.on("unhandledRejection",  (reason, p) => {
    console.error("\x1b[31m", `[${new Date().toLocaleString()}] | Unhandled Rejection at: ${p} | Reason: ${reason} \x1b[0m`);
});

process.on("multipleResolves", (type, promise, reason) => {
    console.error("\x1b[31m", `[${new Date().toLocaleString()}] | Multiple Resolves: ${type} | Promise: ${promise} | Reason: ${reason} \x1b[0m`);
});

manager.spawn();
