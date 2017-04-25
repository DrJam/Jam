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
            permissions: { global: true },
            allowPrivate: true
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
                    message.client.user.setGame(usage.parameters.status);
                    message.channel.send("Playing status set to `" + usage.parameters.status + "`");
                } else {
                    message.client.user.setGame(null);
                    message.channel.send("Playing status cleared");
                }
                return true;
            },
            permissions: { global: false, restricted : true },
            allowPrivate: true
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
                let res;
                try{ res = eval(usage.parameters.expression);}
                catch(E){print(`Following error was encountered: ${E.message}`);}
                if(_output.length>0)
                    message.channel.send(_output.join("\n"));
                else
                    message.channel.send(res);
                return true;
            },
            permissions: {global: false, restricted: true},
            allowPrivate: true
        }
    );
    commands.registerCommand(this,//github
        {
            name: "github",
            words: ["github"],
            usages: [
                []
            ],
            permissions: {global:true},
            process: function(message,usage){
                message.channel.send("Source code: https://github.com/DrJam/Jam");
            },
            allowPrivate: true
        }
    );
    commands.registerCommand(this,//donate
        {
            name: "donate",
            words: ["donate", "paypal"],
            usages: [
                []
            ],
            permissions: {global:true},
            process: function(message,usage){
                message.channel.send("Donate towards bot upkeep here: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4XCZN4NU3A94L");
            },
            allowPrivate: true
        }
    );
    commands.registerCommand(this,//info
        {
            name: "info",
            words: ["info", "jam"],
            usages: [
                []
            ],
            permissions: {global:true},
            process: function(message,usage){
                message.channel.send("Hey, I am Jam.\nA Discord bot written in JavaScript.\nRight now I'm not publicly accessible, but you can host your own version of me by grabbing my source code from my github!");
            },
            allowPrivate: true
        }
    );
}   


module.exports = new dumbCommands();