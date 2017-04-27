import Auth = require("../domain/auth")
import Config = require("../domain/config")
import Discord = require("discord.js")
import readline = require("readline")


export var auth: Auth = loadAuth()
export var config: Config = loadConfig()

export var client: Discord.Client = new Discord.Client({
    disableEveryone: true,
    disabledEvents: ["TYPING_START"]
})

export var input = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function loadAuth() {
    var _auth = require("../../config/auth.json")
    return <Auth>{
        token: _auth.token
    }
}

function loadConfig() {
    var _config = require("../../config/config.json")
    return <Config>{
        commandPrefix: _config.commandPrefix,
        database: _config.database,
        enabledPlugins: _config.modules,
        ownerIds: _config.ownerIds,
        status: _config.status
    }
}