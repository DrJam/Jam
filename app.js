function loadModule(path)
{
    try {
        var mod = require(path);
        if(mod.events != undefined && mod.events != null)
        {
            var counter  = 0;
            for(var i in mod.events){
                if(events[i]== undefined){events[i] = [];}
                events[i].push([mod,mod.events[i]]);
                counter++;
            }
            console.log(`Registered ${counter} event(s) for ${path}`);
        }
        return mod;
    }
    catch (E) {
        console.log("Following Error was encountered while loading `" + path + "`: " + E.message);
        process.exit();
    }
}

function saveIntervalElapsed(){
    console.log(`[${new Date().toLocaleTimeString('en-GB',{hour12:false,timeZoneName:'short'})}] FH: Saving data.`)
    for (var key in dataHandlers) {
        dataHandlers[key].save();
    }
}

var events = {};

var Discord = loadModule('discord.js');
var FileHandler = loadModule("./modules/fileHandler.js");

var commands = loadModule("./modules/commands.js");
var params = loadModule("./modules/params.js");
var game = loadModule("./modules/games.js");
//var emoji = loadModule("./modules/emoji.js");
var roleManager =  loadModule("./modules/rolemanager.js");
var permissions = loadModule("./modules/permissions.js");

var auth = loadModule("./config/auth.json");
var config = loadModule("./config/config.json");
config.startTime = Date.now();

permissions.commands = commands;
permissions.config = config; //neater solution needed

var dataHandlers = { 
    me: new FileHandler("./data/data.json"), 
    games: new FileHandler("./data/games.json"),
    roles: new FileHandler("./data/roles.json"),
    permissions : new FileHandler("./data/permissions.json") 
};
for (var key in dataHandlers) {
    dataHandlers[key].load();
}

permissions.data = dataHandlers.permissions.data;
roleManager.data = dataHandlers.roles.data;

var clientConfig = { autoReconnect: true };
var client = new Discord.Client(clientConfig);

client.on("ready", function() {
    console.log("Ready. Serving " + client.guilds.array().length + " serbers.");
    setInterval(saveIntervalElapsed, 1000 * 60 * config.saveInterval);
    if(config.status != undefined)
        client.user.setPresence({game:{name:config.status}}).then(null,null);
    else
        client.user.setPresence({game:{name:"config.status is undefined!"}}).then(null,null);
    for(var i in events["ready"])
    {
        events["ready"][i][1](events["ready"][i][0],client);
    }
});

client.on("disconnected", function() {
    console.log(`[${new Date().toLocaleTimeString('en-GB',{hour12:false,timeZoneName:'short'})}] Disconnected!`);
        for(var i in events["disconnected"])
    {
        events["disconnected"][i][1](events["disconnected"][i][0],client);
    }
});

client.on("message", function(message) {
    if(message.guild == undefined)//we do not handle private messages! (Yet)
        return;
    for(var i in events["message"])
    {
        events["message"][i][1](events["message"][i][0],client,message);
    }
    if (message.author == client.user || message.author.bot)
        return;

    if (message.content.toLowerCase() === "ayy") {
        message.channel.sendMessage("lmao");
        return;
    }

    if (!message.content.startsWith(config.prefix))
        return;

    var contentArray = message.content.split(" ");
    var prefix = contentArray.splice(0, 1)[0];
    prefix = prefix.substring(1);
    var suffix = contentArray.join(" ");

    if (!commands.hasOwnProperty(prefix)) 
        return;

    console.log(`[${new Date().toLocaleTimeString('en-GB',{hour12:false,timeZoneName:'short'})}] COMMAND: `+message.guild.name + " | #" + message.channel.name + " | " 
        + message.author.username + "#" + message.author.discriminator + ":" + message.content);
        
    commandObj = commands[prefix];
    if(permissions.hasPermissions(permissions, message.guild, message.author,commandObj)){
        var usage = params.getParams(suffix, commandObj.usages);
        if (!usage || !commandObj.process(client, message, usage, dataHandlers)) {
            console.log("Incorrect usage");
            var output = "Incorrect usage. Below is a list of supported usage(s) or try \""+config.prefix+"help "+prefix+"\".```";
            for (var uIndex = 0; uIndex < commandObj.usages.length; uIndex++) {
                output += "\n" + config.prefix + prefix;
                for (var pIndex = 0; pIndex < commandObj.usages[uIndex].length; pIndex++) {
                    output += " <" + commandObj.usages[uIndex][pIndex] + ">";
                }
            }
            output += "```";
            message.channel.sendMessage(output);
            return;
        }
    }else{//no permissions.
        message.channel.sendMessage("sorry, ur not cool enough for that command");
    }
});

client.on("serverNewMember", function (server, user) {
    for(var i in events["serverNewMember"])
    {
        events["serverNewMember"][i][1](events["serverNewMember"][i][0],client,server,user);
    }
});

