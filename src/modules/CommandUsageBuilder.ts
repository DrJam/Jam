import { Command } from "../domain/command"
import { CommandUsage } from "../domain/commandusage"
import { ParametersBuilder } from "./parametersbuilder"

export class CommandUsageBuilder {
    static build(input: string, commands: any) {
        var inputComponents = input.slice(1).split(" ")
        var inputCommandName = inputComponents[0]
        var inputParameters = (inputComponents.length > 1)
            ? ParametersBuilder.build(inputComponents.slice(1).join(" "))
            : []
        var inputUsage: CommandUsage = {
            commandName: inputCommandName,
            parameters: []
        }
        commands[inputCommandName].usages.forEach((usage: Array<string>) => {
            if (usage.length == inputParameters.length)
                usage.forEach((value: string, index: number) => {
                    inputUsage.parameters.push({ key: value, value: inputParameters[index] })
                })
        });
        return inputUsage
    }
}
