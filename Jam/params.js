var param = {};

var pRegex = /[\"|\'](.+?)[\"|\']|([^\s]+)/g;

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
	var result = {};
	for (var i = 0; i < usages.length; i++) {
		if (usages[i].length != params.length) 
			continue;

		for (var j = 0; j < usages[i].length; j++) {
			result[usages[i][j]] = params[j]; 
		}
		return result;
	}
	return null;
}

module.exports = param;