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
modManagar.prototype.setConfig = function(configuration){
    config = configuration
}

ModManager.prototype.unresolvedDependencies = function(){
    return loaded.length;
}

var constructReadyParameters = function(mod){
    let output = {};
    mod.Dependencies.forEach((val)=>{
        let push = loaded.find(
            (x)=>{return x.Name == val;}
        );
        if(push==null)
            push = ready.find(
                (x)=>{return x.Name == val;}
            )
        if(push == null && val!="modmanager")
            throw new Error("Dependency '"+val+"' was not loaded!");
        else
            push = this;
        output[val] = push;
    });
    return output;
}

ModManager.prototype.registerEvents = function(Client){
    ready.forEach((mod)=>{
        if("Events" in mod){
            mod.Events.forEach((eventObject)=>{
                Client.on(eventObject.type,mod[eventObject.method]);
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
            let dependencies = output.Dependencies.filter((val,index,arr)=>{
                return !loaded.some((x)=>{return x.Name==val}) 
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
                    loaded.forEach((val)=>{
                        let index =-1;
                        while((index = val.missing.indexOf(output.Name))!=-1)
                        {
                            val.missing.splice(index,1);
                        }
                        if(val.missing.length==0){
                            ready.push(val.mod);
                            val.mod.onReady(constructReadyParameters(val.obj));
                        }
                    });
                    loaded = loaded.filter((val) => {return val.missing.length!=0});
                    loaded.push({mod:output,missing:dependencies});
                }
        }
        else
        {
            failure = true;
            output = {failure:true, err:"Not a valid ModManager module."};
        }
        if("Data" in output && output.Data != null)
            output.Data = db.collection(output.Data);
        if("Config" in output)
            output.Config.forEach((x)=>{
                if(config.hasOwnProperty(x.name))
                    x.value = config[x.name];
            })
    }
    return output;
}

ModManager.prototype.autoResolveAllDependencies = function(){
    loaded.forEach((val)=>{
        let missing = val.missing;
        let mod = val.mod;
        missing.forEach((x)=>{
            let result = this.load("./modules/"+x+".js");//probably doesn't work because of scoping issues.
            if(result.failure == true)
                throw new Error("Failure trying to load dependency '"+x+"'");
        })
    });
}

module.exports = new ModManager();