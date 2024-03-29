// exporting all required packages & functions 
const fs = require('fs')
const moment = require('moment');
const Discord = require('discord.js')
const { 
    logTranscript, 
    webhookTranscriptTokens, 
    webhookTranscript  
} = require(`${process.cwd()}/config.js`);
/**
 * @CONFIG
*/
const dateNow = `${moment().format("DD-MM-YY ~ H:m:s")}`
const fileName = `${moment().format('DD-MM-YY')}` // file name, used to create an filename with this formatt | Default: <day>-<month>-<year> ~ <time>
const fileExtension = `.log` // file extension for fileName | Default: .log
const logPath = `${process.cwd()}/logs/` // transcripting path
const logTypes = ['log', 'info', 'success', 'error', 'warn', 'event', 'debug'] // DO NOT EDIT IF DON'T KNOW WHAT IS THIS. | DEFAULT: ['log', 'info', 'success', 'error', 'warn', 'event', 'debug']

const Colors = {
    // colors of loging text
    log: '\u001b[37;1m',
    info: '\u001b[96m',
    success: '\u001b[32;1m',
    error: '\u001b[31;1m',
    warn: '\u001b[33;1m',
    event: '\u001b[34;1m',
    debug: '\u001b[35;1m',

    // colors of logging timestam, type, filename, reset
    timestamp: '\u001b[34;1m',
    logType: '\u001b[34;1m',
    fileName: '\u001b[36;1m',
    // DO NOT EDIT THIS
    reset: '\u001b[0m',

    //Webhook Embed Colors
    webhook_warn: 16753920, // WEBHOOK EMBED COLOR IN HEX Please Here How to Use || HEX = RED #FFF000 Cange It To 0xFFF000 Change From # To 0x
    webhook_error: 15548997 // WEBHOOK EMBED COLOR IN HEX Please Here How to Use || HEX = RED #FFF000 Cange It To 0xFFF000 Change From # To 0x
} // Use ASNI Colors For This, If Know What You're Doing Fell Free Editing It.
/**
 * @END @CONFIG
*/

// Exporting All 
exports.log = async (msg, type = 'log') => {
    /**
     * @function Functions Just Making Some Functions UwU
    */
    if (msg === "" || typeof msg !== "string") throw new Error("[Logger] Invalid Logging Content.") // check if msg is a string and not em-pty
    if (!logTypes.includes(type.toLowerCase())) throw new Error("[Logger] Invalid Logging Type.") // check if logger is valid

    function _filename() {
        var filename;
        var _pst = Error.prepareStackTrace;
        Error.prepareStackTrace = function (err, stack) { return stack; };
        try {
            var err = new Error();
            var callerfile;
            var currentfile;

            currentfile = err.stack.shift().getFileName();

            while (err.stack.length) {
                callerfile = err.stack.shift().getFileName();

                if (currentfile !== callerfile) {
                    filename = callerfile;
                    break;
                }
            }
        } catch (err) { }
        Error.prepareStackTrace = _pst;

        filename = `[` + filename
            .split(/[\\/]/).pop() // if want the full path delete this
            + `]` // add [] to filename and remove the tree
        return filename; // return filename with []
    }

    function transcript() { // make transcript
        if (logTranscript !== true) return;
        content = `[${dateNow}] - [${type}] ~ ${_filename()} ${msg}`
        fs.writeFileSync(logPath + fileName + fileExtension, `${content}\n`, { flag: "a+" },
            (err) => {
                if (err) throw new Error("[Logger] Falied To Transcript.")
            })
    } // transcript function that transcript it to a file if set to true

    function transcriptToWebhook() {
        if (webhookTranscript !== true) return; // check if want to transcript
        if (type === "error" || type === "warn") {
            const webhook = {
                color: type === "warn" ? Colors.webhook_warn : Colors.webhook_error,
                title: type === "warn" ? `An ${type.charAt(0).toUpperCase() + type.slice(1)}ing Has Appeared!` : `An ${type.charAt(0).toUpperCase() + type.slice(1)} Has Ocurred`,
                fields: [
                    {
                        name: `Content:`,
                        value: `\`\`\`${msg}\`\`\``,
                    },
                    {
                        name: `Full:`,
                        value: `\`\`\`[${dateNow}] - [${type}] ~ ${_filename()} ${msg}\`\`\``,
                    },
                ],
            } // embed maker

            const webhook_sender = new Discord.WebhookClient({
                id: type === "warn" ? webhookTranscriptTokens.warn.id : webhookTranscriptTokens.error.id,
                token: type === "warn" ? webhookTranscriptTokens.warn.token : webhookTranscriptTokens.error.token
            }); // get id, token and set

                webhook_sender.send({
                    embeds: [webhook]
                }); // send it
            
            
        }
    } // transcript to webhook channel (DISCORD)

    function log_color() {
        let color;
        type === "log" ? color = Colors.log : type === "info" ? color = Colors.info : type === "success" ? color = Colors.success : type === "error" ? color = Colors.error : type === "warn" ? color = Colors.warn : type === "event" ? color = Colors.event : color = Colors.debug
        return color;
    }

    console.log(`${Colors.timestamp}[${dateNow}]${Colors.reset} - ${Colors.logType}[${type}]${Colors.reset} ~ ${Colors.fileName}${_filename()}${Colors.reset} ${log_color()}${msg}${Colors.reset}`)
    transcript()
    transcriptToWebhook()
}

exports.info = (...args) => this.log(...args, 'info');
exports.success = (...args) => this.log(...args, 'success');
exports.error = (...args) => this.log(...args, 'error');
exports.warn = (...args) => this.log(...args, 'warn');
exports.event = (...args) => this.log(...args, 'event');
exports.debug = (...args) => this.log(...args, 'debug');

/**
 * @author TheJoaqun#7309 (Permanent Discord Username)
 * @licence This Code Is Free To Use Or Edit. This Code Shouldn't Be Selled, Re-Selled Or Publish It Under Other Credits
 * @version {1.0} May Be Last Update
*/