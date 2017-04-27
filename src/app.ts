import fs = require("fs")
import Discord = require("discord.js")
import assert = require("assert")
import MongoDb = require("mongodb")
import Auth = require("./domain/auth")
import Config = require("./domain/config")
import prefix = require("./domain/prefix")
import ModuleManager = require("./domain/modulemanager")

const MongoClient = MongoDb.MongoClient
const client: Discord.Client = new Discord.Client({
    disableEveryone: true,
    disabledEvents: ["TYPING_START"]
})
const auth: Auth = require("../config/auth.json")
const config: Config = require("../config/config.json")
var moduleManager: ModuleManager

MongoClient.connect(config.database, (err: MongoDb.MongoError, db: MongoDb.Db) => {
    if (err != null) {
        console.log(`${prefix.db} ${prefix.error} Could not connect to db`)
        process.exit()
    }
    console.log(`${prefix.db}Connected`)
    main(db)
})

function main(db: MongoDb.Db) {
    moduleManager = new ModuleManager(db, config)
    console.log(`${prefix.app} Loading Modules`)
    var loadModules = moduleManager.loadAll()
    if (loadModules.success) {
        console.log(`${prefix.modules}Modules loaded successfully`)
    }
    else {
        console.log(`${prefix.modules}${loadModules.message}`)
        process.exit()
    }

    client.on("ready", () => {
        console.log(`${prefix.discord} Ready as ${client.user.username}`)
    })

    client.login(auth.token)
    console.log(`${prefix.discord} Logged in`)
}