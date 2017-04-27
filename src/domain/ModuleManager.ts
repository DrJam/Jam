import Config = require("./config")
import MongoDb = require("mongodb")
import ErrorReport = require("./errorreport")
import Module = require("./module")

class ModuleManager {
    loaded: boolean
    ready: boolean
    db: MongoDb.Db
    config: Config


    loadAll: () => ErrorReport;

    constructor(db: MongoDb.Db, config: Config) {
        var self = this
        self.db = db
        self.config = config

        self.loadAll = () => {
            var result: ErrorReport = { success: true, message: "" }

            config.modules.forEach((moduleName: string, index: number, array: string[]) => {

            })

            if (!result.success) {
                return result
            }
                    

            return result
        }
        function loadModule(moduleName: string, errorReport: ErrorReport) {
            try {
                return require(`../modules/${moduleName}`)
            }
            catch (err) {
                errorReport.success = false
                if (errorReport.message == "")
                    errorReport.message = "Could not load: "
                errorReport.message += `${moduleName} `
            }
        }

    }
}

export = ModuleManager