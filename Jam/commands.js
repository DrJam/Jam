var me = require("./me.js");

var commands = {
    "ping": {
        usages: [
            []
        ],
        description: "Replies with \"Pong!\", good for testing bot responsiveness.",
        process: function(client, message, usage)
        {
            client.reply(message, "Pong!");
        }
    },
    "servers": {
        usages: [
            []
        ],
        description: "Lists the servers the bot is connected to.",
        process: function(client, message, usage)
        {
            client.sendMessage(message.channel, client.servers);
        }
    },
    "myid": {
        usages: [
            []
        ],
        description: "Shows the User ID of the sender",
        process: function(client, message, usage)
        {
            client.sendMessage(message.channel, message.author.id);
        }
    },
    "idle": {
        usages: [
            []
        ],
        description: "Sets the bot's status to Idle",
        process: function(client, message, usage)
        {
            client.setStatusIdle();
        }
    },
    "online": {
        usages: [
            []
        ],
        description: "Sets the bot's status to Online",
        process: function(client, message, usage)
        {
            client.setStatusOnline();
        }
    },
    "playing": {
        usages: [
            ["status"]
        ],
        description: "Sets the bot's playing status",
        process: function (client, message, usage) {
            if (usage.parameters.status.length > 0) {
                client.setPlayingGame(usage.parameters.status);
                client.sendMessage(message.channel, "Playing status set to `" + usage.parameters.status + "`");
            } else {
                client.setPlayingGame(null);
                client.sendMessage(message.channel, "Playing status cleared");
            }
        }
    },
    "permissions": {
        usages: [
            ["action"],
            ["action", "command", "target", "value"]
        ],
        description: "",
        process: function(client, message, usage)
        {

        }
    },
    "me": {
        usages: [
            [],
            ["field"],
            ["field", "value"]
        ],
        description: "",
        process: function (client, message, usage, meFileHandler) {
            console.log("me");
            if (usage == null) {
                console.log("Incorrect usage");
                return;
            }
            client.sendMessage(message.channel, me.handle(message, usage, meFileHandler));
            return;
        }
    },
    "": {
        usages: [
            []
        ],
        description: "",
        process: function (client, message, usage) {
        }
    }
};

module.exports = commands;