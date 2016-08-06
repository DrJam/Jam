var e = {};
var regex = /\:(.*?)\:/g
var result;
e.check = function (client, message, config) {
    while (( result = regex.exec(message.content)) != null) {
        if (result[1] == null)
            continue;
        for (var e of config.emoji) {
            if (e == result[1]) {
                client.sendFile(message.channel, "emoji/" + result[1] + ".png");
                return true;
            }
        }
    }
    return false;
}

module.exports = e;