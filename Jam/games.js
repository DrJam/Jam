var games = {};

games.defaultTime = Date.now();

games.Update = function(user,data)
{
    if (games.UserList[user.id] == undefined) { games.UserList[user.id] = games.defaultTime; }          //assert the time data exists.
    if (user.game != null) {
        if (data.games[user.game.name] == undefined) { data.games[user.game.name] = 0; }                //assert the game data exists.
        if (data.users[user.id] == undefined) { data.users[user.id] = {}; }                             //assert the user data exists.
        if(data.users[user.id][user.game.name]==undefined) { data.users[user.id][user.game.name] = 0;}  //assert the user game data exists.
        data.users[user.id][user.game.name] = Date.now() - games.UserList[user.id];
        data.games[user.game.name] += Date.now() - games.UserList[user.id];
    }
    games.UserList[user.id] = Date.Now();
}

games.UserList = [];

module.exports = games;