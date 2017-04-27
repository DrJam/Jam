import { config } from "../common/common"
export class CommandValidator {
    static validate(input: string, commands: any) {
        if (input.length < 2) {
            return false
        }
        if (input.charAt(0) !== config.commandPrefix) {
            return false
        }

        var parts = input.slice(1).split(" ")
        var cmd = parts[0]
        if (!commands[cmd])
            return false

        return true
    }
}