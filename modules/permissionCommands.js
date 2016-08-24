permissions = {};
permissions.config = require("../config/config.json");

permissions.addRole = function(mod, message,command,role,data)
{
    if(mod.commands[command]==undefined || mod.commands[command].permissions.restricted != undefined)
        return {"value": true, "message":  "That command does not exist, or does not allow permissions modifying!"};

    role = message.server.roles.find(function(x){return x.name.toLowerCase() == role.toLowerCase()})
    if(role ==undefined)
        return {"value": true , "message" : "That role does not exist!"};

    data[message.server.id][command].roles.push(role.id);

    logChannel = message.server.channels.find(function(x){return x.name=="logs"});
    if(logChannel!=undefined)
        if(data[message.server.id][command].blacklist)
            message.client.sendMessage(logChannel,`${message.author.name}#${message.author.discriminator} made ${role.name} role NO LONGER allowed to use ${command}.`);
        else
            message.client.sendMessage(logChannel,`${message.author.name}#${message.author.discriminator} made all roles above and including ${role.name} now allowed to use ${command}.`);

    return {"value": true, "message": "Role succesfully added."};

}

permissions.deleteRole =  function (mod, message, command, role, data)
{
    if(mod.commands[command]==undefined || mod.commands[command].permissions.restricted != undefined)
        return {"value": true, "message":  "That command does not exist, or does not allow permissions modifying!"};

    role = message.server.roles.find(function(x){return x.name.toLowerCase() == role.toLowerCase()})
    if(role == undefined)
        return {"value": true, "message":"Role does not exist in server."};

    var index = data[message.server.id][command].roles.indexOf(role.id);    
    if( index == -1)
        return {"value": true, "message" : "That role does not have any special permissions for this command."};
    
    data[message.server.id][command].roles.splice(index,1);

    if(logChannel!=undefined)
        if(data[message.server.id][command].blacklist)
            message.client.sendMessage(logChannel,`${message.author.name}#${message.author.discriminator} made the ${role.name} role now allowed to use ${command} again.`);
        else
            message.client.sendMessage(logChannel,`${message.author.name}#${message.author.discriminator} made the ${role.name} role longer permitted to use ${command}.`);

    return {"value": true, "message": "Role succesfully removed!"};
}

permissions.addUser =  function(mod, message,command,value,data)
{
    if(message.mentions.length==0)
        return {"value": false}
    
    var user = message.mentions[0];

    if(mod.commands[command]==undefined || mod.commands[command].permissions.restricted != undefined)
        return {"value": true, "message": "That command does not exist, or does not allow permissions modifying!"};
    
    value = value.toLowerCase();
    if(value !== "true" && value !== "false" && value !== "allow" && value !== "deny")
        return {"value": true, "message": `Please use "true", "allow", "deny" or "false"! I'm not THAT smart.`};

    var output = "";
    if(data[message.server.id][command].users[user.id] == undefined)
        output = "Explicit user permissions added!";
    else
        output = "Explicit user permissions overwritten!";    
    data[message.server.id][command].users[user.id] = (value == "true"|| value == "allow");

    logChannel = message.server.channels.find(function(x){return x.name=="logs"});
    if(logChannel!=undefined)
        message.client.sendMessage(logChannel, `${message.author.name}#${message.author.discriminator} added explicit permissions on \`${command}\` for ${user.name}#${user.discriminator} which were set to "${value}"`);
    return {"value": true, "message": output}; 
}

permissions.deleteUser = function(mod, message,command,data)
{
    if(message.mentions.length == 0)
        return {"value":false};
    
    var user = message.mentions[0];

    if(mod.commands[command]==undefined || mod.commands[command].permissions.restricted != undefined)
        return {"value": true, "message": "That command does not exist, or does not allow permissions modifying!"};
    
    if(data[message.server.id][command].users[user.id] == undefined)
        return {"value": true, "message": "This user does not have any associated permissions for this command."}
    
    logChannel = message.server.channels.find(function(x){return x.name=="logs"});
    if(logChannel!=undefined)
        message.client.sendMessage(logChannel, `${message.author.name}#${message.author.discriminator} removed explicit permissions on \`${command}\` for ${user.name}#${user.discriminator} `);

    delete data[message.server.id][command].users[user.id];
    return {"value": true, "message": "Associated permissions for this user are now forgotten."};

}

permissions.blacklist = function(mod, message, command, value, data)
{
    if(mod.commands[command]==undefined || mod.commands[command].permissions.restricted != undefined)
        return {"value": true, "message": "That command does not exist, or does not allow permissions modifying!"};
    
    if(value !== "true" && value !== "false")
        return {"value": true, "message": `Please use "true" or "false"!`};
    
    value = (value === "true");

    var listType = (value) ? "blacklist" : "whitelist";
    if(data[message.server.id][command].blacklist == value)
            return {"value": true, "message": `This command is already a ${listType}.`}
    
    data[message.server.id][command].blacklist = value;
    data[message.server.id][command]. roles = [];

    logChannel = message.server.channels.find(function(x){return x.name=="logs"});
    if(logChannel!=undefined)
        message.client.sendMessage(logChannel, `${message.author.name}#${message.author.discriminator} switched ${command} to a ${listType}. All associated role permissions have been wiped.`);

    return {"value": true, "message": `Command succesfully switched to ${listType}. All associated roles have been wiped.`};
}

