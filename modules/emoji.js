var e = {};
var regex = /\:(.*?)\:/g
var result;
e.check = function (client, message, config) {
    while (( result = regex.exec(message.content)) != null) {
        if (result[1] == null)
            continue;
        for (var e of config.emoji) {
            if (e.toLowerCase() == result[1].toLowerCase()) {
                client.sendFile(message.channel, "emoji/" + e + ".png");
                return true;
            }
        }
    }
    return false;
}

module.exports = e;