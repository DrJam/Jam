permissions = {};
permissions.config = require("../config/config.json");

permissions.addRole = function(mod, message,command,role,data)
{
    if(mod.commands[command]==undefined || mod.commands[command].permissions.restricted != undefined)
        return {"value": true, "message":  "That command does not exist, or does not allow permissions modifying!"};

    role = message.guild.roles.find(function(x){return x.name.toLowerCase() == role.toLowerCase()})
    if(role ==undefined)
        return {"value": true , "message" : "That role does not exist!"};

    data[message.guild.id][command].roles.push(role.id);

    logChannel = message.guild.channels.find(function(x){return x.name=="logs"});
    if(logChannel!=undefined)
        if(data[message.guild.id][command].blacklist)
            logChannel.send(`${message.author.username}#${message.author.discriminator} made ${role.name} role NO LONGER allowed to use ${command}.`,{"disableEveryone":true});
        else
            logChannel.send(`${message.author.username}#${message.author.discriminator} made all roles above and including ${role.name} now allowed to use ${command}.`,{"disableEveryone":true});

    return {"value": true, "message": "Role succesfully added."};

}

permissions.deleteRole =  function (mod, message, command, role, data)
{
    if(mod.commands[command]==undefined || mod.commands[command].permissions.restricted != undefined)
        return {"value": true, "message":  "That command does not exist, or does not allow permissions modifying!"};

    role = message.guild.roles.find(function(x){return x.name.toLowerCase() == role.toLowerCase()})
    if(role == undefined)
        return {"value": true, "message":"Role does not exist in server."};

    var index = data[message.guild.id][command].roles.indexOf(role.id);    
    if( index == -1)
        return {"value": true, "message" : "That role does not have any special permissions for this command."};
    
    data[message.guild.id][command].roles.splice(index,1);

    logChannel = message.guild.channels.find(function(x){return x.name=="logs"});
    if(logChannel!=undefined)
        if(data[message.guild.id][command].blacklist)
            logChannel.send(`${message.author.username}#${message.author.discriminator} made the ${role.name} role now allowed to use ${command} again.`,{"disableEveryone":true});
        else
            logChannel.send(`${message.author.username}#${message.author.discriminator} made the ${role.name} role no longer permitted to use ${command}.`,{"disableEveryone":true});

    return {"value": true, "message": "Role succesfully removed!"};
}

permissions.addUser =  function(mod, message,command,value,data)
{
    if(message.mentions.users.array().length==0)
        return {"value": false}
    
    var user = message.mentions.users.first();
    user = message.guild.member(user);

    if(mod.commands[command]==undefined || mod.commands[command].permissions.restricted != undefined)
        return {"value": true, "message": "That command does not exist, or does not allow permissions modifying!"};
    
    value = value.toLowerCase();
    if(value !== "true" && value !== "false" && value !== "allow" && value !== "deny")
        return {"value": true, "message": `Please use "true", "allow", "deny" or "false"! I'm not THAT smart.`};

    var output = "";
    if(data[message.guild.id][command].users[user.id] == undefined)
        output = "Explicit user permissions added!";
    else
        output = "Explicit user permissions overwritten!";    
    data[message.guild.id][command].users[user.id] = (value == "true"|| value == "allow");

    logChannel = message.guild.channels.find(function(x){return x.name=="logs"});
    if(logChannel!=undefined)
        logChannel.send( `${message.author.username}#${message.author.discriminator} added explicit permissions on \`${command}\` for ${user.user.username}#${user.user.discriminator} which were set to "${value}"`,{"disableEveryone":true});
    return {"value": true, "message": output}; 
}

permissions.deleteUser = function(mod, message,command,data)
{
    if(message.mentions.users.array().length == 0)
        return {"value":false};
    
        var user = message.mentions.users.first();
        user = message.guild.member(user);

    if(mod.commands[command]==undefined || mod.commands[command].permissions.restricted != undefined)
        return {"value": true, "message": "That command does not exist, or does not allow permissions modifying!"};
    
    if(data[message.guild.id][command].users[user.id] == undefined)
        return {"value": true, "message": "This user does not have any associated permissions for this command."}
    
    logChannel = message.guild.channels.find(function(x){return x.name=="logs"});
    if(logChannel!=undefined)
        logChannel.send(`${message.author.username}#${message.author.discriminator} removed explicit permissions on \`${command}\` for ${user.user.username}#${user.user.discriminator} `,{"disableEveryone":true});

    delete data[message.guild.id][command].users[user.id];
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
    if(data[message.guild.id][command].blacklist == value)
            return {"value": true, "message": `This command is already a ${listType}.`}
    
    data[message.guild.id][command].blacklist = value;
    data[message.guild.id][command]. roles = [];

    logChannel = message.guild.channels.find(function(x){return x.name=="logs"});
    if(logChannel!=undefined)
        logChannel.send( `${message.author.username}#${message.author.discriminator} switched ${command} to a ${listType}. All associated role permissions have been wiped.`,{"disableEveryone":true});

    return {"value": true, "message": `Command succesfully switched to ${listType}. All associated roles have been wiped.`};
}

