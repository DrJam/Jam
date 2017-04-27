export class ParametersBuilder {
    //https://regex101.com/r/zZ1dU0/1
    static parameterRegex: RegExp = /"([^"]*?)"|'([^']*?)'|([\S]+)/g;

    static build(input: string) {
        var resultArray: RegExpExecArray
        var paramsArray: string[] = [];
        while ((resultArray = ParametersBuilder.parameterRegex.exec(input)) !== null) {
            if (resultArray[1])
                paramsArray.push(resultArray[1]);
            else if (resultArray[2])
                paramsArray.push(resultArray[2]);
            else
                paramsArray.push(resultArray[3]);
        }
        return paramsArray;
    }
}