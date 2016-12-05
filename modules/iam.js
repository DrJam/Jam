var roleManager = {};

function getFromId(server,id)
{
    var role = server.roles.find(function(x){return x.id==id});
    if(role !=undefined)
        return role;
    return undefined;
}

function getFromName(server,name)
{
    name = name.toLowerCase();
    var role = server.roles.find(function(x){return x.name.toLowerCase()==name});
    if(role !=undefined)
        return role;
    return undefined;
}

function assertServerExistance(server, data)//returns true if server existed in data and was the correct version prior to this call, otherwise ... false
{
    if(data[server.id] == undefined){
        data[server.id] = {selfroles:[],otherroles:[]};
        return false;
    }
    else{//if data is in old format
        if(!data[server.id].hasOwnProperty("selfroles")){
            data[server.id] = {selfroles:data[server.id],otherroles:[]};
            return false
        }
    }
    return true;

}

roleManager.iam = function(message, role, data)
{
    var server = message.server;
    role = getFromName(server,role);
    if(role == undefined)
        return false;
    if(data[server.id].selfroles.find(function(x){return x==role.id})!=undefined){
        message.author.addTo(role);
        var logChannel = server.channels.find(function(x){return x.name=="logs"});
        if(logChannel!=undefined)
            message.client.sendMessage(logChannel,`Assigned ${role.name} to ${message.author.username}#${message.author.discriminator} per that user's request.`,{"disableEveryone":true});
        return true;
    }else
        return false;
}

roleManager.iamnot = function(message,role,data)
{
    var server = message.server;
    role = getFromName(server,role);
    if(role == undefined)
        return {"value":false, "message":"No role like that exist."};
    if(data[server.id].selfroles.find(function(x){return x==role.id})!=undefined){
        if(message.author.hasRole(role)){
            message.author.removeFrom(role);
            var logChannel = server.channels.find(function(x){return x.name=="logs"});
            if(logChannel!=undefined)
                message.client.sendMessage(logChannel,`Removed ${role.name} from ${message.author.username}#${message.author.discriminator} per that user's request.`,{"disableEveryone":true});
            return {"value":true, "message":"Role succesfully removed!"};
            
        }else{
            return {"value":false, "message":"You don't have that role."};
        }
    }else
        return {"value":false, "message":"I have no role like that in the self assignable list."};
}

roleManager.theyam = function(message, role, target, data)
{
    var server = message.server;
    role = getFromName(server,role);
    if(role == undefined)
        return false;
    if(data[server.id].otherroles.find(function(x){return x==role.id})!=undefined || data[server.id].selfroles.find(function(x){return x==role.id})!=undefined){
       target.addTo(role);
        var logChannel = server.channels.find(function(x){return x.name=="logs"});
        if(logChannel!=undefined)
            message.client.sendMessage(logChannel,`Assigned ${role.name} to ${target.username}#${target.discriminator} per ${message.author.username}#${message.author.discriminator}'s request.`,{"disableEveryone":true});
        return true;
    }else
        return false;
}

roleManager.theyamnot = function(message,role,target,data)
{
    var server = message.server;
    role = getFromName(server,role);
    if(role == undefined)
        return {"value":false, "message":"No role like that exist."};
    if(data[server.id].otherroles.find(function(x){return x==role.id})!=undefined || data[server.id].selfroles.find(function(x){return x==role.id})!=undefined){
        if(target.hasRole(role)){
            target.removeFrom(role);
            var logChannel = server.channels.find(function(x){return x.name=="logs"});
            if(logChannel!=undefined)
                message.client.sendMessage(logChannel,`Removed ${role.name} from ${target.username}#${target.discriminator} per ${message.author.username}#${message.author.discriminator}'s request.`,{"disableEveryone":true});
            return {"value":true, "message":`Role succesfully removed from ${target.username}#${target.discriminator}!`};
            
        }else{
            return {"value":false, "message":"That person doesn't have that role."};
        }
    }else
        return {"value":false, "message":"I have no role like that in the assignable list."};
}

roleManager.whatami = function(message, user, data)
{
    var server = message.server;
    var output = "";
    if(user.id == message.author.id) output+="You have";
    else output+= user.name + " has";
    var output2 = " the following self assignable roles:\n";
    var roles = server.rolesOfUser(user);
    var count = 0;
    for(var a = 0; a<data[server.id].selfroles.length;a++){
        var role =roles.find(function(x){return x.id == data[server.id][a]})
        if(role !=undefined)
        {
            if(count !=0)output2+=",";
            output2+=` "${role.name}"`;
            count++;
        }
    }
    if(count==0)output+= " no self assignable roles."
    else output+=output2;
    return output;
}

roleManager.lsar = function(message, data)
{
    if(!assertServerExistance(message.server,data) || data[message.server.id].selfroles.length == 0)
    {
        return "I have no self assignable roles listed for this server.";
    }
    var output = "I have the following self assignable roles listed:\n";
    for(var a = 0; a < data[message.server.id].selfroles.length; a++){
        if(a!=0) output+=", ";
        var name = getFromId(message.server,data[message.server.id].selfroles[a])
        if(name !== undefined){
             name = name.name;
            if(name.includes(" ")) name = `"${name}"`;
            output+=name;
        }else{
            data[message.server.id].selfroles.splice(a,1);
            var logChannel = message.server.channels.find(function(x){return x.name=="logs"});
            if(logChannel!=undefined)
                message.client.sendMessage(logChannel,`When I was listing roles, I discovered a role was missing. Deleted it.`,{"disableEveryone":true});
        }
    }
    return output;
}