permissions.getBlacklist = function(mod, message, command, data)
{
    if(mod.commands[command]==undefined || mod.commands[command].permissions.restricted != undefined)
        return {"value": true, "message": "That command does not exist, or does not allow permissions modifying!"};
    

    var listType = (data[message.guild.id][command].blacklist) ? "blacklist" : "whitelist";
    output = `This command uses a ${listType}. This means that if a user has a listed role, `;
    if(listType == "blacklist")
        output += "they will **not** be allowed to use this command." ;
    else
        output += "or a role higher than it, they will be allowed to use use this command";
    return {"value": true, "message": `${output}`};
}

permissions.addIgnoredRole = function(mod, message, role, data)
{
    role = message.guild.roles.find(function(x){return x.name.toLowerCase() == role.toLowerCase()})
    if(role ==undefined)
        return {"value": true , "message" : "That role does not exist!"};

    server = message.guild;

    if(data[server.id]._ignoredRoles.find(function(x){return x == role.id}) != undefined)
        return {"value": true , "message" : "That role is already ignored!"};
    
    data[server.id]._ignoredRoles.push(role.id);

    var logChannel = server.channels.find(function(x){return x.name == "logs";});
    if(logChannel!= undefined)
        logChannel.send(`${message.author.username}#${message.author.discriminator} added ${role.name} to the list of ignored roles for permissions.`,{"disableEveryone":true})
    
    return {"value": true , "message" : `${role.name}  was added to the list of ignored roles for permissions checking.`};
}

permissions.removeIgnoredRole = function(mod,message, role, data){

    role = message.guild.roles.find(function(x){return x.name.toLowerCase() == role.toLowerCase()})
    if(role ==undefined)
        return {"value": true , "message" : "That role does not exist!"};

    server = message.guild;

    var id = data[server.id]._ignoredRoles.find(function(x){return x == role.id});
    if(id == undefined)
        return {"value": true , "message" : "That role isn't being ignored!"};
    
    data[server.id]._ignoredRoles.splice(data[server.id]._ignoredRoles.indexOf(id),1);

    var logChannel = server.channels.find(function(x){return x.name == "logs";});
    if(logChannel!= undefined)
        logChannel.send(`${message.author.username}#${message.author.discriminator} removed ${role.name} from the list of ignored roles for permissions.`,{"disableEveryone":true})
    
    return {"value": true , "message" : `${role.name}  was removed to the list of ignored roles for permissions checking.`};
}

permissions.listIgnoredRoles = function(message,data){
    server = message.guild;
    var outputList = [];
    for(var a = 0; a<data[server.id]._ignoredRoles.length;a++)
    {
        var role = data[server.id]._ignoredRoles[a];
        role = server.roles.find(function(x){return x.id == role});
        if(role == undefined){//role no longer exists, so just clean it up
            data[server.id]._ignoredRoles.splice(a,1);
            a--;
        }
        else
        {
            var temp = role.name;
            if(temp.includes(" "))
                temp = "\""+temp+"\"";
            outputList.push(temp);
        }
    }
    if(outputList.length>0)
        return {"value":true, "message": `I am ignoring the following roles whenever I check for permissions:\n${outputList.join(", ")}`};
    else
        return {"value":true, "message": `I am not ignoring any roles when checking for permissions.`};
}

permissions.reset = function(mod, message, command, data)
{
    if(mod.commands[command]==undefined || mod.commands[command].permissions.restricted != undefined)
        return {"value": true, "message": `That command does not exist or does not allow permissions modifying!`};
    
    data[message.guild.id][command] =  {"blacklist": mod.commands[command].permissions.global,"roles":[],"users":{}};
    
    logChannel = message.guild.channels.find(function(x){return x.name=="logs"});
    if(logChannel!=undefined)
        logChannel.send( `${message.author.username}#${message.author.discriminator} reset the permissions for ${command}`,{"disableEveryone":true});

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
        var perms = data[message.guild.id][command];
        output+= `Blacklist: ${perms.blacklist}\n`;
        output+= `Roles:`;
            for(var a =0; a<perms.roles.length;a++){
                var r = message.guild.roles.find(function(x){return x.id == perms.roles[a]})
                if(r!=undefined)
                    output+= " "+r.name;   
            }
            output+="\n";
        output+= "Users:";
        var output2 = "";
        for(var userId in perms.users){
            if(message.guild.members.get(userId)!=undefined)
            {
                var userStuff = message.guild.members.get(userId)
                output2+= `${userStuff.user.username}#${userStuff.user.discriminator}`;  
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
    var perms = data[message.guild.id];
    if(mod.config.ownerids.find(function(x){return x==message.author.id})!=undefined)//check for botowner
    {
        for(var comm in mod.commands)
        {
            var command = mod.commands[comm];
            returnal.push(command.name);
        }
        return returnal;
    }
    if(message.guild.owner.id == message.author.id){//check for server owner
        for(var comm in mod.commands)
        {
            var command = mod.commands[comm];
            if(command.permissions.restricted == undefined)   
             returnal.push(command.name);
        }
        return returnal;
    }

    //No (server/bot) owner.
    var authorRoles = message.member.roles.array();
    var permLevel = 0;
    for(var r in authorRoles)//Get highest role.
    {
        if(perms._ignoredRoles.find(function(x){return authorRoles[r].id == x}) == undefined && authorRoles[r].position > permLevel)
            permLevel = authorRoles[r].position;
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
                    r = message.guild.roles.find(function(x){return x.id == perms[command.name].roles[a]});
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