(function(window, document, global) {

	addCpFunction("powNum", function(args) {
		var result = Math.pow(args[0], args[1]);
		if (!isNaN(result)) {
			logOnConsole(result);
		} else {
			logOnConsole("Invalid parameters!");
		}
	});
	addCpFunction("getRoot", function(args) {
		var result = Math.pow(args[0], 1 / args[1]);
		if (!isNaN(result)) {
			logOnConsole(result);
		} else {
			logOnConsole("Invalid parameters!");
		}
	});

}(window, document, this));