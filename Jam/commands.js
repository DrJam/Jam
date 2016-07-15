module.exports = {
    "ping": {
        usages: [
            []
        ],
        description: "Replies with \"Pong!\", good for testing bot responsiveness.",
        process: function(client, message, suffix)
        {
            client.reply(message, "Pong!");
        }
    },
    "servers": {
        usages: [
            []
        ],
        description: "Lists the servers the bot is connected to.",
        process: function(client, message, suffix)
        {
            client.sendMessage(message.channel, client.servers);
        }
    },
    "channels": {
        usages: [
            []
        ],
        description: "Lists the channels the bot is watching",
        process: function(client, message, suffix)
        {
            client.sendMessage(message.channel, client.channels)
        }
    },
    "myid": {
        usages: [
            []
        ],
        description: "Shows the User ID of the sender",
        process: function(client, message, suffix)
        {
            client.sendMessage(message.channel, message.author.id);
        }
    },
    "idle": {
        usages: [
            []
        ],
        description: "Sets the bot's status to Idle",
        process: function(client, message, suffix)
        {
            client.setStatusIdle();
        }
    },
    "online": {
        usages: [
            []
        ],
        description: "Sets the bot's status to Online",
        process: function(client, message, suffix)
        {
            client.setStatusOnline();
        }
    },
    "say": {
        usages: ["message"],
        description: "Bot says the given message",
        process: function(client, message, suffix)
        {
            client.sendMessage(message.channel, suffix);
        }
    },
    /*"wolfram": {
        usages: [
        []
        ],
        description: "Gives results from WolframAlpha using the given search terms.",
        requiresAdmin: false,
        process: function (client, message, suffix) {
            if (!suffix) {
                bot.sendMessage(msg.channel, "Usage: !wolfram <search terms> (Ex. !wolfram integrate 4x)");
                return;
            }
            wolfram_plugin.respond(suffix, msg.channel, bot);
        }
    },*/
    "tts": {
        usages: [
            []
        ],
        description: "The bot says the message with Text to Speech",
        process: function(client, message, suffix)
        {
            client.sendMessage(message.channel, suffix, { tts: true });
        }
    },
    "permissions": {
        usages: [
            ["action"],
            ["action", "command", "target", "value"]
        ],
        description: "",
        process: function(client, message, params)
        {

        }
    },
    "": {
        usages: [
            []
        ],
        description: "",
        process: function(client, message, suffix)
        {
        }
    }
};