/*
 * Copyright 2017 VirtualIceShard
 *
 *Licensed under the Apache License, Version 2.0 (the "License");
 *you may not use this file except in compliance with the License.
 *You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *Unless required by applicable law or agreed to in writing, software
 *distributed under the License is distributed on an "AS IS" BASIS,
 *WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *See the License for the specific language governing permissions and
 *limitations under the License.
 * 
 * 
 * 
 * 
 */

(function(window, document, global) {
	global.logStack = 0;
	global.showTime = false;
	var currDate = new Date();
	var i = 0;
	var tempStr = "temp";
	var currHour = new Date().getHours();
	var currMin = new Date().getMinutes();
	var currHourStr = "00";
	var currMinStr = "00";
	var tempArrayStr;
	var xmlDoc;
	global.ready = false;
	var funcTempArray;
	var xml;
	global.showTime = true;
	global.showReturn = true;
	var newLog2 = "";
	global.maxCharsPerLine = 30;
	global.linesInLog;
	var lastXml;
	var showLog = false;

	global.iscLogOn = function() {
		showLog = true;
		if (showLog) {
			console.log("Log turned on!");
		}
	}
	global.iscLogOff = function() {
		showLog = false;
		if (showLog) {
			console.log("Log turned off!");
		}
	}
	global.includeScript = function(path) {

		if (!ready) {
			if (showLog) {
				console.log("Document not ready!");
			}
			return;
		}
		var jsScript = document.createElement("script");
		jsScript.type = "text/javascript";
		jsScript.src = path;
		document.getElementsByTagName("head")[0].appendChild(jsScript);
	};
	global.setCharsPerLine = function(limit) {
		maxCharsPerLine = limit;
	};
	global.getLogStr = function(lineNum) {

		if (!ready) {
			if (showLog) {
				console.log("Document not ready!");
			}
			return;
		}
		if (lineNum <= linesInLog & lineNum > 0) {
			return document.getElementById("ISC_line" + lineNum).innerHTML;
		} else {
			tempStr = "Invalid line!";
			return tempStr;
		}
	};

	global.setLogStr = function(newLog, line) {

		if (showLog) {
			console.log("setLogStr(" + newLog + "," + line + "); }");
			if (!ready) {
				if (showLog) {
					console.log("Document not ready!");
				}
				return;
			}
			if (line <= linesInLog & line > 0) {

				document.getElementById("ISC_line" + line).innerHTML = newLog;
			} else {
				if (showLog) {
					console.log("Invalid line!");
				}
			}
		}
	};

	global.shiftLog = function(line10) {

		if (!ready) {
			if (showLog) {
				console.log("Document not ready!");
			}
			return;
		}

		if (logStack == linesInLog) {
			for (i = 1; i < linesInLog; i++) {
				setLogStr(getLogStr(i + 1), i);
			}
			setLogStr(line10, linesInLog);

		} else {
			if (showLog) {
				console.log("There are free lines!");
			}
		}
	};

	global.logOnConsole = function(newLog) {

		if (showLog) {
			console.log("logOnConsole(" + newLog + "); }");
			if (!ready) {
				if (showLog) {
					console.log("Document not ready!");
				}
				return;
			}
			currDate = new Date();
			currHour = parseInt(currDate.getHours());
			currMin = parseInt(currDate.getMinutes());

			if (currHour < 10) {
				currHourStr = "0" + currHour;
			} else {
				currHourStr = "" + currHour;
			}

			if (currMin < 10) {
				currMinStr = "0" + currMin;
			} else {
				currMinStr = "" + currMin;
			}
			if (showTime) {
				newLog2 = "[" + currHourStr + ":" + currMinStr + "]  " + newLog;
			} else {
				newLog2 = newLog;
			}
			if (newLog2.length <= maxCharsPerLine) {
				if (newLog2.trim() == "") {
					return;
				}
				if (logStack == linesInLog) {
					shiftLog(newLog2);
				} else {
					setLogStr(newLog2, logStack + 1);
					logStack++;
				}
			} else {

				var strParts = {};
				var r = 0;
				for (var d = 0; d <= Math.floor(newLog2.length
						/ maxCharsPerLine); d++) {
					if (d < Math.floor(newLog2.length / maxCharsPerLine)) {
						strParts[d] = newLog2.substr(d * maxCharsPerLine,
								maxCharsPerLine);
					}
					if (d == Math.floor(newLog2.length / maxCharsPerLine)) {
						strParts[d] = newLog2.substr(d * maxCharsPerLine,
								newLog2.length % maxCharsPerLine);
					}
					r = d + 1;
				}
				for (var j = 0; j < r; j++) {

					if (logStack == linesInLog) {
						if (strParts[j].trim() == "") {
							return;
						}
						shiftLog(strParts[j]);
					} else {
						if (strParts[j].trim() == "") {
							return;
						}
						setLogStr(strParts[j], logStack + 1);
						logStack++;
					}
				}

			}
			for ( var strIndex in strParts) {
				if (showLog) {
					console.log("strIndex::::" + strParts[strIndex]);
				}
			}
		}
		;

		global.breakInArgs = function(command) {

			if (!ready) {
				if (showLog) {
					console.log("Document not ready!");
				}
				return;
			}

			if (showLog) {
				console.log("Args broken");
			}
			return command.trim().split(" ");
		}
	};

	global.runFunc = function(funcName, arg) {

		if (!ready) {
			if (showLog) {
				console.log("Document not ready!");
			}
			return;
		}
		if (showLog) {
			console.log("Invoking function");
		}
		consoleFunctions[funcName](arg);
		if (showLog) {
			console.log("Sucess!");
		}
	};
	global.runFuncNoArgs = function(functName) {

		if (!ready) {
			if (showLog) {
				console.log("Document not ready!");
			}
			return;
		}
		if (showLog) {
			console.log("Invoking function");
		}
		consoleFunctions[functName]();
		if (showLog) {
			console.log("Sucess!");
		}
	};

	global.cmdToFunction = function(command, args) {

		if (!ready) {
			if (showLog) {
				console.log("Document not ready!");
			}
			return;
		}
		if (showLog) {
			console.log("Function called");
		}
		if (showLog) {
			console.log("Started search");
		}
		for (var i = 0; i < xmlDoc.getElementsByTagName("command").length; i++) {

			if (xmlDoc.getElementsByTagName("command")[i].getAttribute("cmd") == command) {
				if (showLog) {
					console.log("Cmd " + command + " found!");
				}
				if (args[0] == "noarg") {
					if (xmlDoc.getElementsByTagName("command")[i]
							.getAttribute("maxargs") == "no"
							& args[0] == "noarg") {
						if (showLog) {
							console.log("No args ok");
						}
						if (showLog) {
							console.log("Running function");
						}
						runFuncNoArgs(xmlDoc.getElementsByTagName("command")[i]
								.getAttribute("function"));
						return;
					}
					if (xmlDoc.getElementsByTagName("command")[i]
							.getAttribute("minargs") == 0) {
						runFunc(xmlDoc.getElementsByTagName("command")[i]
								.getAttribute("function"), [ "noargsused" ]);
						return;

					}
					if (showReturn) {
						logOnConsole("Need parameters!");
					}
					if (showLog) {
						console.log("Need parameters!");
					}
					return;
				} else {
					if (xmlDoc.getElementsByTagName("command")[i]
							.getAttribute("maxargs") == "inf") {
						if (showLog) {
							console.log("Infinite args detected");
						}
						if (parseInt(xmlDoc.getElementsByTagName("command")[i]
								.getAttribute("minargs")) <= args.length) {
							if (showLog) {
								console.log("Min args ok");
							}
							if (showLog) {
								console.log("Running function");
							}
							runFunc(xmlDoc.getElementsByTagName("command")[i]
									.getAttribute("function"), args);
							return;
						} else {
							if (showReturn) {
								logOnConsole("Minimun parameters required!");
							}
							if (showLog) {
								console.log("Minimun parameters required!");
							}
							return;
						}
					} else {

						if (parseInt(xmlDoc.getElementsByTagName("command")[i]
								.getAttribute("maxargs")) >= args.length) {
							if (showLog) {
								console.log("Max args ok");
							}
							if (parseInt(xmlDoc.getElementsByTagName("command")[i]
									.getAttribute("minargs")) <= args.length) {
								if (showLog) {
									console.log("Min args ok");
								}
								if (showLog) {
									console.log("Running function");
								}
								runFunc(
										xmlDoc.getElementsByTagName("command")[i]
												.getAttribute("function"), args);
								return;
							} else {
								if (showReturn) {
									logOnConsole("Minimun parameters required!");
								}
								if (showLog) {
									console.log("Minimun parameters required!");
								}
								return;
							}
						} else {
							if (showReturn) {
								logOnConsole("Too much parameters!");
							}
							if (showLog) {
								console.log("Too much parameters!");
							}
							return;
						}
					}
				}

			}

		}
		if (showLog) {
			console.log(cpsLoaded);
		}
		for ( var h in cpNames) {

			if (showLog) {
				console.log("Searching extra");
			}
			if (showLog) {
				console.log(h + "::" + cpNames[h]);
			}
			if (cpCmds[cpNames[h]] == undefined) {

			} else {
				for (var l = 0; l < cpCmds[cpNames[h]]
						.getElementsByTagName("command").length; l++) {
					if (cpCmds[cpNames[h]] == undefined) {
						if (showReturn) {
							logOnConsole("Invalid command!");
							if (showLog) {
								console.log("Invalid command!");
							}
						}
						if (showLog) {
							console.log("Invalid command!");
						}
						return;
					}
					if (showLog) {
						console.log("Started search");
					}

					if (cpCmds[cpNames[h]].getElementsByTagName("command")[l]
							.getAttribute("cmd") == command) {
						if (showLog) {
							console.log("Cmd " + command + " found!");
						}
						if (args[0] == "noarg") {
							if (cpCmds[cpNames[h]]
									.getElementsByTagName("command")[l]
									.getAttribute("maxargs") == "no"
									& args[0] == "noarg") {
								if (showLog) {
									console.log("No args ok");
								}
								if (showLog) {
									console.log("Running function");
								}
								runFuncNoArgs(cpCmds[cpNames[h]]
										.getElementsByTagName("command")[l]
										.getAttribute("function"));
								return;
							}
							if (cpCmds[cpNames[h]]
									.getElementsByTagName("command")[l]
									.getAttribute("minargs") == 0) {
								runFunc(cpCmds[cpNames[h]]
										.getElementsByTagName("command")[l]
										.getAttribute("function"),
										[ "noargsused" ]);
								return;

							}
							if (showReturn) {
								logOnConsole("Need parameters!");
							}
							if (showLog) {
								console.log("Need parameters!");
							}
							return;
						} else {
							if (cpCmds[cpNames[h]]
									.getElementsByTagName("command")[l]
									.getAttribute("maxargs") == "inf") {
								if (showLog) {
									console.log("Infinite args detected");
								}
								if (parseInt(cpCmds[cpNames[h]]
										.getElementsByTagName("command")[l]
										.getAttribute("minargs")) <= args.length) {
									if (showLog) {
										console.log("Min args ok");
									}
									if (showLog) {
										console.log("Running function");
									}
									runFunc(cpCmds[cpNames[h]]
											.getElementsByTagName("command")[l]
											.getAttribute("function"), args);
									return;
								} else {
									if (showReturn) {
										logOnConsole("Minimun parameters required!");
									}
									if (showLog) {
										console
												.log("Minimun parameters required!");
									}
									return;
								}
							} else {

								if (parseInt(cpCmds[cpNames[h]]
										.getElementsByTagName("command")[l]
										.getAttribute("maxargs")) >= args.length) {
									if (showLog) {
										console.log("Max args ok");
									}
									if (parseInt(cpCmds[cpNames[h]]
											.getElementsByTagName("command")[l]
											.getAttribute("minargs")) <= args.length) {
										if (showLog) {
											console.log("Min args ok");
										}
										if (showLog) {
											console.log("Running function");
										}
										runFunc(
												cpCmds[cpNames[h]]
														.getElementsByTagName("command")[l]
														.getAttribute("function"),
												args);
										return;
									} else {
										if (showReturn) {
											logOnConsole("Minimun parameters required!");
										}
										if (showLog) {
											console
													.log("Minimun parameters required!");
										}
										return;
									}
								} else {
									if (showReturn) {
										logOnConsole("Too much parameters!");
									}
									if (showLog) {
										console.log("Too much parameters!");
									}
									return;
								}
							}
						}

					}
				}
			}
		}
		if (showReturn) {
			logOnConsole("Invalid command!");
			if (showLog) {
				console.log("Invalid command!");
			}
		}
		if (showLog) {
			console.log("Invalid command!");
		}
	};

	window.onload = function() {

		linesInLog = document.getElementsByClassName("IS_consoleLog").length;
		var xhttpIni = new XMLHttpRequest();
		xhttpIni.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				xml = this;
				xmlDoc = xml.responseXML;
			}
		};
		xhttpIni.open("GET", "./libs/cmd/cmds.xml", true);
		xhttpIni.send();
		ready = true;
		consoleFunctions["loadCps"](false);
	};
	global.runCmd = function(cmd) {

		document.getElementById('ISC_cmdInput').value = "";
		if (showLog) {
			console.log("Running cmd");
		}
		if (breakInArgs(cmd).length == 1) {
			if (showLog) {
				console.log("No args detected");
			}
			cmdToFunction(breakInArgs(cmd)[0], [ "noarg" ]);
		} else {
			if (showLog) {
				console.log("Args detected");
			}
			cmdToFunction(breakInArgs(cmd)[0], breakInArgs(cmd).slice(1));
		}
	};
	global.addCpFunction = function(name, func) {

		if (consoleFunctions[name] == undefined) {
			consoleFunctions[name] = func;
		} else {
			if (showLog) {
				console.log("Duplicate function " + name);
			}
		}
	};
	global.addCpVar = function(name, variable) {

		if (consoleVars[name] == undefined) {
			consoleVars[name] = variable;
		} else {
			if (showLog) {
				console.log("Duplicate variable " + name);
			}
		}
	};

}(window, document, this));