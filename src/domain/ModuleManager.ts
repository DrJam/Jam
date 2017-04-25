import Config = require("./config")

class ModuleManager {
    loaded: boolean = false
    ready: boolean = false
    db
    config: Config

    constructor() {
    }
}

export = ModuleManager