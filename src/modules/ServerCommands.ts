import { client } from "../common/common"
import { CommandValidator } from "./commandvalidator"
import { CommandUsageBuilder } from "./commandusagebuilder"
import { Command } from "../domain/command"
import { CommandUsage } from "../domain/commandusage"

export class ServerCommands {
    static commands = {
        "test": <Command>{
            name: "test",
            usages: [
                ["input"]
            ],
            method: (parameters: Array<{ key: string, value: string }>) => {
                console.log(parameters["input"].value)
            }
        }
    }


    static process: (input: string) => void = (input: string) => {
        if (!CommandValidator.validate(input, ServerCommands.commands))
            return

        var usage = CommandUsageBuilder.build(input, ServerCommands.commands)
        ServerCommands.commands[usage.commandName].method(usage.parameters)
        console.log("command success")
    }

}