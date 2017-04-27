import { auth, client, input } from "./common/common"
import { prefix } from "./common/prefix"
import { ServerCommands } from "./modules/servercommands"

input.on("line", (input: string) => {
    ServerCommands.process(input)
})

client.on("ready", () => {
    console.log(`${prefix.discord} Ready as ${client.user.username}`)
})

client.login(auth.token)
console.log(`${prefix.discord} Logged in`)

