var Permissions = function(){
    ignoredRoles = {};
}//constructor, use this only to initiliase variables NEEDED to be initiliased before onReady. Note that the onReady might not occur before several other modules have fired their onReady.
Permissions.prototype.Name = "permissions";//string
Permissions.prototype.Dependencies = ["commands"];//strings
Permissions.prototype.Events = []//OPTIONAL, objects of format {type:string,method:functionAsString}
Permissions.prototype.Data = "permissions";//OPTIONAL, string naming the collection module wishes to access
Permissions.prototype.Config = [{"name":"ownerids"}];//OPTIONAL, objects of type {name:attribute}, will been have been expanded to {name:attribute,value:value} by the onReady hits.
Permissions.prototype.onReady = function(pars){//The preferred constructor.
    ownerids = this.Config[0].value;
    this.Data.find({ignoredRoles:{$exists:true}}).toArray().then(
        (err,docs)=>
        {
            if(docs)
                docs.forEach((value)=>{
                    ignoredRoles[value.serverid]=value.ignoredRoles;
                })
        }
    )
    commands = pars.commands;
    myself = pars["_you"];
    createCommands();
}
var ownerids;
var ignoredRoles;
var commands;
var myself;

//Returns a promise that returns a single value: true, false, or "IGNORED" or "ERROR".
Permissions.prototype.checkPermissionsAsync = function(message,command){
    let base = simplePermissions(message, command)
    if(base != null)
        return  Promise.resolve(base);
    return this.Data.findOne({serverid:message.guild.id,command:command.name}).then(
        (err,document)=>
        {
            if(err)
                console.error(err);
                return "ERROR";
            if(document.serverid == null)
            {
                document = createNewPermissionsObject(message,command);
            }
            return advancedPermissions(message.author,document);
        }
    );
}

Permissions.prototype.roleperms = function(message, params)
{
    //usages: [["command","add/remove","role"]]
    output = "";
    let command = commands.getCommandByString(params.parameters.command,true);
    if(command.length==1)
    {
        command = command[0];
        if(!("restricted" in command.permissions && command.permissions.restricted))
        {
            let name,id;
            let mat = params.parameters.role.match(/^<@&(\d+)>$/);
            if(mat!=null)
            {
                name = false;
                id = mat[1];
            }
            else
            {
                id = false;
                name = params.parameters.role.toLowerCase();
            }
            if(message.guild.available)
            {
                let role = null;
                if(name!==false)
                    role = message.guild.roles.find(
                        (rol)=>{return rol.name.toLowerCase() == name;}
                    );
                else
                    role = message.guild.roles.get(id);

                if(role === null)//do partial matching if name search failed.
                {
                    role = message.guild.roles.filter((rol)=>{
                        return rol.name.toLowerCase().startsWith(name);
                    })
                    if(role.size>1)
                    {
                        role = 0;
                        output = "The role you specified matched multiple roles, try the full name or a mention.";
                    }
                    else if (role.size==0) role = null;
                    if(role!=0)
                        role = role.first();
                }
                if(!(role ==  null || role == undefined || role == 0))//if atleast one role getter worked.
                {//we are now asynchronous!.
                    myself.Data.findOne({serverid:message.guild.id,command:command.name}).then((err,doc)=>
                    {
                        if(! (doc))
                            doc = createNewPermissionsObject(message,command);
                        switch(params.parameters["add/remove"].toLowerCase())
                        {
                            case "add": case "+": case "insert":
                                if(doc.roles.indexOf(role.id)==-1)
                                    {
                                        doc.roles.push(role.id);
                                        output = "\""+role.name+"\" succesfully added to this command's ";
                                        output += (doc.blacklist) ? "blacklist." : "whitelist.";
                                        myself.Data.updateOne({serverid:message.guild.id,command:command.name},{roles:doc.roles});
                                    }
                                else
                                {
                                    output= `"${role.name}" is already on the list for this command. Maybe you are using a ${doc.blacklist ? "blacklist" : "whitelist"} when you want to be using a ${doc.blacklist ? "whitelist" : "blacklist"} instead.`
                                }
                                break;
                            case "remove": case "delete": case "rem": case "del": case "-":
                             if(doc.roles.indexOf(role.id)!=-1)
                                    {
                                        doc.roles.splice(doc.roles.find(role.id),1);
                                        output = "\""+role.name+"\" succesfully removed from this command's "
                                        output += (doc.blacklist) ? "blacklist." : "whitelist.";
                                        myself.Data.updateOne({serverid:message.guild.id,command:command.name},{roles:doc.roles});
                                    }
                                else
                                {
                                    output= `${role.name} is not on the list for this command. Maybe you are using a ${doc.blacklist ? "blacklist" : "whitelist"} when you want to be using a ${doc.blacklist ? "whitelist" : "blacklist"} instead.`
                                }
                                break;
                            default: output = "What do you want to do? Please use 'add' or 'remove'.";break;
                        }
                        message.channel.sendMessage(output,{disableEveryone:true});
                        message.channel.stopTyping();
                    })
                }
                else
                {
                    if(role!==0)
                        output = "There's no role on this server matching that role.";
                }
            }
            else
            {
                output="Something went wrong!";
            }

        }
        else
        {
            output = "That's a restricted command, and those permissions can't be changed.";
        }
 
    }
    else
    {
        if(command.length>1)
            output = "The command you specified matches multiple commands, please refine your modification.";
        else
            output = "There's no command matching that command.";
    }
    if(output!=""){//Our delete and add methods are asynchronous, and will send out their own messages.
        message.channel.sendMessage(output,{disableEveryone:true});
        message.channel.stopTyping();
    }
}

