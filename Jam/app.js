function loadModule(path)
{
    try {
        return require(path);
    }
    catch (E) {
        console.log("Following Error was encountered while loading `" + path + "`: " + E.message);
        process.exit();
    }
}

var Discord = loadModule('discord.js');
var authDetails = loadModule("./config/auth.json");
var commands = loadModule("./commands.js");
var params = loadModule("./params.js");
var FileHandler = loadModule("./fileHandler.js");
var gameModule = loadModule("./games.js");

var client = new Discord.Client();
var PREFIX = ",";

global.startTime = Date.now();
var meFileHandler = new FileHandler("./data/data.json");
var gamesFileHandler = new FileHandler("./data/games.json");
var DATA = { me: meFileHandler, games: gamesFileHandler };

client.on("ready",
    function() {
        console.log("Ready. Serving " + client.channels.length + " channels.");
        meFileHandler.load();
//        meFileHandler.startSaveTimer();
        gamesFileHandler.load();
//        gamesFileHandler.startSaveTimer();
    });

client.on("disconnected",
    function() {
        console.log("Disconnected!");
        process.exit(1);
    });

client.on("message",
    function(message) {
        var content = message.content;
        var command;
        var suffix;

        if (message.author == client.user) {
            return;
        }

        if (!(content.startsWith(PREFIX) || content.indexOf(client.user.mention()) == 0)) {
            return;
        }

        suffix = content.split(" ");
        if (content.startsWith(PREFIX)) {
            command = suffix[0];
            command = command.slice(1);
        } else {
            command = suffix[1];
        }
        suffix.splice(0, 1);
        suffix = suffix.join(" ");

        if (!commands.hasOwnProperty(command)) {
            return;
        }

        console.log();
        console.log(message.server.name + " | " + message.author.name + "#" + message.author.discriminator + ":" + message.content);

        command = commands[command];

        var usage = params.getParams(suffix, command.usages);
        if (!usage) {
            console.log("Incorrect usage");
            client.sendMessage(message.channel, "Incorrect usage, help under development.");
            return;
        }
        console.log(usage);
        command.process(client, message, usage, DATA);
});
client.on("presence", function (oldUser, newUser) { gameModule.Update(oldUser,DATA["games"].data);});
client.on("debug", (m) => console.log("[debug]", m));
client.on("warn", (m) => console.log("[warn]", m));

client.loginWithToken(authDetails.token);