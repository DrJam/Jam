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
meFileHandler.load();
gamesFileHandler.load();

function saveIntervalElapsed(){
    for (var key in DATA) {
        DATA[key].save();
    }
}

client.on("ready",
    function() {
        console.log("Ready. Serving " + client.channels.length + " channels.");

        setInterval(saveIntervalElapsed, 1000 * 60 * 5);
});

client.on("disconnected",
    function() {
        console.log("Disconnected!");
        process.exit(1);
    });

client.on("message",
    function(message) {
        var content = message.content;
        var command; var commandcopy;
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
    
        commandcopy = command;
        command = commands[command];

        var usage = params.getParams(suffix, command.usages);
        if (!usage) {
            console.log("Incorrect usage");
            var output = "Incorrect usage. Below is a list of supported usage(s).```";
            for (var a = 0; a < command.usages.length; a++) {
                output += "\n" + PREFIX + commandcopy;
                for (var b = 0; b < command.usages[a].length; b++) {
                    output += " <" + command.usages[a][b] + ">";
                }
            }
            output += "```";
            client.sendMessage(message.channel, output);
            return;
        }
        console.log(usage);
        command.process(client, message, usage, DATA);
    });

client.on("presence", function (oldUser, newUser) { gameModule.Update(oldUser,DATA["games"].data);});
client.on("debug", (m)=> console.log("[debug]", m));
client.on("warn", (m) => console.log("[warn]", m));

client.on("serverCreated",(m) => console.log("Joined a new server!"));//create permissions and data.
client.on("serverDeleted",(m) => console.log("Left a server!"));//delete permissions and data?

client.loginWithToken(authDetails.token);