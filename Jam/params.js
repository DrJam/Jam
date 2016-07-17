var param = {};

var pRegex = /(?:\"(.*?)\")|([\S]+)/g;

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
		else 
			paramsArray.push(resultArray[2]);
	}
	return paramsArray;
}

function mapParams (params, usages) {
	var mapping = {};
	for (var i = 0; i < usages.length; i++) {
		if (usages[i].length != params.length) 
			continue;

		for (var j = 0; j < usages[i].length; j++) {
			mapping[usages[i][j]] = params[j]; 
        }
        var result = {};
        result.usageid = i;
	    result.parameters = mapping;
	    return result;
	}
	return null;
}

module.exports = param;