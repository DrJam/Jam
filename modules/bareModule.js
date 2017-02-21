var bareModule = function(){}
bareModule.prototype.Name = "baremodule";//string
bareModule.prototype.Dependencies = [];//strings
bareModule.prototype.Events = []//OPTIONAL, objects of format {type:string,method:functionAsString}
bareModule.prototype.Data = null;//OPTIONAL, string naming the collection module wishes to access
bareModule.prototype.Config = [];//OPTIONAL, objects of type {name:attribute}, will been have been expanded to {name:attribute,value:value} by the time onReady hits.
bareModule.prototype.onReady = function(pars){//The preferred constructor.
}   


module.exports = new bareModule();