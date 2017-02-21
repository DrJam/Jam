const Discord = require("discord.js");
const config = require("./config/config.json");
const assert = require("assert");
var Client = new Discord.Client({disableEveryone:true,disabledEvents:["TYPING_START"]});//this particular event causes a lot of overhead and we don't do anything with it.
Client.token = config.token;
var MongoClient = require("mongodb").MongoClient;
var ModuleManager = require("./ModuleManager.js");
var db = null; //Do we need this? Revaluate.

MongoClient.connect(config.database, (err, _db) =>{
    assert.equal(null, err);
    console.log("Succesfully connected to database!");
    ModuleManager.setDatabase(_db);
    ModuleManager.setConfig(config);
    db = _db;

    console.log("Loading modules..");
    config.modules.forEach((x)=>{
        let load = ModuleManager.load("./modules/"+x+".js");
        if(load.failure === true)
            {console.log("");console.error("Error loading module '"+x+"': "+load.err);process.exit(-1)}
    });

    if(ModuleManager.unresolvedDependencies()!=0)
    {
        console.log(`We have ${ModuleManager.unresolvedDependencies()} unresolved dependencies, autoresolving.`)   
        ModuleManager.autoResolveAllDependencies();
    }

    ModuleManager.registerEvents(Client);

    Client.login();

    console.log("All done!");
});

Client.on("ready",()=>{console.log(`Ready as ${Client.user.username}`)});
