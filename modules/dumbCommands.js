var dumbCommands = function(){}//constructor, use this only to initiliase variables NEEDED to be initiliased before onReady. Note that the onReady might not occur before severl other modules have fired their onReady.
dumbCommands.prototype.Name = "dumbCommands";//string
dumbCommands.prototype.Dependencies = ["commands"];//strings
dumbCommands.prototype.onReady = function(pars){//The real constructor.
    let commands = pars.commands;
    commands.registerCommand(this,//ping
        {
            name: "ping",
            words: ["ping","test"], 
            usages: [
                []
            ],
            description: "Replies with \"Pong!\", good for testing bot responsiveness.",
            process: function (message, usage) {
                message.reply("pong!");
                return true;
            },
            permissions: { global: true }
        }
    );
    commands.registerCommand(this,//playing
        {
            name: "playing",
            words: ["playing","status"],
            usages: [
                ["status"]
            ],
            description: "Sets the bot's playing status",
            process: function (message, usage) {
                if (usage.parameters.status.length > 0) {
                    message.client.setPlayingGame(usage.parameters.status);
                    message.channel.send("Playing status set to `" + usage.parameters.status + "`");
                } else {
                    message.client.setPlayingGame(null);
                    message.channel.send("Playing status cleared");
                }
                return true;
            },
            permissions: { global: false, restricted : true }
        }
    );
    commands.registerCommand(this,//eval
        {
            name : "eval",
            words: ["eval","e"],
            usages: [
                ["expression"]
            ],
            description: "Eval is evil",
            process: function (message, usage) {
                let _output = [];
                function print(line){_output.push(line);};
                try{ let res = eval(usage.parameters.expression);}
                catch(E){print(`Following error was encountered: ${E.message}`);}
                if(_output.length>0)
                    message.channel.send(_output.join("\n"));
                else
                    message.channel.send(res);
                return true;
            },
            permissions: {global: false, restricted: true}
        }
    );
}   


module.exports = new dumbCommands();