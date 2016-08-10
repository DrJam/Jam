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
    },/*
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
    },*/
    "me": {
        usages: [
            [],
            ["field"],
            ["field", "value"]
        ],
        description: "__This command has 3 modes:__\n"+
            ":small_blue_diamond: **With no arguments**: Replies with information you set up before.\n"+
            ":small_blue_diamond: **With one argument**: Deletes a field in your information.\n"+
            ":small_blue_diamond: **With two arguments**: Adds or edits a field in your information. You can add spaces in the arguments by enclosing them with \"\". For example `.me Roles \"Mid > Carry > Pudge > rest\"`",
        process: function (client, message, usage, dataHandlers) {
            client.sendMessage(message.channel, me.handle(message, usage, dataHandlers.me));
            return;
        },
        permissions: { global: true }
    },
    "lookup": {
        usages: [
            ["name"]
        ],
        description: "Finds the specified user's info.",
        process: function (client, message, usage, dataHandlers) {
            client.sendMessage(message.channel, me.lookup(message, usage, dataHandlers.me));
            return;
        }
    },
    "played": {
        usages: [
            []
        ],
        description: "Replies with which games the user has played for how long.",
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
        },
        permissions: { global: true }
    },
    "donate": {
        usages: [
            []
        ],
        description: "gives a donation link, all profits go to the hosting of me.",
        process: function (client, message, usage) {
            client.sendMessage(message.channel, "Donate towards bot upkeep here: <https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4XCZN4NU3A94L>")
        }
    },
    "help": {
        usages: [
            [],
            ["command"]
        ],
        description: "This command provides help of a specified command. If the target command is omitted, it just gives some info",
        process: function (client, message, usage) {
            var output = "";
            if(usage.usageid == 0){
                output = "**Type \".help\" followed by a space and another of my commands to get help about it!**\n I have the following commands available:";
                for(var i in commands)
                {
                    output+="\n:small_blue_diamond: ."+i;
                }
            }
            if(usage.usageid == 1){
                var target = usage.parameters["command"];
                if(target.startsWith("."))//remove prefix if supplied
                    target =  target.substr(1);
                if(commands[target] != undefined){
                    try{
                        output = commands[target].description;
                    }
                    catch(E){
                        output = "@Harb or Dan fucked up.";
                    }
                }else{
                output = "I don't have help (yet) on that command."
                }
                
            }
            client.sendMessage(message.channel, output);
        }
    },
    "jam": {
        usages: [
            []
        ],
        description: "Gives some information about the bot.",
        process: function (client, message, usage) {
            client.sendMessage(message.channel, "GitHub: <https://github.com/DrJam/Jam>" + "\n"
                + "Development Portal: <https://tree.taiga.io/project/drjam-jam/kanban>");
        }
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