permissions.getBlacklist = function(mod, message, command, data)
{
    if(mod.commands[command]==undefined || mod.commands[command].permissions.restricted != undefined)
        return {"value": true, "message": "That command does not exist, or does not allow permissions modifying!"};
    
    var listType = (data[message.server.id][command].blacklist) ? "blacklist" : "whitelist";
    output = `This command uses a ${listType}. This means that if a user has a listed role, `;
    if(listType == "blacklist")
        output += "they will **not** be allowed to use this command." ;
    else
        output += "or a role higher than it, they will be allowed to use use this command";
    return {"value": true, "message": `${output}`};
}

permissions.reset = function(mod, message, command, data)
{
    if(mod.commands[command]==undefined || mod.commands[command].permissions.restricted != undefined)
        return {"value": true, "message": `That command does not exist or does not allow permissions modifying!`};
    
    data[message.server.id][command] =  {"blacklist": mod.commands[command].permissions.global,"roles":[],"users":{}};
    
    logChannel = message.server.channels.find(function(x){return x.name=="logs"});
    if(logChannel!=undefined)
        message.client.sendMessage(logChannel, `${message.author.name}#${message.author.discriminator} reset the permissions for ${command}`);

    return {"value": true, "message": `Permissions for "${command}" have been reset!`};
}

permissions.list = function(mod, message, command, data)
{
    if(mod.commands[command] == undefined)
        return {"value": true, "message": "This command does not exist."};
    
    var output = `__**${command}**__\n`;
    if(mod.commands[command].permissions.restricted){
        output+=`Bot-Owner only.`;
    }else{
        var perms = data[message.server.id][command];
        output+= `Blacklist: ${perms.blacklist}\n`;
        output+= `Roles:`;
            for(var a =0; a<perms.roles.length;a++){
                var r = message.server.roles.find(function(x){return x.id == perms.roles[a]})
                if(r!=undefined)
                    output+= " "+r.name;   
            }
            output+="\n";
        output+= "Users:";
        var output2 = "";
        for(var userId in perms.users){
            if(message.server.members.get("id",userId)!=null)
            {
                var userStuff = message.server.members.get("id",userId)
                output2+= `${userStuff.name}#${userStuff.discriminator}`;  
            }else{
                output2+= userid;
            }
            output2+=" : "+perms.users[userId]+"\n";
        }
        if(output2==="")
        {output+=" none"}
        else
        {output+="\n```"+output2+"```"}
    }
    return {"value":true, "message": output};
}

permissions.help = function(mod, message, data)
{
    var returnal = [];
    var perms = data[message.server.id];
    if(mod.config.ownerids.find(function(x){return x==message.author.id})!=undefined)//check for botowner
    {
        for(var comm in mod.commands)
        {
            var command = mod.commands[comm];
            returnal.push(command.name);
        }
        return returnal;
    }
    if(message.server.owner.id == message.author.id){//check for server owner
        for(var comm in mod.commands)
        {
            var command = mod.commands[comm];
            if(command.permissions.restricted == undefined)   
             returnal.push(command.name);
        }
        return returnal;
    }

    //No (server/bot) owner.
    var authorRoles = message.server.rolesOfUser(message.author);
    var permLevel = 0;
    for(var r in authorRoles)//Get highest role.
    {
        if(authorRoles[r].position > permLevel) permLevel = authorRoles[r].position
    }

    for(var comm in mod.commands)//iterate through the commands
    {
        var command = mod.commands[comm];
        if(!command.permissions.restricted){//skip restricted commands
            var userPerms = perms[command.name].users[message.author.id];//Get user specific permissions
            if(userPerms){//has permissions, skip all further checks
                returnal.push(command.name);
                continue;
            }
            if(userPerms === false)//has explicitily no permissions, skip further checks.
                continue;
            //then, user has no specific permissions,
            if(perms[command.name].blacklist){//check if we are using a blacklist.
                var hasPerms =  true;
                for(var a = 0; a< perms[command.name].roles.length;a++){//iterate through listed roles for this user;
                    if(message.author.hasRole(perms[command.name].roles[a])){//because this is a blacklist, break on finding a matching role.
                        hasPerms = false;
                        break;
                    }
                }
                if(hasPerms)
                    returnal.push(command.name);
            }else{//We are using a whitelist.
                var hasPerms = false;
                for(var a = 0; a < perms[command.name].roles.length;a++){
                    r = message.server.roles.find(function(x){return x.id = perms[command.name].roles[a]});
                    if(r!= undefined && permLevel>=r.position){
                        returnal.push(command.name);
                        hasPerms = true;
                        break;
                    }
                }
            }
        }
    }//end command iterator
    
    return returnal;
}

module.exports = permissions;