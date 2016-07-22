function resolveName(server, name) {
    var results = []
    
    for (var sUser of server.members) {
        if(sUser) {
            if (sUser.name == name || server.detailsOfUser(sUser).nick == name) {
                results.push(sUser);
            }
        }
    }

    return results;
}

var me = {};

me.lookup = function(message, usage, fileHandler) {
    if (!fileHandler.dataLoaded)
        return "Data not loaded.";
    var users = resolveName(message.server, usage.parameters.name);
    if (users.length == 0) {
        return "No users found, sorry";
    }
    var output = "";
    for (var i = 0; i < users.length; i++) {
        output += me.getMe(users[i], fileHandler.data) + ((i < users.length - 1) ? "\n" : "");
    }
    return output;
};

me.handle = function(message, usage, fileHandler) {
    if (!fileHandler.dataLoaded)
        return "Data not loaded.";

    if (!me.userInData(message.author, fileHandler)) {
        fileHandler.data[message.author.id] = {};
        console.log("New user registered. (" + message.author.id + ")");
    }

    if (usage.usageid == 0) {
        return me.getMe(message.author, fileHandler.data);
    }

    if (usage.usageid == 1) {
        if (fileHandler.data[message.author.id][usage.parameters.field] != undefined) {
            delete fileHandler.data[message.author.id][usage.parameters.field];
            return "Field \"" + usage.parameters.field + "\" deleted.";
        } else {
            return "No field  \"" + usage.parameters.field + "\" found.";
        }
    }

    if (usage.usageid == 2) {
         var output;
        if (fileHandler.data[message.author.id][usage.parameters.field] != undefined)
            output = "edited";
        else
            output = "created";
        fileHandler.data[message.author.id][usage.parameters.field] = usage.parameters.value;
        return "Field \""+usage.parameters.field+"\" "+output+"."
    }

    return "Unknown error";
};

me.userInData = function(user,filehandler) {
    data = filehandler.data;
    if (data[user.id] != undefined)
        return true;
    return false;
};

me.getMe = function(user, data) {
    var output = "__**" + user.name + "**#" + user.discriminator + "__\n";
    if (!data.hasOwnProperty(user.id) || Object.keys(data[user.id]).length == 0) {
        console.log("No data saved for this user");
        output += "No data saved for this user.";
        return output;
    }
    for (var key in data[user.id]) {
        if (data[user.id].hasOwnProperty(key)) {
            output += "**" + key + "**: " + me.removeLinkPreviews(data[user.id][key]) + "\n";
        }
    }
    return output;
};

me.formatOutput = function(data) {
    var result = "";
    for (var key in data) {
        if (user.hasOwnProperty(key) && key != "id") {
            result += "**" + key + "**: " + me.removeLinkPreviews(data[key]) + "\n";
        }
    }
    return result;
};

me.removeLinkPreviews = function(str) {
    var reg = /(https?:\/\/[^\s]+)/g;
    var match;
    while ((match = reg.exec(str))) {
        if (match.index == 0) {
            str = "<" + match[1] + ">" + str.substr(match[1].length);
            continue;
        }
        if (match.index + match[1].length == str.length) {
            str = str.substr(0, match.index) + "<" + match[1] + ">";
            continue;
        }
        if (!(str[match.index - 1] == '<' && str[match.index + match[1].length - 1] == '>')) {
            str = str.substr(0, match.index) + "<" + match[1] + ">" + str.substr(match.index + match[1].length);
            continue;
        }
    }
    return str;
};

module.exports = me;