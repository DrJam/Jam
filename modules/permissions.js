var Permissions = function(){
    ignoredRoles = {};
}//constructor, use this only to initiliase variables NEEDED to be initiliased before onReady. Note that the onReady might not occur before severl other modules have fired their onReady.
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
            docs.forEach((value)=>{
                ignoredRoles[value.serverid]=value.ignoredRoles;
            })
        }
    )
}
var ownerids;
var ignoredRoles;

//Returns a promise that returns a single value: true, false, or "IGNORED" or "ERROR".
Permissions.prototype.checkPermissionsAsync = function(message,command)
{
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

var createNewPermissionsObject = function(message, command)
{
    let obj =  {
            serverid:message.guild.id,
            command:command.name,
            users:{},
            roles:[],
            blacklist:command.permissions.global
        };
    this.Data.InsertOne(obj);
    return obj;
}

var createNewIgnoredRolesObject = function(serverid)
{
    let obj = {
            serverid:serverid,
            ignoredRoles:[]
            };
     this.Data.InsertOne(obj);
     return obj;
}

var advancedPermissions = function(member, permissionsObject)
{
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

var simplePermissions = function(message, command)//returns true, false, "IGNORED" if it's sure, and null if it doesn't know.
{
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