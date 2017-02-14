var MODULE = function(){}//constructor, use this only to initiliase variables NEEDED to be initiliased before onReady. Note that the onReady might not occur before severl other modules have fired their onReady.
MODULE.prototype.Name = "baremodule";//string
MODULE.prototype.Dependencies = [];//strings
MODULE.prototype.Events = []//OPTIONAL, objects of format {type:string,method:functionAsString}
MODULE.prototype.Data = null;//OPTIONAL, string naming the collection module wishes to access
MODULE.prototype.Config = [];//OPTIONAL, objects of type {name:attribute}, will been have been expanded to {name:attribute,value:value} by the onReady hits.
MODULE.prototype.onReady = function(pars){//The real constructor.
}   


module.exports = new MODULE();