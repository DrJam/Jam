//Ties with the data "roles.json" and the other module "iam.js"
var roleManager = {};

roleManager.serverRoleDeleted = function(mod, client, role){
    logChannel = role.server.channels.find(function(x){return x.name=="logs"});
    for(var a = 0;a < mod.data[role.server.id].otherroles.length;a++){
        if(mod.data[role.server.id].otherroles[a] == role.id){
            mod.data[role.server.id].otherroles.splice(a,1);
            if(logChannel!=undefined)
                client.sendMessage(logChannel,`Removed ${role.name} from the list of assignable roles as it was deleted.`);
            break;
        }
    }
    for(var a = 0;a < mod.data[role.server.id].selfroles.length;a++){
        if(mod.data[role.server.id].selfroles[a] == role.id){
            mod.data[role.server.id].selfroles.splice(a,1);
            if(logChannel!=undefined)
                client.sendMessage(logChannel,`Removed ${role.name} from the list of self assignable roles as it was deleted.`);
            break;
        }
    }
}

roleManager.events = {
    "serverRoleDeleted" : roleManager.serverRoleDeleted
}

module.exports = roleManager;