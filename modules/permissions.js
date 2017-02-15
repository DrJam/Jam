var Permissions = function(){}//constructor, use this only to initiliase variables NEEDED to be initiliased before onReady. Note that the onReady might not occur before severl other modules have fired their onReady.
Permissions.prototype.Name = "permissions";//string
Permissions.prototype.Dependencies = ["commands"];//strings
Permissions.prototype.Events = []//OPTIONAL, objects of format {type:string,method:functionAsString}
Permissions.prototype.Data = "permissions";//OPTIONAL, string naming the collection module wishes to access
Permissions.prototype.Config = [{"name":"ownerids"}];//OPTIONAL, objects of type {name:attribute}, will been have been expanded to {name:attribute,value:value} by the onReady hits.
Permissions.prototype.onReady = function(pars){//The real constructor.

}

Permissions.prototype.checkPermissions = function(user,command)
{
    return true;
}   


Permissions.prototype.assertCommand = function(command)
{

}

Permissions.prototype.assertServer = function(server)
{

}

module.exports = new Permissions();