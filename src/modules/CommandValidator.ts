import { config } from "../common/common"
export class commandValidator {
    static validate = (input: string) => {
        if (input.charAt(0) !== config.commandPrefix) {
            return false
        }
        
        return true
    }
}