var loaded;//modules loaded, but not all dependencies are loaded.
var ready;//modules loaded and all dependencies are ready!
var db;
var config;
var ModManager = function(){
    loaded =[];
    ready = [];
};

ModManager.prototype.setDatabase = function(database){
    db = database;
}
ModManager.prototype.setConfig = function(configuration){
    config = configuration
}

ModManager.prototype.unresolvedDependencies = function(){
    return loaded.length;
}

var constructReadyParameters = function(mod){
    let output = {};
    mod.Dependencies.forEach((val)=>{
        let push = loaded.find(
            (x)=>{return x.mod.Name == val;}
        );
        if(push==null)
            push = ready.find(
                (x)=>{return x.Name == val;}
            )
        else
            push = push.mod;
        if(push == null)
        {    if(val!="modmanager")
                throw new Error("Dependency '"+val+"' was not loaded!");
            else
                push = this;
        }
        output[val] = push;
    });
    return output;
}

ModManager.prototype.registerEvents = function(Client){
    ready.forEach((mod)=>{
        if("Events" in mod){
            mod.Events.forEach((eventObject)=>{
                Client.on(eventObject.type,(par1,par2,par3) => {mod[eventObject.method](par1,par2,par3)});
            })
        }
    })
}

ModManager.prototype.load = function(filepath){
    let output = null;
    let failure=  false;
    try{
        output = require(filepath);
    }
    catch(err){
        failure = true;
        output = {failure : true, err: err};
    }
    if(!failure)
    {
        if("Name" in output && "onReady" in output && "Dependencies" in output)
        {
            if("Data" in output && output.Data != null)
                output.Data = db.collection(output.Data);
            if("Config" in output)
                output.Config.forEach((x)=>{
                if(config.hasOwnProperty(x.name))
                            x.value = config[x.name];
                })
            let dependencies = output.Dependencies.filter((val,index,arr)=>{
                return !loaded.some((x)=>{return x.mod.Name==val}) 
                    && !ready.some((x)=>{return x.Name==val}) 
                    && val!=output.Name
                    && val!="modmanager";   
                })
            if(dependencies.length == 0)
                {
                    ready.push(output);
                    output.onReady(constructReadyParameters(output));
                }
            else
                {
                    loaded = loaded.filter((val) => {return val.missing.length!=0});
                    loaded.push({mod:output,missing:dependencies});
                }
            loaded.forEach((val)=>{
                let index =-1;
                while((index = val.missing.indexOf(output.Name))!=-1)
                {
                    val.missing.splice(index,1);
                }
                if(val.missing.length==0){
                    ready.push(val.mod);
                    val.mod.onReady(constructReadyParameters(val.mod));
                }
            loaded = loaded.filter((val)=>{return val.missing.length>0});
            });
        }
        else
        {
            failure = true;
            output = {failure:true, err:"Not a valid ModManager module."};
        }
    }
    return output;
}

ModManager.prototype.autoResolveAllDependencies = function(){
    while(this.unresolvedDependencies()>0){
        let missing = loaded[0].missing;
        let mod = loaded[0].mod;
        missing.forEach((x)=>{
            let result = this.load("./modules/"+x+".js");//probably doesn't work because of scoping issues.
            if(result.failure == true)
                throw new Error("Failure trying to load dependency '"+x+"'");
        })
    }
}

module.exports = new ModManager();