var createCommands = function()
{
        commands.registerCommand(myself,//roleperms
        {
            name: "roleperms",
            words: ["roleperms","permroles"], 
            usages: [
                ["command","add/remove","role"]
            ],
            description: "Adds or removes a role to a command. What that does exactly depends on whether or not this command is using a blacklist.",
            process: "roleperms",
            async: true,
            permissions: { global: false },
            allowPrivate: false
        }
    );
}

var createNewPermissionsObject = function(message, command, dontAutoInsert){
    let obj =  {
            serverid:message.guild.id,
            command:command.name,
            users:{},
            roles:[],
            blacklist:command.permissions.global
        };
    if(! (dontAutoInsert))
        myself.Data.insertOne(obj);
    return obj;
}

var createNewIgnoredRolesObject = function(serverid,dontAutoInsert){
    let obj = {
            serverid:serverid,
            ignoredRoles:[]
        };
     if(! (dontAutoInsert))
        myself.Data.InsertOne(obj);
     return obj;
}

//returns true or false.
var advancedPermissions = function(member, permissionsObject){
    if(permissionsObject.users.hasOwnProperty(member.id))
        return permissionsObject.users[member.id];

    if(permissionsObject.blacklist && permissionsObject.roles.some((roleid)=>{return member.roles.has(roleid);}))
        return false;
    if(permissionsObject.whitelist)
    {
        let output = false;let cleanup = false;
        output = permissionsObject.roles.some((roleid)=>
            {
                if(member.guild.roles.has(roleid)){
                    let position = member.guild.roles.get(roleid).position;
                    return member.roles.some((role)=>{return role.position>position});//since we have already ignored the ignored roles, we can safely do this.
                }
                else{
                    cleanup = true;
                }
            }
        )
        if(cleanup){
            permissionsObject.roles = permissionsObject.filter((x)=>{return member.guild.roles.has(x);})
            Data.updateOne({serverid:permissionsObject.serverid,command:permissionsObject.command},permissionsObject);
        }
        return output;
    }
}   

//returns true, false, "IGNORED" if it's sure, and null if it doesn't know.
var simplePermissions = function(message, command){
    let dm = false;
    let user  = message.author;

    if(message.channel.type == "dm"||message.channel.type == "group")
        dm = true;
    else
        try{user = message.member;}catch(err){console.log("user left guild before message was handled, probably: "+err);}
    
    if(ownerids.some((id)=>{return user.id == id} ))
        return true;
    if("restricted" in command.permissions && command.permissions.restricted === true)//we already checked for ownerids.
        return false;
    
    if(dm)//commands handles whether or not the command is allowed to be use in dms. I suppose this check is redundant, since it's unlikely for there to be unrestricted commands that aren't global AND aren't server specific (since the global restriction only matters when it shouldn't be enabled by default on a server), but it never hurts to make sure. --Harb
        if("global" in command.permissions && command.permissions.global ==true)
            return true;
        else
            return false;
    else
        if(message.guild.ownerID == user.id)
            return true;
    
    if(!ignoredRoles.hasOwnProperty(message.guild.id)){
        ignoredRoles[message.guild.id] = createNewIgnoredRolesObject(message.guild.id);
    }
    if(ignoredRoles[message.guild.id].some((val)=>{return member.roles.has(val)}))
        return "IGNORED";

    return null;
}

module.exports = new Permissions();