var roleManager = {};

roleManager.serverRoleDeleted = function(mod, client, role){
    for(var a = 0;a < mod.data;a++)
        if(mod.data[a] == role.id){
            mod.data.splice(a,1);
            logChannel = server.channels.find(function(x){return x.name=="logs"});
            if(logChannel!=undefined)
                message.client.sendMessage(logChannel,`Removed ${role.name} from the list of self assignable roles as it was deleted.`);
            break;
        }
}

roleManager.events = {
    "serverRoleDeleted" : roleManager.serverRoleDeleted
}

module.exports = roleManager;