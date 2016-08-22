var me = require("./me.js");
var roleManager = require("./iam.js")

var commands = {
    "ping": {
		name: "ping",
        usages: [
            []
        ],
        description: "Replies with \"Pong!\", good for testing bot responsiveness.",
        process: function (client, message, usage) {
            client.reply(message, "Pong!");
            return true;
        },
        permissions: { global: true }
    },
    "servers": {
		name: "servers",
        usages: [
            []
        ],
        description: "Lists the servers the bot is connected to.",
        process: function (client, message, usage) {
            client.sendMessage(message.channel, "These are the servers I'm connected to:\n"+client.servers);
            return true;
        },
        permissions: { global: true, restricted: true }
    },
    "myid": {
		name: "myid",
        usages: [
            []
        ],
        description: "Shows the User ID of the sender",
        process: function (client, message, usage) {
            client.sendMessage(message.channel, `This is your id: **${message.author.id}**`);
            return true;
        },
        permissions: { global: true, restricted : true }
    },
    "playing": {
		name: "playing",
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
            return true;
        },
        permissions: { global: false, restricted : true }
    },
    "me": {
		name: "me",
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
            return true;
        },
        permissions: { global: true }
    },
    "lookup": {
		name: "lookup",
        usages: [
            ["name"]
        ],
        description: "Finds the specified user's info.",
        process: function (client, message, usage, dataHandlers) {
            client.sendMessage(message.channel, me.lookup(message, usage, dataHandlers.me));
            return true;
        },
        permissions: { global: true }
    },
    "played": {
		name: "played",
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
                        if (days > 1) 
                            output += " " + days + " days";
                        if(days == 1)
                            output += " 1 day";
                        if(minutes==0 && days>0)
                            output += " and"
                        if (hours > 1)
                            output += " " + hours + " hours";
                        if(hours == 1)
                            output += " 1 hour";
                        if(days+hours > 0)
                            output += " and"
                        if (mins > 1)
                            output += " " + mins + " minutes";
                        if(mins == 1)
                            output += " 1 minute";
                        output += "."
                    }
                    output += "```";
                } else {
                    output = "I have not seen you play any games long enough to be relevant.";
                }
                client.sendMessage(message.channel, output);
                return true;
            }
        },
        permissions: { global: true }
    },


    "donate": {
		name: "donate",
        usages: [
            []
        ],
        description: "gives a donation link, all profits go to the hosting of me.",
        process: function (client, message, usage) {
            client.sendMessage(message.channel, "Donate towards bot upkeep here: <https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4XCZN4NU3A94L>")
            return true;
        },
        permissions: { global: true }
    },
    "help": {
		name: "help",
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
            return true;
        },
        permissions: { global: true }
    },
    "jam": {
		name: "jam",
        usages: [
            []
        ],
        description: "Gives some information about the bot.",
        process: function (client, message, usage) {
            client.sendMessage(message.channel, "GitHub: <https://github.com/DrJam/Jam>" + "\n"
                + "Development Portal: <https://tree.taiga.io/project/drjam-jam/kanban>");
                return true;
        },
        permissions: { global: true }
    },
    "avatar": {
		name: "avatar",
        usages: [
            ["mention"]
        ],
        description: "Gives the url of the avatar of the mentioned user.",
        process: function (client, message, usage) {
            if(message.mentions.length>0){
                if(message.mentions[0].avatarURL!=null){
                    client.sendMessage(message.channel,message.mentions[0].avatarURL);
                }else{
                    client.sendMessage(message.channel,"That user has no avatar set yet.");
                }
                return true;
            }else{
                return false;
            }
        },
        permissions: { global: true }
    },
    "iam": {
		name: "iam",
        usages: [
            ["role"]
        ],
        description: "Assigns you a self assignable role. User .listroles for a list of assignable roles.",
        process: function (client, message, usage,dataHandlers) {
            var result = roleManager.iam(message,usage.parameters["role"],dataHandlers.roles.data);
            if(result)
                client.sendMessage(message.channel,`Alright, you now have the "${usage.parameters["role"]}" role!`);
            else
                client.sendMessage(message.channel,`I couldn't find a role named liked that in my list of assignable roles. Use .lsar for a list of assignable roles.`);
            return true;
        },
        permissions: { global: true }
    },
    "iamnot":{
        name: "iamnot",
        usages: [
            ["role"]
        ],
        description: "Removes a self assignable role from you.",
        process: function(client, message, usage, dataHandlers){
            result = roleManager.iamnot(message,usage.parameters["role"], dataHandlers.roles.data)
            client.sendMessage(message.channel, result.message)
            return true;
        },
        permissions: {global: true }
    },
    "whatami": {
		name: "whatami",
        usages: [
            [],
            ["mention"]
        ],
        description: "Returns the list of all the self assignable roles of you or your target.",
        process: function (client, message, usage,dataHandlers) {
            var temp = message.author;
            if(usage.usageid == 1)
                if(mesage.mentions.length > 0)
                    temp = message.mentions[0];
                else
                    return false;
            client.sendMessage(message.channel,roleManager.whatami(message,temp,dataHandlers.roles.data));
            return true;
        },
        permissions: { global: true }
    },
    "listroles": {
		name: "listroles",
        usages: [
            []
        ],
        description: "Returns the list of self assignable roles.",
        process: function (client, message, usage,dataHandlers) {
            client.sendMessage(message.channel,roleManager.lsar(message,dataHandlers.roles.data));
            return true;
        },
        permissions: { global: true }
    },
    "addrole": {
		name: "addrole",
        usages: [
            ["role"]
        ],
        description: "Adds a role to the list of self assignable roles.",
        process: function (client, message, usage,dataHandlers) {
            client.sendMessage(message.channel,roleManager.asar(message,usage.parameters["role"], dataHandlers.roles.data));
            return true;
        },
        permissions: { global: false }
    },
    "removerole": {
		name: "removerole",
        usages: [
            ["role"]
        ],
        description: "Removes a role to the list of self assignable roles.",
        process: function (client, message, usage,dataHandlers) {
            client.sendMessage(message.channel,roleManager.dsar(message,usage.parameters["role"], dataHandlers.roles.data));
            return true;
        },
        permissions: { global: false }
    }/*,
    "": {
        usages: [
            []
        ],
        description: "",
        process: function (client, message, usage) {
        },
        permissions: { global: true }
    }
    */
};

module.exports = commands;