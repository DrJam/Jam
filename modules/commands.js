var me = require("./me.js");
var roleManager = require("./iam.js");
var permissions = require("./permissionCommands.js");

var commands = {
    "ping": {
		name: "ping",
        usages: [
            []
        ],
        description: "Replies with \"Pong!\", good for testing bot responsiveness.",
        process: function (client, message, usage) {
            message.reply("Pong!");
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
            message.channel.send("These are the servers I'm connected to:\n"+client.guilds.map((k)=>{return k}).join(",\n"));
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
            message.channel.send( `This is your id: **${message.author.id}**`);
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
                client.user.setPresence({game:{name:usage.parameters.status}});
                message.channel.send( "Playing status set to `" + usage.parameters.status + "`");
            } else {
                client.user.setPresence({game:{name:""}});
                message.channel.send( "Playing status cleared");
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
            message.channel.send( me.handle(message, usage, dataHandlers.me));
            return true;
        },
        permissions: { global: true }
    },
    "lookup": {
		name: "lookup",
        usages: [
            ["@mention"]
        ],
        description: "Finds the specified user's info.",
        process: function (client, message, usage, dataHandlers) {
            if(message.mentions.users.array().length>0){
                message.channel.send( me.getMe(message.mentions.users.first(), dataHandlers.me.data));
                return true;
            }
            return false;
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
        process: function (client, message, usage,dataHandlers) {
            var output = "";
            if(usage.usageid == 0){
                var returnal = permissions.help(permissions,message,dataHandlers.permissions.data);
                if(returnal.length>0){
                    output = "**Type \".help\" followed by a space and another of my commands to get help about it!**\n You can utilise the following commands available:";
                    for(var i in returnal)
                    {
                        output+="\n:small_blue_diamond: ."+returnal[i];
                    }
                }else
                {
                    output = "It seems like you cannot utilise any of my commands, contact the server owner (or someone else in charge of permissions) if you believe to see this message incorrectly.";
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
            message.channel.send( output);
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
            message.channel.send( "I am a coproduct of Dan and Harb.\n my GitHub: <https://github.com/DrJam/Jam>");
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
            if(message.mentions.users.array().length>0){
                if(message.mentions.users.first().avatarURL!=null){
                    message.channel.send(message.mentions.users.first().avatarURL);
                }else{
                    message.channel.send("That user has no avatar set yet.");
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
        description: "Assigns you a self assignable role. Use .listroles for a list of assignable roles.",
        process: function (client, message, usage,dataHandlers) {
            var result = roleManager.iam(message,usage.parameters["role"],dataHandlers.roles.data);
            if(result)
                message.channel.send(`Alright, you now have the "${usage.parameters["role"]}" role!`);
            else
                message.channel.send(`I couldn't find a role named liked that in my list of assignable roles. Use .listroles for a list of assignable roles.`);
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
            message.channel.send( result.message)
            return true;
        },
        permissions: {global: true }
    },
    "giverole": {
		name: "giverole",
        usages: [
            ["@mention","role"]
        ],
        description: "Assigns the mentioned user an assignable role. Use .listgiveroles for a list of assignable roles.",
        process: function (client, message, usage,dataHandlers) {
             if(message.mentions.users.array().length > 0)
                {
                    target = message.mentions.users.first();
                    target = message.guild.member(target);
                }
                else
                    return false;
            try{
                let result = roleManager.theyam(message,usage.parameters["role"],target,dataHandlers.roles.data);
                if(result)
                message.channel.send(`Alright, They now have the "${usage.parameters["role"]}" role!`);
            else
                message.channel.send(`I couldn't find a role named liked that in my list of assignable roles. Use .listgiveroles for a list of assignable roles.`);
            }
            catch(e){
                message.channel.send("Something went wrong!");
            }
            return true;
        },
        permissions: { global: false }
    },
    "takerole":{
        name: "takerole",
        usages: [
            ["@mention","role"]
        ],
        description: "Removes the assignable role from the mentioned user.",
        process: function(client, message, usage, dataHandlers){
            if(message.mentions.users.array().length > 0)
                {
                    target = message.mentions.users.first();
                    target = message.guild.member(target);
                }
                else
                    return false;
            try{
                result = roleManager.theyamnot(message,usage.parameters["role"],target, dataHandlers.roles.data)
                message.channel.send( result.message);
            }catch(e){
                message.channel.send( "Something went wrong!");
            }
            return true;
        },
        permissions: {global: false }
    },
    "listroles": {
		name: "listroles",
        usages: [
            []
        ],
        description: "Returns the list of self assignable roles.",
        process: function (client, message, usage,dataHandlers) {
            message.channel.send(roleManager.lsar(message,dataHandlers.roles.data));
            return true;
        },
        permissions: { global: true }
    },
    "asar": {
		name: "asar",
        usages: [
            ["role"]
        ],
        description: "Adds a role to the list of self assignable roles.",
        process: function (client, message, usage,dataHandlers) {
            message.channel.send(roleManager.asar(message,usage.parameters["role"], dataHandlers.roles.data));
            return true;
        },
        permissions: { global: false }
    },
     "dsar": {
		name: "dsar",
        usages: [
            ["role"]
        ],
        description: "Removes a role to the list of self assignable roles.",
        process: function (client, message, usage,dataHandlers) {
            message.channel.send(roleManager.dsar(message,usage.parameters["role"], dataHandlers.roles.data));
            return true;
        },
        permissions: { global: false }
    },
    "listgiveroles": {
		name: "listgiveroles",
        usages: [
            []
        ],
        description: "Returns the list of assignable roles (with .giverole).",
        process: function (client, message, usage,dataHandlers) {
            message.channel.send(roleManager.loar(message,dataHandlers.roles.data));
            return true;
        },
        permissions: { global: false }
    },
    "aoar": {
		name: "aoar",
        usages: [
            ["role"]
        ],
        description: "Adds a role to the list of mod assignable roles.",
        process: function (client, message, usage,dataHandlers) {
            message.channel.send(roleManager.aoar(message,usage.parameters["role"], dataHandlers.roles.data));
            return true;
        },
        permissions: { global: false }
    },
    "doar": {
		name: "doar",
        usages: [
            ["role"]
        ],
        description: "Removes a role to the list of assignable roles.",
        process: function (client, message, usage,dataHandlers) {
            message.channel.send(roleManager.doar(message,usage.parameters["role"], dataHandlers.roles.data));
            return true;
        },
        permissions: { global: false }
    },
    "listautoroles" : {
        name: "listautoroles",
        usages: [
            []
        ],
        description: "Lists all automatically assigned roles.",
        process: function(client, message, usage, dataHandlers)
        {
            message.channel.send(roleManager.laar(message,dataHandlers.roles.data));
            return true;
        },
        permissions: {global: false}
    },
    "aaar": {
		name: "aaar",
        usages: [
            ["role"]
        ],
        description: "Adds a role to the list of auto assigned roles.",
        process: function (client, message, usage,dataHandlers) {
            message.channel.send(roleManager.aaar(message,usage.parameters["role"], dataHandlers.roles.data));
            return true;
        },
        permissions: { global: false }
    },
    "daar": {
		name: "daar",
        usages: [
            ["role"]
        ],
        description: "Removes a role to the list of auto assigned roles.",
        process: function (client, message, usage,dataHandlers) {
            message.channel.send(roleManager.daar(message,usage.parameters["role"], dataHandlers.roles.data));
            return true;
        },
        permissions: { global: false }
    },
    "blacklist": {
        name: "blacklist",
        usages: [
            ["command"],
            ["command", "true/false"]
        ],
        description: "Gets or sets whether or not the specified command uses a blacklist.",
        process: function (client, message, usage, dataHandlers) {
            var result;
            if(usage.usageid == 0)
                result = permissions.getBlacklist(permissions, message, usage.parameters.command, dataHandlers.permissions.data);
            else
                result = permissions.blacklist(permissions, message, usage.parameters.command, usage.parameters["true/false"], dataHandlers.permissions.data)
            if(result.value)
                message.channel.send( result.message);
            return result.value
        },
        permissions: { global: false }
    },
    "roleperms": {
        name: "roleperms",
        usages: [
            ["command", "add/remove", "role"]
        ],
        description: "Adds or removes a role to a command. What that does exactly depends on whether or not this command is using a blacklist or not.",
        process: function (client, message, usage, dataHandlers) {
            var result;
            switch(usage.parameters["add/remove"].toLowerCase())
            {
                case "add": case "+":
                    result = permissions.addRole(permissions, message, usage.parameters.command, usage.parameters.role, dataHandlers.permissions.data);
                    break;
                case "remove": case "delete": case "rem": case "del": case "-"://added a few overloads
                    result = permissions.deleteRole(permissions, message, usage.parameters.command, usage.parameters.role, dataHandlers.permissions.data);
                    break;
                default: result = {"value": false}; break;
            }
            if(result.value)
                message.channel.send( result.message);
            return result.value;
        },
        permissions: { global: false }
    },
    "userperms": {
        name: "userperms",
        usages: [
            ["command", "mention"],
            ["command", "mention", "allow/deny"]
        ],
        description: "Removes a user's explicit permissions for a command or adds them. These permission override role restrictions.",
        process: function (client, message, usage, dataHandlers) {
            var result;
            switch(usage.usageid)
            {
                case 1:
                    result = permissions.addUser(permissions, message, usage.parameters.command, usage.parameters["allow/deny"], dataHandlers.permissions.data);
                    break;
                case 0:
                    result = permissions.deleteUser(permissions, message, usage.parameters.command, dataHandlers.permissions.data);
                    break;
            }
            if(result.value)
                message.channel.send( result.message,{disableEveryone : true});
            return result.value;
        },
        permissions: { global: false }
    },
    "ignoredroles":{
        name: "ignoredroles",
        usages : [
            [],
            ["add/remove", "role"]
        ],
        description: "Removes a role from the ignored roles list, or adds one to it. Roles on this list are ignored when checking the maximum permission for a user.",
        process: function(client, message, usage, dataHandlers)
        {
            var result;
            if(usage.usageid == 0)
                result = permissions.listIgnoredRoles(message,dataHandlers.permissions.data);
            else{
                switch(usage.parameters["add/remove"].toLowerCase())
                {
                    case "add": case "+":
                        result = permissions.addIgnoredRole(permissions, message, usage.parameters.role, dataHandlers.permissions.data);
                        break;
                    case "remove": case "delete": case "rem": case "del": case "-":
                        result = permissions.removeIgnoredRole(permissions, message, usage.parameters.role, dataHandlers.permissions.data);
                        break;
                    default: result = {"value": false}; break;
                }
            }
            if(result.value)
                message.channel.send( result.message);
            return result.value;
        },
        permissions: {global: false}

    },
    "resetperms": {
        name: "resetperms",
        usages: [
            ["command"]
        ],
        description: "Resets all permissions for a command",
        process: function (client, message, usage, dataHandlers) {
            var result = permissions.reset(permissions,message, usage.parameters.command, dataHandlers.permissions.data)
            if(result.value)
                message.channel.send( result.message);
            return result.value;
        },
        permissions: { global: false }
    },
    "listperms": {
        name: "listperms",
        usages: [
            ["command"]
        ],
        description: "Lists all permissions for a command",
        process: function (client, message, usage, dataHandlers) {
            var result = permissions.list(permissions,message, usage.parameters.command, dataHandlers.permissions.data)
            if(result.value)
                message.channel.send( result.message);
            return result.value;
        },
        permissions: { global: false }
    },
    "eval" : {
        name : "eval",
        usages: [
            ["expression"]
        ],
        description: "Eval is evil",
        process: function (client, message, usage, dataHandlers) {
            var _output = [];
            function print(line){_output.push(line);};
            try{eval(usage.parameters.expression);}
            catch(E){print(`Following error was encountered: ${E.message}`);}
            if(_output.length>0)
                message.channel.send(_output.join("\n"));
            else
                message.channel.send( "No output.");
            return true;
        },
        permissions: {global: false, restricted: true}
    }
    /*,
    "": {
        name: "",
        usages: [
            []
        ],
        description: "",
        process: function (client, message, usage, dataHandlers) {
        },
        permissions: { global: true }
    }
    */
};

permissions.commands = commands;

module.exports = commands;