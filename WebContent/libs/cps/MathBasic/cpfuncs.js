(function(window, document, global) {

	addCpFunction("sumNums", function(nums) {
		var result = parseFloat(nums[0]);
		for (var i = 1; i < nums.length; i++) {
			result += parseFloat(nums[i]);
		}
		if (!isNaN(result)) {
			logOnConsole(result);
		} else {
			logOnConsole("Invalid parameters!");
		}
	});
	addCpFunction("minusNums", function(nums) {
		var result = parseFloat(nums[0]);
		for (var i = 1; i < nums.length; i++) {
			result -= parseFloat(nums[i]);
		}
		if (!isNaN(result)) {
			logOnConsole(result);
		} else {
			logOnConsole("Invalid parameters!");
		}
	});
	addCpFunction("timesNums", function(nums) {
		var result = parseFloat(nums[0]);
		for (var i = 1; i < nums.length; i++) {
			result *= parseFloat(nums[i]);
		}
		if (!isNaN(result)) {
			logOnConsole(result);
		} else {
			logOnConsole("Invalid parameters!");
		}
	});
	addCpFunction("divNums", function(nums) {
		var result = parseFloat(nums[0]);
		for (var i = 1; i < nums.length; i++) {
			result /= parseFloat(nums[i]);
		}
		if (!isNaN(result)) {
			logOnConsole(result);
		} else {
			logOnConsole("Invalid parameters!");
		}
	});
	addCpFunction("updtest", function() {
		logOnConsole("New version ok!");
	});

}(window, document, this));