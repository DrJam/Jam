try {
    var Discord = require('discord.js');
} catch (e) {
    console.log(e.stack);
    console.log("discord.js not found");
    process.exit();
}

try {
    var fs = require('fs');
} catch (e) {
    console.log(e.stack);
    console.log("fs not found");
    process.exit();
}

try {
    var wolfram = new require("./wolfram_plugin")();
} catch (e) {
    console.log("couldn't load wolfram plugin!\n" + e.stack);
}

try {
    var yt = require("./youtube_plugin");
    var youtube_plugin = new yt();
} catch (e) {
    console.log("couldn't load youtube plugin!\n" + e.stack);
}

try {
    var commands = require("./commands.js");
} catch (e) {
    console.log(e.stack);
    console.log("commands.js not found");
    process.exit();
}

var d20 = require("d20");

var startTime = Date.now();
var client = new Discord.Client();

var messageBox;

client.on("ready", function () {
    console.log("Ready. Serving " + client.channels.length + " channels.");

});

client.on("disconnected", function () {
    console.log("Disconnected!");
    process.exit(1);
});