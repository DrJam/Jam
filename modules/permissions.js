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

permissions.hasPermissions = function(mod,server,member, command){
    if(command.permissions.restricted)//restricted commands need botowner permissions.
        return permissions.config.ownerids.find(function(x){return x==member.id})!=undefined;
    
    if(permissions.config.ownerids.find(function(x){return x==member.id})!=undefined || server.owner.id == member.id)
        return true;//bot and server owners are allowed everything according to Dan.

    var perms = mod.data[server.id][command.name];
    var igRoles = mod.data[server.id]._ignoredRoles
    var authorRoles= member.roles;
    if(perms.users[member.id] != undefined)
        return perms.users[member.id];//personal permissions override everything.

    if(perms.blacklist){//on blacklist, thus if you have a role, you don't have permission
        return !authorRoles.some((v,i,a)=>{return perms.roles.includes(v.id)})
    }
    else{//whitelisted
        let trueRoles = authorRoles.filter((v,i,a) => {return !igRoles.includes(v.id)});
        return trueRoles.some((v,i,a)=>{return perms.roles.includes(v.id)})
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