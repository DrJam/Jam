var me = {};

me.handle = function(message, usage, meFileHandler) {
    if (!meFileHandler.dataLoaded) {
        return "Data not loaded";
    }
    if (!me.userInData(message.author, meFileHandler)) {
        return "User not in data";
    }
    if (usage.usageid == 0) {
        console.log("get");
        return me.getMe(message.author, meFileHandler.data);
    }
    if (usage.usageid == 1) {
        console.log("delete");

        return "Field " + usage.field + " deleted";
    }
    return "Unknown error";
};

me.userInData = function() {
    
}

me.getMe = function(author, data) {
    var output = "__**" + author.name + "**__\n";
    if (!data.hasOwnProperty(author.id)) {
        console.log("No data saved for this user");
        output += "No data saved for this user";
        return output;
    }
    for (var key in data[author.id]) {
        if (data[author.id].hasOwnProperty(key)) {
            output += "**" + key + "**: " + me.removeLinkPreviews(data[author.id][key]) + "\n";
        }
    }
    return output;
}

me.formatOutput = function(data) {
    var result = "";
    for (var key in data) {
        if (user.hasOwnProperty(key) && key != "id") {
            result += "**" + key + "**: " + me.removeLinkPreviews(data[key]) + "\n";
        }
    }
    return result;
}

me.removeLinkPreviews = function(str) {
    var reg = /(https?:\/\/[^\s]+)/g;
    var match;
    while (match = reg.exec(str)) {
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
}

module.exports = me;