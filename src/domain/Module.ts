import ConfigValue = require("./ConfigValue")
import DiscordEventHandler = require("./DiscordEventHandler")
import MongoDb = require("mongodb")

abstract class Module {
    static moduleName: string
    static dependendcies: Array<string>
    static events: Array<DiscordEventHandler>
    static dataCollectionName: string
    static dataCollection: MongoDb.Collection
    static config: Array<ConfigValue>
    static onReady: Function
}

export = Module