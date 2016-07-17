try {
    var Discord = require('discord.js');
} catch (E) {
    console.log(E.stack);
    console.log("discord.js not found");
    process.exit();
}

try {
    var authDetails = require("./config/auth.json");
} catch (E) {
    console.log(E.stack);
    console.log("/config/auth.json not found");
    process.exit();
}

try {
    var commands = require("./commands.js");
} catch (E) {
    console.log(E.stack);
    console.log("commands.js not found");
    process.exit();
}

try {
    var params = require("./params.js");
} catch (E) {
    console.log(E.stack);
    console.log("params.js not found");
    process.exit();
}

try {
    var FileHandler = require("./fileHandler.js");
} catch (E) {
    console.log(E.stack);
    console.log("/datahandler.js not found");
    process.exit();
}

var client = new Discord.Client();
var PREFIX = ",";

global.startTime = Date.now();
var meFileHandler = new FileHandler("./data/data.json");

client.on("ready",
    function() {
        console.log("Ready. Serving " + client.channels.length + " channels.");
        meFileHandler.load();
        meFileHandler.startSaveTimer();
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
        command.process(client, message, usage, meFileHandler);
    });

client.on("debug", (m) => console.log("[debug]", m));
client.on("warn", (m) => console.log("[warn]", m));

client.loginWithToken(authDetails.token);