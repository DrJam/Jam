var me = require("./me.js");

var commands = {
    "ping": {
        usages: [
            []
        ],
        description: "Replies with \"Pong!\", good for testing bot responsiveness.",
        process: function (client, message, usage) {
            client.reply(message, "Pong!");
        },
        permissions: { global: true }
    },
    "servers": {
        usages: [
            []
        ],
        description: "Lists the servers the bot is connected to.",
        process: function(client, message, usage)
        {
            client.sendMessage(message.channel, client.servers);
        },
        permissions: { global: true }
    },
    "myid": {
        usages: [
            []
        ],
        description: "Shows the User ID of the sender",
        process: function(client, message, usage)
        {
            client.sendMessage(message.channel, message.author.id);
        },
        permissions: { global: true }
    },
    "idle": {//why do we even have this, or reserve this for developers.
        usages: [
            []
        ],
        description: "Sets the bot's status to Idle",
        process: function(client, message, usage)
        {
            client.setStatusIdle();
        },
        permissions: { global: false }
    },
    "online": {
        usages: [
            []
        ],
        description: "Sets the bot's status to Online",
        process: function(client, message, usage)
        {
            client.setStatusOnline();
        },
        permissions: { global: false }
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
        },
        permissions: { global: false }
    },
    "permissions": {
        usages: [
            ["action"],
            ["action", "command", "target", "value"]
        ],
        description: "",
        process: function(client, message, usage)
        {

        },
        permissions: { global: false }
    },
    "me": {
        usages: [
            [],
            ["field"],
            ["field", "value"]
        ],
        description: "",
        process: function (client, message, usage, DATA) {
            console.log("me");
            var meFileHandler = DATA["me"];
            client.sendMessage(message.channel, me.handle(message, usage, meFileHandler));
            return;
        },
        permissions: { global: true }
    },
    "played": {
        usages: [
            []
        ],
        description: "replies with which games the user has played for how long.",
        process: function (client, message, usage, DATA) {
            var data = DATA["games"].data["users"][message.author.id];
            if (data == undefined || Object.keys(data).length == 0) {
                client.sendMessage(message.channel,"I have not seen you play any games.")
            } else {
                var output = "I have seen you play the following game(s):```";
                for (var key in data) {
                    output += "\n" + key + " : ";
                    if (data[key] < 1000 * 60 * 60)
                        output += Math.round(data[key] / 1000 / 60) + " minutes.";
                        else
                         output += Math.round(data[key] / 1000 / 60 / 6) / 10 + " hours.";
                }
                output += "```";
                client.sendMessage(message.channel, output);
            }
            return;//Wondering why this is here - Harb.
        },
        permissions: { global: true }
    }/*,
    "": {
        usages: [
            []
        ],
        description: "",
        process: function (client, message, usage) {
        }
    }*/
};

module.exports = commands;