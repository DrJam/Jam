var games = {};

games.defaultTime = Date.now();

games.Update = function (user, data) {
    if (!user.bot) {
        if (games.UserList[user.id] == undefined) {
             games.UserList[user.id] = games.defaultTime; 
        }
        if (user.game != null && user.game.url == undefined) {
            if (data.games[user.game.name] == undefined) {
                data.games[user.game.name] = 0;
            }
            if (data.users[user.id] == undefined) {
                data.users[user.id] = {};
            }
            if (data.users[user.id][user.game.name] == undefined) {
                data.users[user.id][user.game.name] = 0;
            }
            data.users[user.id][user.game.name] += Date.now() - games.UserList[user.id];
            data.games[user.game.name] += Date.now() - games.UserList[user.id];
        }
        games.UserList[user.id] = Date.now();
    }
}

games.UserList = [];

module.exports = games;