client.on("presenceUpdate", function (oldUser, newUser) {
    for(var i in events["presence"])
    {
        events["presence"][i][1](events["presence"][i][0],client,oldUser,newUser);
    }
    game.Update(oldUser,dataHandlers["games"].data);
});

//start boring code
client.on("debug", function(message){
    for(var i in events["debug"])
    {
        events["debug"][i][1](events["debug"][i][0],client,message);
    }
});
client.on("warn", function(message){
    for(var i in events["warn"])
    {
        events["warn"][i][1](events["warn"][i][0],client,message);
    }
    console.log(`[${new Date().toLocaleTimeString('en-GB',{hour12:false,timeZoneName:'short'})}] WARN: ${message}`);
});
client.on("error", function(message){
    for(var i in events["error"])
    {
        events["error"][i][1](events["error"][i][0],client,message);
    }
    console.log(`[${new Date().toLocaleTimeString('en-GB',{hour12:false,timeZoneName:'short'})}] ERROR: ${message}`);
});

client.on("serverCreated", function(server) {
    for(var i in events["serverCreated"])
    {
        events["serverCreated"][i][1](events["serverCreated"][i][0],client,server);
    }
    console.log(`[${new Date().toLocaleTimeString('en-GB',{hour12:false,timeZoneName:'short'})}] SERVER CREATED: ${server.name}`);;
});

client.on("serverDeleted", function(server) {
    for(var i in events["warn"])
    {
        events["warn"][i][1](events["warn"][i][0],client,server);
    }
});

client.on("messageDeleted",function (message, channel) {
    for(var i in events["messageDeleted"])
    {
        events["messageDeleted"][i][1](events["messageDeleted"][i][0],client,message,channel);
    }
});

client.on("messageUpdated", function (oldMessage, newMessage) {
    for(var i in events["messageUpdated"])
    {
        events["messageUpdated"][i][1](events["messageUpdated"][i][0],client,oldMessage,newMessage);
    }
});

client.on("serverUpdated", function (oldServer, newServer) {
    for(var i in events["serverUpdated"])
    {
        events["serverUpdated"][i][1](events["serverUpdated"][i][0],client,oldServer,newServer);
    }
});

client.on("channelCreated",function(channel){
    for(var i in events["channelCreated"])
    {
        events["channelCreated"][i][1](events["channelCreated"][i][0],client,channel)
    }
});

client.on("channelDeleted",function(channel){
    for(var i in events["channelDeleted"])
    {
        events["channelDeleted"][i][1](events["channelDeleted"][i][0],client,channel)
    }
});

client.on("channelUpdated",function(oldChannel,newChannel){
    for(var i in events["channelUpdated"])
    {
        events["channelUpdated"][i][1](events["channelUpdated"][i][0],client,oldChannel,newChannel)
    }
});

client.on("serverRoleCreated",function(role){
    for(var i in events["serverRoleCreated"])
    {
        events["serverRoleCreated"][i][1](events["serverRoleCreated"][i][0],client,role)
    }
});

client.on("serverRoleDeleted",function(role){
    for(var i in events["serverRoleDeleted"])
    {
        events["serverRoleDeleted"][i][1](events["serverRoleDeleted"][i][0],client,role)
    }
});

client.on("serverRoleUpdated",function(oldRole,newRole){
    for(var i in events["serverRoleUpdated"])
    {
        events["serverRoleUpdated"][i][1](events["serverRoleUpdated"][i][0],client,oldRole,newRole)
    }
});

client.on("serverMemberRemoved",function(server,user){
    for(var i in events["serverMemberRemoved"])
    {
        events["serverMemberRemoved"][i][1](events["serverMemberRemoved"][i][0],client,server,user)
    }
});

client.on("serverMemberUpdated",function(server,oldUser,newUser){
    for(var i in events["serverMemberUpdated"])
    {
        events["serverMemberUpdated"][i][1](events["serverMemberUpdated"][i][0],client,server,oldUser,newUser)
    }
});

client.on("userTypingStarted",function(server,user,channel){
    for(var i in events["userTypingStarted"])
    {
        events["userTypingStarted"][i][1](events["userTypingStarted"][i][0],client,user,channel)
    }
});

client.on("userTypingStopped",function(server,user,channel){
    for(var i in events["userTypingStopped"])
    {
        events["userTypingStopped"][i][1](events["userTypingStopped"][i][0],client,user,channel)
    }
});

client.on("userBanned",function(user,server){
    for(var i in events["userBanned"])
    {
        events["userBanned"][i][1](events["userBanned"][i][0],client,user,server)
    }
});
client.on("userUnbanned",function(user,server){
    for(var i in events["userUnbanned"])
    {
        events["userUnbanned"][i][1](events["userUnbanned"][i][0],client,user,server)
    }
});
//I left the following events undefined : notUpdated, voicejoin, voiceswitch, voiceleave, voicestateupdate, voicespeaking. I don't foresee a use for them any time soon.'

//end boring code

client.login(auth.token);