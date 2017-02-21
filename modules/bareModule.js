var bareModule = function(){}//constructor, use this only to initiliase variables NEEDED to be initiliased before onReady. Note that the onReady might not occur before severl other modules have fired their onReady.
bareModule.prototype.Name = "baremodule";//string
bareModule.prototype.Dependencies = [];//strings
bareModule.prototype.Events = []//OPTIONAL, objects of format {type:string,method:functionAsString}
bareModule.prototype.Data = null;//OPTIONAL, string naming the collection module wishes to access
bareModule.prototype.Config = [];//OPTIONAL, objects of type {name:attribute}, will been have been expanded to {name:attribute,value:value} by the time onReady hits.
bareModule.prototype.onReady = function(pars){//The real constructor.
}   


module.exports = new bareModule();