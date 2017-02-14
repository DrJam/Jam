//Ties with the data "roles.json" and the other module "iam.js"
function assertServerExistance(server, data)//returns true if server existed in data and was the correct version prior to this call, otherwise ... false
{
    if(data[server.id] == undefined){
        data[server.id] = {selfroles:[],otherroles:[],autoroles:[]};
        return false;
    }
    else{//if data is in oldest format
        if(!data[server.id].hasOwnProperty("selfroles")){
            data[server.id] = {selfroles:data[server.id],otherroles:[],autoroles:[]};
            return false
        }
        else{//data in pre-autoroles format
            if(!data[server.id].hasOwnProperty("autoroles"))
            {
                data[server.id].autoroles = [];
            }
        }
    }
    return true;
}

var roleManager = {};

roleManager.serverRoleDeleted = function(mod, client, role){
    let server = role.server;
    if(assertServerExistance(server,mod.data))
    {
        logChannel = server.channels.find(function(x){return x.name=="logs"});
        if(mod.deleteIfExistsInArray(mod.data[server.id].selfroles,role) && logChannel!=undefined){
            client.sendMessage(logChannel,`Removed ${role.name} from the list of self assignable roles as it was deleted.`);
        }
        if(mod.deleteIfExistsInArray(mod.data[server.id].autoroles,role) && logChannel!=undefined){
            client.sendMessage(logChannel,`Removed ${role.name} from the list of automatically assigned roles as it was deleted.`);
        }
        if(mod.deleteIfExistsInArray(mod.data[server.id].otherroles,role) && logChannel!=undefined){
            client.sendMessage(logChannel,`Removed ${role.name} from the list of other assignable roles as it was deleted.`);
        }
    }
}

roleManager.deleteIfExistsInArray = function(roleArray, role)//Deletes a role from a role array, returns true if it's in there. Otherwise false.
{
    for(let a=0;a<roleArray.length;a++)
    {
        if(roleArray[a] == role.id){
            roleArray.splice(a,1);
            return true;
        }
    }
    return false;
}

roleManager.serverNewMember = function(mod,client,server,user)
{
    let b;
    let data = mod.data[server.id].autoroles;
    let c = 0;
    let logChannel = server.channels.find((x) => {return x.name == "logs"})
    for(let a in data)
    {
        b = server.roles.find((x) => {return x.id == data[a]});
        if(b==undefined){
            if(logChannel!= undefined)
                client.sendMessage(logChannel, `I wanted to automatically assign the role with id ${data[a]}, but I couldn't.`);
        }else{
            client.addMemberToRole(user,b);
            c++;
        }
    }
    if(logChannel!=undefined && c>0)
        client.sendMessage(logChannel, `${user.name}#${user.discriminator} joined the server, assigned ${c} role(s) automagically.`)
}

roleManager.events = {
    "serverRoleDeleted" : roleManager.serverRoleDeleted,
    "serverNewMember"   : roleManager.serverNewMember
}

module.exports = roleManager;