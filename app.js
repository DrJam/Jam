function loadModule(path)
{
    try {
        return require(path);
    }
    catch (E) {
        console.log("Following Error was encountered while loading `" + path + "`: " + E.message);
        //process.exit();
    }
}

function saveIntervalElapsed(){
    for (var key in dataHandlers) {
        dataHandlers[key].save();
    }
}

var Discord = loadModule('discord.js');
var FileHandler = loadModule("./modules/fileHandler.js");

var commands = loadModule("./modules/commands.js");
var params = loadModule("./modules/params.js");
var game = loadModule("./modules/games.js");
var emoji = loadModule("./modules/emoji.js");

var auth = loadModule("./config/auth.json");
var config = loadModule("./config/config.json");
config.startTime = Date.now();

var dataHandlers = { 
    me: new FileHandler("./data/data.json"), 
    games: new FileHandler("./data/games.json") 
};

for (var key in dataHandlers) {
    dataHandlers[key].load();
}

var clientConfig = { autoReconnect: true };
var client = new Discord.Client(clientConfig);

client.on("ready", function() {
    console.log("Ready. Serving " + client.channels.length + " channels.");

    setInterval(saveIntervalElapsed, 1000 * 60 * config.saveInterval);
});

client.on("disconnected", function() {
    console.log("Disconnected!");
});

client.on("message", function(message) {
    if (message.author == client.user)
        return;

    if (emoji.check(emoji, client, message, config)) {
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

    console.log();
    console.log(message.server.name + " | #" + message.channel.name + " | " 
        + message.author.name + "#" + message.author.discriminator + ":" + message.content);
        
    commandObj = commands[prefix];

    var usage = params.getParams(suffix, commandObj.usages);
    if (!usage) {
        console.log("Incorrect usage");
        var output = "Incorrect usage. Below is a list of supported usage(s).```";
        for (var uIndex = 0; uIndex < commandObj.usages.length; uIndex++) {
            output += "\n" + config.prefix + prefix;
            for (var pIndex = 0; pIndex < commandObj.usages[uIndex].length; pIndex++) {
                output += " <" + commandObj.usages[uIndex][pIndex] + ">";
            }
        }
        output += "```";
        client.sendMessage(message.channel, output);
        return;
    }
    console.log(usage);
    commandObj.process(client, message, usage, dataHandlers);
});

client.on("serverNewMember", function (server, user) {
    try {
        var role = server.roles.get("name", "Dota");
        var user = server.members.get("id", user.id);
    } catch (e) {
        console.log(e);
    }
    client.addMemberToRole(user, role);
    var logsChannel = server.channels.get("name", "logs");    
    client.sendMessage(logsChannel, user.name + " joined the server, gave role Dota");
});

client.on("presence", function (oldUser, newUser) {
    game.Update(oldUser,dataHandlers["games"].data);
});

client.on("debug", (m)=> console.log("[debug]", m));
client.on("warn", (m) => console.log("[warn]", m));
client.on("error", (m) => console.log("[error]", m));

client.on("serverCreated", function(server) {
    console.log("Joined server: " + server.name);
});

client.on("serverDeleted", function(server) {
    console.log("Left server: " + server.name);
});

client.loginWithToken(auth.token);