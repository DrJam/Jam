var permissions = {};

permissions.assertExistence = function(server)
{
    var data = permissions.data;
    if(data[server.id] == undefined)
        data[server.id] = {};
    if(data[server.id]._ignoredRoles == undefined)
        data[server.id]._ignoredRoles = [];
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
    var igRoles = mod.data[server.id]._ignoredRoles
    if(perms.users[author.id] != undefined)
        return perms.users[author.id];//personal permissions override everything.

    if(perms.blacklist){//on blacklist, thus if you have a role, you don't have permission
        for(var a = 0; a < perms.roles.length; a++){
            r = server.roles.find(function(x){return x.id == perms.roles[a]});
            if(r != undefined && author.hasRole(r))
                return false;
        }
        return true;
    }
    else{
        var highestRole = 0;var authorRoles= server.rolesOfUser(author);
        for(var a = 0; a < authorRoles.length;a++){
            r = authorRoles[a];
            if(igRoles.find(function(x){return r.id == x}) == undefined && highestRole<r.position)
                highestRole = r.position;
        }
        for(var a = 0; a < perms.roles.length;a++){
            r = server.roles.find(function(x){return x.id == perms.roles[a]});
            if(r!= undefined && highestRole>=r.position)
                return true;
        }
        return false;
    }
}

permissions.ready = function(mod, client)
{
    if(mod.data != undefined){
        for(var a =0; a< client.guilds.array().length; a++){
            mod.assertExistence(client.guilds.array()[a]);
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
    var logChannel = role.server.channels.find(function(x){return x.name == "logs";});
    for(var key in mod.data[role.server.id]){
        if(key!="_ignoredRoles"){
            var index = mod.data[role.server.id][key].roles.findIndex(function(x){return x == role.id;})
            if(index!=-1){
                mod.data[role.server.id][key].roles.splice(index,1);
                if(logChannel!=undefined)
                    client.sendMessage(logChannel,`Removed ${role.name} from ${key} permissions as it was deleted.`);
            }
        }else{
            var index = mod.data[role.server.id][key].findIndex(function(x){return x == role.id;})
            if(index!=-1){
                mod.data[role.server.id][key].splice(index,1);
                if(logChannel!=undefined)
                    client.sendMessage(logChannel,`Removed ${role.name} from the ignored roles as it was deleted.`);
            }
        }
    }
}

permissions.events = {
    "ready" : permissions.ready,
    "serverCreated" : permissions.serverCreated,
    "serverDeleted" : permissions.serverDeleted,
    "serverRoleDeleted" : permissions.serverRoleDeleted
}

module.exports = permissions;