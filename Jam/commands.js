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
        process: function (client, message, usage) {
            client.sendMessage(message.channel, client.servers);
        },
        permissions: { global: true }
    },
    "myid": {
        usages: [
            []
        ],
        description: "Shows the User ID of the sender",
        process: function (client, message, usage) {
            client.sendMessage(message.channel, message.author.id);
        },
        permissions: { global: true }
    },
    "idle": {
//why do we even have this, or reserve this for developers.
        usages: [
            []
        ],
        description: "Sets the bot's status to Idle",
        process: function (client, message, usage) {
            client.setStatusIdle();
        },
        permissions: { global: false }
    },
    "online": {
        usages: [
            []
        ],
        description: "Sets the bot's status to Online",
        process: function (client, message, usage) {
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
        process: function (client, message, usage) {

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
                client.sendMessage(message.channel, "I have not seen you play any games.")
            } else {
                var output = "I have seen you play the following game(s):```";
                var copy = [];
                for (var key in data) {
                    if (data[key] > 60000) {
                        copy.push({ name: key, time: data[key] })
                    }
                }
                if (copy.length != 0) {
                    copy.sort(function (x, y) { return y.time - x.time; });
                    for (var a = 0; a < copy.length && a < 10; a++) {
                        output += "\n" + copy[a].name + " :";
                        var msec = copy[a].time;
                        var days = Math.floor(msec / 1000 / 60 / 60 / 24);
                        msec -= days * 1000 * 60 * 60 * 24;
                        var hours = Math.floor(msec / 1000 / 60 / 60);
                        msec -= hours * 1000 * 60 * 60;
                        var mins = Math.floor(msec / 1000 / 60);
                        if (days > 0) {
                            output += " " + days + " days";
                        }
                        if (hours > 0) {
                            output += " " + hours + " hours";
                        }
                        if (mins > 0) {
                            output += " " + mins + " minutes";
                        }
                        output += "."
                    }
                    output += "```";
                } else {
                    output = "I have not seen you play any games long enough to be relevant.";
                }
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