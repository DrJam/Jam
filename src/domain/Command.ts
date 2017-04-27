export class Command {
    name: string
    usages: Array<Array<string>>
    method: (parameters: Array<{ key: string, value: string }>) => void
}