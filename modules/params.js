var param = {};

//https://regex101.com/r/zZ1dU0/1
var pRegex = /"([^"]*?)"|'([^']*?)'|([\S]+)/g;

param.getParams = function (suffix, usages) {
	var paramsArray = getParamsArray(suffix);
    return mapParams(paramsArray, usages);
};

function getParamsArray (suffix) {
	var resultArray = [];
	var paramsArray = [];
	while ((resultArray = pRegex.exec(suffix)) !== null) {
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

module.exports = param;