roleManager.loar = function(message, data)
{
    if(!assertServerExistance(message.server,data) || data[message.server.id].otherroles.length == 0)
    {
        if(data[message.server.id].selfroles.length == 0)
            return "I have no assignable roles listed for this server.";
        else
            return "I have no assignable roles listed, but you could assign self-assignable roles."
    }
    var output = "I have the following assignable roles listed:\n";
    for(var a = 0; a < data[message.server.id].otherroles.length; a++){
        if(a!=0) output+=", ";
        var name = getFromId(message.server,data[message.server.id].otherroles[a])
        if(name !== undefined){
             name = name.name;
            if(name.includes(" ")) name = `"${name}"`;
            output+=name;
        }else{
            data[message.server.id].otherroles.splice(a,1);
            var logChannel = message.server.channels.find(function(x){return x.name=="logs"});
            if(logChannel!=undefined)
                message.client.sendMessage(logChannel,`When I was listing roles, I discovered a role was missing. Deleted it.`,{"disableEveryone":true});
        }
    }
    return output;
}

roleManager.asar = function(message,role,data)//we need permissions before adding this one.
{
    var server = message.server;
    role = getFromName(server,role);
    assertServerExistance(server,data)
    if(role==undefined)
        return "I have not found a role named that way."
    else{
        if(data[server.id].selfroles.find(function(x){return x == role.id})!=undefined)
            return "This role is already in my list!";
        data[server.id].selfroles.push(role.id);
        data[server.id].selfroles.sort((x,y) =>
            {
                let x_ = server.roles.find(function(z1){return z1.id == x});
                let y_ = server.roles.find(function(z2){return z2.id == y});
                return y_.position-x_.position ;
            })
        var logChannel = server.channels.find(function(x){return x.name=="logs"});
        if(logChannel!=undefined)
            message.client.sendMessage(logChannel,`${message.author.username}#${message.author.discriminator} added ${role.name} to the list of self assignable roles.`,{"disableEveryone":true});
        return `"${role.name}" added to the list of self assignable roles!`;
    }
}

roleManager.aoar = function(message,role,data)//we need permissions before adding this one.
{
    var server = message.server;
    role = getFromName(server,role);
    assertServerExistance(server,data)
    if(role==undefined)
        return "I have not found a role named that way."
    else{
        if(data[server.id].otherroles.find(function(x){return x == role.id})!=undefined)
            return "This role is already in my list!";
        data[server.id].otherroles.push(role.id);
        data[server.id].otherroles.sort((x,y) =>
            {
                let x_ = server.roles.find(function(z1){return z1.id == x});
                let y_ = server.roles.find(function(z2){return z2.id == y});
                return  y_.position-x_.position;
            })
        var logChannel = server.channels.find(function(x){return x.name=="logs"});
        if(logChannel!=undefined)
            message.client.sendMessage(logChannel,`${message.author.username}#${message.author.discriminator} added ${role.name} to the list of assignable roles.`,{"disableEveryone":true});
        return `"${role.name}" added to the list of assignable roles!`;
    }
}

roleManager.dsar = function(message, role, data)
{
    var server = message.server;
    role = getFromName(server,role)
    assertServerExistance(server,data)
    if(role==undefined)
        return "I have not found a role named that way."
    else{
        if(data[server.id].selfroles.find(function(x){return x == role.id})!=undefined){
            var index = -1;
            for(var a = 0; a<data[server.id].selfroles.length; a++)
            {
                if(data[server.id].selfroles[a] == role.id){
                    index = a;
                    break;
                }
            }
            data[server.id].selfroles.splice(index,1);
            var logChannel = server.channels.find(function(x){return x.name=="logs"});
            if(logChannel!=undefined)
                message.client.sendMessage(logChannel,`${message.author.username}#${message.author.discriminator} removed ${role.name} from the list of self assignable roles.`,{"disableEveryone":true});
            return `Deleted ${role.name} from self assignable list.`
        }
        return "I don't have a self assignable role named that way."
        }
}

roleManager.doar = function(message, role, data)
{
    var server = message.server;
    role = getFromName(server,role)
    assertServerExistance(server,data)
    if(role==undefined)
        return "I have not found a role named that way."
    else{
        if(data[server.id].otherroles.find(function(x){return x == role.id})!=undefined){
            var index = -1;
            for(var a = 0; a<data[server.id].otherroles.length; a++)
            {
                if(data[server.id].otherroles[a] == role.id){
                    index = a;
                    break;
                }
            }
            data[server.id].otherroles.splice(index,1);
            var logChannel = server.channels.find(function(x){return x.name=="logs"});
            if(logChannel!=undefined)
                message.client.sendMessage(logChannel,`${message.author.username}#${message.author.discriminator} removed ${role.name} from the list of assignable roles.`,{"disableEveryone":true});
            return `Deleted ${role.name} from assignable list.`
        }
        return "I don't have a mod assignable role named that way."
        }
}

module.exports = roleManager;