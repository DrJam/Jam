var games = {};

games.defaultTime = Date.now();

games.Update = function (user, data) {
    if (!user.bot) {
        if (games.UserList[user.id] == undefined) {
             games.UserList[user.id] = games.defaultTime; 
        }
        if (user.presence.game != null && user.presence.game.url == undefined && !user.presence.game.name.includes("discord.gg")) {
            if (data.games[user.presence.game.name] == undefined) {
                data.games[user.presence.game.name] = 0;
            }
            if (data.users[user.id] == undefined) {
                data.users[user.id] = {};
            }
            if (data.users[user.id][user.presence.game.name] == undefined) {
                data.users[user.id][user.presence.game.name] = 0;
            }
            data.users[user.id][user.presence.game.name] += Date.now() - games.UserList[user.id];
            data.games[user.presence.game.name] += Date.now() - games.UserList[user.id];
        }
        games.UserList[user.id] = Date.now();
    }
}

games.UserList = [];

module.exports = games;