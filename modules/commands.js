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
}

var permissions;
var prefix;
var commands;
var isReady;


/* Documentation on registerCommand
    command in form of:
    {
        name: "name" //Primary command name that will appear in help, permissions, etc.
        words: [name,alias1,alias2] //Aliases to also listen for.
        usages: [ //array of allowed usages.
            [] //not caring about any parameters.
            ["par1",etc], //You can name parameters how you want, but be aware that the last parameter contains the remainder of the message.
        ], 
        description: "help" //As it would appear in help.
        process: function(message,parameterObject) //either an anonymous function, which will be executed from commands scope, or a reference to another function, which will be executed from the scope of the supplied mod. The parameterObject is described below, at getParams.
        async: true/false //Optional:if this command will call message.channel.stoptyping by itself. 
        permissions: {global:true/false (,restricted:true)} //The restricted attribute is optional and assumed false if nonexistent.
        allowPrivate: true/false
    }*/
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
}

/* getCommmandByString 
    Returns a list of commands that match a searchstring. If allowpartial is on, and a  true match is found, the trueMatch is returned. (as a list)*/
Commands.prototype.getCommandByString = function(searchstring, allowPartial){
    searchstring = searchstring.toLowerCase();
    if(allowPartial!==true)
        allowPartial = false;
    let returnal = commands.filter((command)=>{
        if( command.words.find((word)=>{
            let a = word.toLowerCase();
            if(a.startsWith(searchstring) && (allowPartial||searchstring.length == a.length))
                return true;
        }) != null)
            return true;
        return false;
    })
    if(allowPartial)
    {
        let trueMatch = returnal.find((val)=>{return val.words.some((val2)=>{return val2 == searchstring})})
        if(trueMatch!=null)
            return [trueMatch];    
    }
    return returnal;
}

/* The actual event handler */
Commands.prototype.onMessage = function(message){
    if( ! (message.content.startsWith(prefix) || message.channel.type=="dm"))
        return;
    let dm = (message.channel.type=="dm")? 1 : 0;
    dm = (message.channel.type=="group") ? 2: dm;
    console.log(message.author +":"+message.content);
    let text = message.content;
    if(dm!=1 || text.startsWith(prefix))
         text = text.slice(prefix.length);
    let wordOfCommand = text.split(" ",1)[0];
    let command = commands.find(
        (com)=>{
            return com.words.some((word)=>{
                return (
                    word == wordOfCommand 
                    && 
                    (
                        (
                            dm>0 
                            &&
                             "allowPrivate" in command
                            && 
                            command.allowPrivate
                        )
                        ||
                        dm==0
                    )
                )
            })
        });
    if(command==null)
    {
        if(dm == 1)//only send a message if we are dm'ing.
            message.channel.send("I'm sorry, I don't have any command like that available for direct messages.")
        return;
    }
    
    message.channel.startTyping();
    permissions.checkPermissionsAsync(message,command).then(
        (val)=>
        {
            
            if(val === false)
                message.channel.send("sorry, ur not cool enough for that command");
            if(val === "ERROR")
                message.channel.send("Something went wrong, sorry about that.");
            if(! ("async" in command && command.async))
                message.channel.stopTyping();
            if(val === true)
                tryToExecuteCommand(message,text,wordOfCommand,command);
            
            //technically, we could receive "IGNORED", in which case we do nothing. So no checks required.
        }
    ).catch((err)=>{
        console.log("ERROR:"+err);
        message.channel.stopTyping()})//if we somehow reach this (which should be impossible), better stop typing.
}

var tryToExecuteCommand = function(message,text,wordOfCommand,command){//Worry not about the permissions.
    text = text.split(" ").splice(1).join(" ");//everything after the first word.
    let params = getParams(text, command.usages);
    if(params === null)
    {
        let output = `Incorrect usage. Below is ${(command.usages.length>1)? "a list of supported usage":"the supported usage" }  or try \`${prefix}help ${wordOfCommand}\`\n`+ "```";
        command.usages.foreach((val)=>{output+=prefix + wordOfCommand+ " <"+val.join("> <")+">\n"})
        message.channel.send(output);
        if("async" in command && command.async)
            message.channel.stopTyping();
        return;
    }
    if(command.mod == null)
        command.process(message,params)//anonymous function
    else
        command.mod[command.process](message,params);//let the module
}

var paramRegex = /"([^"]*?)"|'([^']*?)'|([\S]+)/g;
/* parameterObject
 Returns a parameterObject that looks like:
 {
    usageid: int, // The usage index as defined by the commands usages.
    parameters: {par1:val,par2:val2, etc} //an object where par1, par2,etc are the names of the parameters according to defined usage.
 }     */
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