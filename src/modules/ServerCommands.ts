import { commandValidator } from "./commandvalidator"
import { client } from "../common/common"
export class ServerCommands {

    static process: (input: string) => void = (input: string) => {
        if (!commandValidator.validate(input))
            return
        
        
        console.log("command success")
    }

}