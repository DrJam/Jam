var permissions = {};

permissions.assertExistence = function(server)
{
    var data = permissions.data;
    if(data[server.id] == undefined)
        data[server.id] = {};
    for(var a in permissions.commands)
    {
        if(data[server.id][a] == undefined && !permissions.commands[a].permissions.restricted)
            data[server.id][a] = {"blacklist": permissions.commands[a].permissions.global,"roles":[],"users":{}};
    }
}

permissions.hasPermissions = function(mod,server,author, command){
    if(command.permissions.restricted)//restricted commands need botowner permissions.
        return permissions.config.ownerids.find(function(x){return x==author.id})!=undefined;
    
    if(permissions.config.ownerids.find(function(x){return x==author.id})!=undefined || server.owner.id == author.id)
        return true;//bot and server owners are allowed everything according to Dan.

    var perms = mod.data[server.id][command.name];
    if(perms.users[author.id] != undefined)
        return perms.users[author.id];//personal permissions override everything.

    if(perms.blacklist){//on blacklist, thus if you have a role
        for(var a = 0; a < perms.roles.length; a++){
            r = server.roles.find(function(x){return x.id = perms.roles[a]});
            if(r != undefined && author.hasRole(r))
                return false;
        }
        return true;
    }
    else{
        var highestRole = 0;var authorRoles= server.rolesOfUser(author);
        for(var a = 0; a < authorRoles.length;a++){
            r = authorRoles[a];
            if(highestRole< r.position)
                highestRole = r.position;
        }
        for(var a = 0; a < perms.roles.length;a++){
            r = server.roles.find(function(x){return x.id = perms.roles[a]});
            if(r!= undefined && highestRole>=r.position)
                return true;
        }
        return false;
    }
}

permissions.ready = function(mod, client)
{
    if(mod.data != undefined){
        for(var a =0; a< client.servers.length; a++){
            mod.assertExistence(client.servers[a]);
        }
    }
}

permissions.serverCreated = function(mod, client, server)
{
    if(mod.data != undefined)
        mod.assertExistence(server);
    else
        console.log("OUT OF ORDER SEQUENCING: permissions has no data, but a new server was added.");
}
permissions.serverDeleted = function(mod,client,server)
{
    if(mod.data[server.id] !=undefined)
    {
        delete mod.data[server.id];
    }
}

permissions.serverRoleDeleted = function(mod, client,role)
{
    for(var a = 0;a < mod.data[role.server.id];a++)
        if(mod.data[role.server.id].roles[a].id == role.id){
            mod.data[role.server.id].roles.splice(a,1);
            break;
        }
}

permissions.events = {
    "ready" : permissions.ready,
    "serverCreated" : permissions.serverCreated,
    "serverDeleted" : permissions.serverDeleted,
    "serverRoleDeleted" : permissions.serverRoleDeleted
}

module.exports = permissions;
/*var p = {}
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

module.exports = p;
*/