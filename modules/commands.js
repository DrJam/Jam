var Commands = function(){}//constructor
var permissions;
var prefix;
Commands.prototype.Name = "commands";
Commands.prototype.Dependencies = [/*,"permissions"*/];
Commands.prototype.Events = [{type:"message",method:"onMessage"}];
Commands.prototype.Config = [{name:"prefix"}];
Commands.prototype.onReady = function(pars){
    //permissions = pars.permissions;
    prefix = this.Config[0].value;

}
Commands.prototype.onMessage = function(message){
    
}



module.exports = new Commands();