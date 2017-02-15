var Commands = function(){
    commands = [];
    isReady = false;
}//constructor

Commands.prototype.Name = "commands";
Commands.prototype.Dependencies = ["permissions"];
Commands.prototype.Events = [{type:"message",method:"onMessage"}];
Commands.prototype.Config = [{name:"prefix"}];
Commands.prototype.onReady = function(pars){
    isReady = true;
    permissions = pars.permissions;
    prefix = this.Config[0].value;
    commands.forEach((x)=>permissions.assertCommand(x));
}

var permissions;
var prefix;
var commands;
var isReady;

Commands.prototype.registerCommand = function(mod, command){
    if(typeof command.process == "function")
        command.mod = null;
    else
        command.mod = mod;

    commands.push(command);
    commands.sort((a,b)=>{
        if(a.mod!=null && b.mod == null)
            return 1
        if(a.mod == null && b.mod !=null)
                return -1;
        if((a.mod == null && b.mod == null) || a.mod.Name == b.mod.Name)
            return (a.name<b.name)? -1 : 1;

        return (a.mod.Name < b.mod.Name)? -1: 1;
    });
    if(isReady)
        permissions.assertCommand(command);
}

Commands.prototype.onMessage = function(message){
    if( ! (message.content.startsWith(prefix) || message.channel.type=="dm"))
        return;
    console.log(message.author +":"+message.content);
    let text = message.content;
    if(message.channel.type!="dm" || text.startsWith(prefix))
         text = text.slice(prefix.length);
    let wordOfCommand = text.split(" ",1)[0];
    let command = commands.find((com)=>{return com.words.some((word)=>{return word == wordOfCommand})});
    if(command==null)
        {
            if(message.channel.type == "dm")
                message.channel.send("I'm sorry, I don't have any command like that.")
            return;
        }
    if(!permissions.checkPermissions(message.author,command))
        {
            message.channel.send("sorry, ur not cool enough for that command");
            return;
        
        }
    text = text.split(" ").splice(1).join(" ");//everything after the first word.
    let params = getParams(text, command.usages);
    if(params === null)
    {
        let output = `Incorrect usage. Below is ${(command.usages.length>1)? "a list of supported usage":"the supported usage" }  or try \`${prefix}help ${wordOfCommand}\`\n`+ "```";
        command.usages.foreach((val)=>{output+=prefix + wordOfCommand+ " <"+val.join("> <")+">\n"})
        message.channel.send(output);
        return;
    }
    if(command.mod == null)
        command.process(message,params)//anonymous function
    else
        command.mod[command.process](message,params);//let the module
}

var paramRegex = /"([^"]*?)"|'([^']*?)'|([\S]+)/g;
var getParams = function (suffix, usages) {
	let paramsArray = getParamsArray(suffix);
    return mapParams(paramsArray, usages);
};
var getParamsArray = function  (suffix) {
	let resultArray = [];
	let paramsArray = [];
	while ((resultArray = paramRegex.exec(suffix)) !== null) {
		if (resultArray[1])
			paramsArray.push(resultArray[1]);
		else if(resultArray[2]) 
            paramsArray.push(resultArray[2]);
        else
            paramsArray.push(resultArray[3]);
	}
	return paramsArray;
}
var mapParams = function  (params, usages) {
	let result = {};
	let bestMatch  = params.length+1;
	for (let i = 0; i < usages.length; i++) {
		if (Math.abs(params.length - usages[i].length) > bestMatch || usages[i].length > params.length) 
			continue;
		let mapping = {};
		bestMatch = Math.abs(params.length - usages[i].length);
		for (let j = 0; j < usages[i].length; j++) {
			mapping[usages[i][j]] = params[j]; 
        }
		for(let j = usages[i].length;j < params.length; j++)
			mapping[usages[i][usages[i].length-1]] += " "+params[j];
        result = {};
        result.usageid = i;
	    result.parameters = mapping;
	}
    if(result == {})
	    return null;
    return result;
}


module.exports = new Commands();