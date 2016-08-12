try {
    var fs = require("fs");
} catch (E) {
    console.log(E.stack);
    console.log("fs not found");
    process.exit();
}
var mod = {};
var regex = /\:(.*?)\:/g
var result;

mod.emoji = [];

mod.updateEmoji = function (mod) {
    mod.emoji = [];
    var files = fs.readdirSync("emoji/");//code stolen from http://resolvethis.com/how-to-get-all-files-in-a-folder-in-javascript/
    for(var i in files)
    {
         if (!files.hasOwnProperty(i)) continue;
         var name = files[i];
         if(!fs.statSync("emoji/"+name).isDirectory() && name.toLowerCase().endsWith(".png"))
            mod.emoji.push(name.substring(0,name.length-4));
    }
}

mod.updateEmoji(mod);

mod.check = function (mod, client, message) {
    while (( result = regex.exec(message.content)) != null) {
        if (result[1] == null)
            continue;
        for (var e of mod.emoji) {
            if (e.toLowerCase() == result[1].toLowerCase()) {
                client.sendFile(message.channel, "emoji/" + e + ".png");
                return true;
            }
        }
    }
    return false;
}

mod.events = {
    "message": mod.check 
    };

module.exports = mod;


