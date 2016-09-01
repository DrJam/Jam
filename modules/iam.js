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

function assertServerExistance(server, data)//returns true if server existed in data prior to this call, otherwise ... false
{
    if(data[server.id] == undefined){
        data[server.id] = [];
        return false;
    }
    return true;

}

roleManager.iam = function(message, role, data)
{
    var server = message.server;
    role = getFromName(server,role);
    if(role == undefined)
        return false;
    if(data[server.id].find(function(x){return x==role.id})!=undefined){
        message.author.addTo(role);
        var logChannel = server.channels.find(function(x){return x.name=="logs"});
        if(logChannel!=undefined)
            message.client.sendMessage(logChannel,`Assigned ${role.name} to ${message.author.username}#${message.author.discriminator} per that user's request.`);
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
    if(data[server.id].find(function(x){return x==role.id})!=undefined){
        if(message.author.hasRole(role)){
            message.author.removeFrom(role);
            var logChannel = server.channels.find(function(x){return x.name=="logs"});
            if(logChannel!=undefined)
                message.client.sendMessage(logChannel,`Removed ${role.name} from ${message.author.username}#${message.author.discriminator} per that user's request.`);
            return {"value":true, "message":"Role succesfully removed!"};
            
        }else{
            return {"value":false, "message":"You don't have that role."};
        }
    }else
        return {"value":false, "message":"I have no role like that in the self assignable list."};
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
    for(var a = 0; a<data[server.id].length;a++){
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
    if(!assertServerExistance(message.server,data) || data[message.server.id].length == 0)
    {
        return "I have no self assignable roles listed for this server.";
    }
    var output = "I have the following self assignable roles listed:\n";
    for(var a = 0; a < data[message.server.id].length; a++){
        if(a!=0) output+=", ";
        var name = getFromId(message.server,data[message.server.id][a])
        if(name !== undefined) name = name.name;
        if(name.includes(" ")) name = `"${name}"`;
        output+=name;
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
        if(data[server.id].find(function(x){return x == role.id})!=undefined)
            return "This role is already in my list!";
        data[server.id].push(role.id);
        var logChannel = server.channels.find(function(x){return x.name=="logs"});
        if(logChannel!=undefined)
            message.client.sendMessage(logChannel,`${message.author.username}#${message.author.discriminator} added ${role.name} to the list of self assignable roles.`);
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
        if(data[server.id].find(function(x){return x == role.id})!=undefined){
            var index = -1;
            for(var a = 0; a<data[server.id].length; a++)
            {
                if(data[server.id][a] == role.id){
                    index = a;
                    break;
                }
            }
            data[server.id].splice(index,1);
            var logChannel = server.channels.find(function(x){return x.name=="logs"});
            if(logChannel!=undefined)
                message.client.sendMessage(logChannel,`${message.author.username}#${message.author.discriminator} removed ${role.name} from the list of self assignable roles.`);
            return `Deleted ${role.name} from self assignable list.`
        }
        return "I don't have a self assignable role named that way."
        }
}

module.exports = roleManager;