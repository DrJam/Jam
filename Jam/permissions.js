var p = {}
try {
	p.permissions = require("./permissions.json");
} catch (e) {
	throw "Cannot find \"permissions.json\"";
}

p.userHasPermission = function (user, server, command) {
    if (user.id === server.owner.id)
        return true;

    var userRoles = server.getUserRoles(user);
    
    if (!p.serverExists(server))
        return false;

    if (!p.commandExistsForServer(server,command))
        return false;

    if (p.userDefinedForCommand(command, user))
        return p.permissions[server.id][command][users][user.id];

    var highestRole = undefined;
    for (var role in userRoles) {
        if (!p.roleDefinedForCommand(command, role))
            continue;

        if (highestRole == undefined)
            highestRole = role;
        else if (role.position > highestRole.position)
            highestRole = role;
    }
    if (highestRole != undefined)
        return p.permissions[server.id][command][roles][highestRole.id];

    if (p.permissions[server.id][command].hasOwnProperty("all"))
        return p.permissions[server.id][command]["all"];

    return false;
};

p.serverExists = function(server) {
    return p.permissions.hasOwnProperty(server.id)
}

p.commandExistsForServer = function(server, command) {
    return p.serverExists(server) ? 
    	p.permissions[server.id].hasOwnProperty(command)
    	: false;
}

p.userDefinedForCommand = function(server, command, user) {
	return p.commandExistsForServer(server, command) ?
		p.permissions[server.id][command][users].hasOwnProperty(user.id) 
		: false;
}

p.roleDefinedForCommand = function(server, command, role) {
	return p.commandExistsForServer(server, command) ?
		p.permissions[server.id][command][roles].hasOwnProperty(role.id)
		: false;
}

p.addPermission = function(params) {
	if params.hasOwnProperty()
}

module.exports = p;