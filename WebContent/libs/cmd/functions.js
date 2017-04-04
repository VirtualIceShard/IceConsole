/*!
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
 */
(function(window, document, global) {
	global.consoleFunctions = {};
	global.consoleVars = {};
	global.cpCmds = {};
	global.cpNames = {};
	global.cpVers = {};
	global.cpsLoaded = 0;
	global.cpList;
	global.cpListArray;
	global.depsLoaded = 0;
	var cpListXml;
	// Native functions!
	consoleFunctions["changeSettings"] = function(args) {
		if (args[0] == "check") {
			if (args[1] == "showtime") {
				if (showTime) {
					logOnConsole("Show time: true");
					return;
				} else {
					logOnConsole("Show time: false");
					return;
				}
			}
			if (args[1] == "showreturn") {
				if (showReturn) {
					logOnConsole("Show return: true");
					return;
				} else {
					logOnConsole("Show return: false");
					return;
				}
			}
		}

		if (args[0] == "set") {
			if (args[1] == "showreturn") {
				if (args[2] == "0") {
					if (showReturn) {
						logOnConsole("Show return set to false");
					}
					showReturn = false;
					return;
				}
				if (args[2] == "1") {
					logOnConsole("Show return set to true");
					showReturn = true;
					return;
				}
			}
			if (args[1] == "showretime") {
				if (args[2] == "0") {
					if (showReturn) {
						logOnConsole("Show time set to false");
					}
					showTime = false;
					return;
				}
				if (args[2] == "1") {
					logOnConsole("Show time set to true");
					showTime = true;
					return;
				}
			}
		}

		if (args[0] == "reset") {
			showTime = true;
			showReturn = true;
			logOnConsole("Values reseted to default");
			return;
		}
		if (showReturn) {
			logOnConsole("Invalid operation!");
			console.log("-settings invalid operation!");
		}
	};

	consoleFunctions["displayText"] = function displayText(txt) {
		var tempFuncStr = txt.join(" ");

		logOnConsole(tempFuncStr.trim());
	};
	consoleFunctions["showTime"] = function() {
		noarg = "no arguments used";
		logOnConsole("" + new Date());
	};

	consoleFunctions["clearLog"] = function() {
		for (var i = 1; i <= 10; i++) {
			setLogStr("", i);
		}
		logStack = 0;
	};
	consoleFunctions["cpsTempLoad"] = function(path, name, version, isupd) {
		console.log("cpsTempLoad(" + path + "," + name + "," + version + ");");
		var ajxReq = new XMLHttpRequest();
		ajxReq.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var tempCpXml = this;
				var tempCpXmlDoc = tempCpXml.responseXML;
				cpCmds[name] = tempCpXmlDoc;
				if (cpsLoaded == 0) {
					console.log("cps loaded == 0");
					cpNames[0] = name;
					cpVers[cpNames[0]] = version;
					if (!isupd) {
						includeScript(path + "/cpfuncs.js");
						console.log("Script reload called");
					}
					cpsLoaded += 1;
					return;
				} else {
					for (var n = 0; n >= 0; n++) {
						if (cpNames[n] == undefined) {
							console.log(n);
							cpNames[n] = name;
							cpVers[cpNames[n]] = version;
							if (!isupd) {
								includeScript(path + "/cpfuncs.js");
								console.log("Script reload called");
							}
							cpsLoaded += 1;
							break;
						}
					}
				}
			}

		}

		ajxReq.open("GET", path + "/cpcmds.xml", true);
		ajxReq.send();

	};
	consoleFunctions["isCpUpdate"] = function(verstring, name) {
		console.log("Comparing  " + parseFloat(verstring) + "::::"
				+ parseFloat(cpVers[name]));
		if (parseFloat(verstring) <= parseFloat(cpVers[name])) {
			return false;
		} else {
			return true;
		}
	};

	consoleFunctions["isCpInstalled"] = function(name) {
		for ( var temp5 in cpNames) {
			if (cpNames[temp5] == name) {

				return true;
			}
		}
		return false;
	};
	consoleFunctions["loadCps"] = function(reload) {
		try {

			var j = 0;
			if (ready) {

				var xhttp = new XMLHttpRequest();
				xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						var xmlTemp = this;
						cpList = xmlTemp.responseXML;
						cpListArray = cpList
								.getElementsByTagName("command-package");
						if (cpListArray.length == 0) {
							logOnConsole("No cps found");
						}
						console.log(cpListArray.length + " cps in list");
						[].forEach
								.call(
										cpListArray,
										function(currElement, index) {
											var dependenciesList = currElement.childNodes;
											for (var s = 0; s < dependenciesList.length; s++) {
												if (dependenciesList[s].nodeType == Node.ELEMENT_NODE) {
													console
															.log(dependenciesList[s]);
													includeScript(currElement
															.getAttribute("path")
															+ "/dependencies/"
															+ dependenciesList[s]
																	.getAttribute("filename"));
													console
															.log("Dependency "
																	+ dependenciesList[s]
																			.getAttribute("name")
																	+ " loaded");
													depsLoaded++;
												}
											}
											includeScript(currElement
													.getAttribute("path")
													+ "/cpfuncs.js");
											var xhttp2 = new XMLHttpRequest();
											xhttp2.onreadystatechange = function() {
												if (this.readyState == 4
														&& this.status == 200) {
													var xmlTemp2 = this;
													var xmlTemp3 = xmlTemp2.responseXML;
													console.log(currElement)
													console
															.log(currElement
																	.getAttribute("name")
																	+ " stored");
													cpCmds[currElement
															.getAttribute("name")] = xmlTemp3;
													console.log("cmdTemp::");
													console.log(xmlTemp3);
													cpNames[index] = currElement
															.getAttribute("name");
													console
															.log("name::"
																	+ currElement
																			.getAttribute("name"));
													cpVers[cpNames[index]] = currElement
															.getAttribute("version");
													console
															.log("version::"
																	+ cpVers[cpNames[index]]);

													j++;
													cpsLoaded++;
													if (index + 1 == cpListArray.length) {
														if (!reload) {
															logOnConsole(j
																	+ " cps loaded");
															if (depsLoaded == 0) {
																logOnConsole("No dependencies found");
															} else {
																logOnConsole(depsLoaded
																		+ " dependencies loaded");
															}
														} else {
															console
																	.log("Reloaded cps");
														}
														j = 0;
													}
												}

											};
											xhttp2.open("GET", currElement
													.getAttribute("path")
													+ "/cpcmds.xml", true);
											xhttp2.send();

										});

					}

				};
				xhttp.open("GET", "./libs/cmd/loadcplist.php", true);
				xhttp.send();

			}
		} catch (err) {
			console.log(err.message);
		}
	};
	consoleFunctions["depsTempLoad"] = function(path, depList) {
		for (var t = 0; t < depList.length; t++) {
			if (depList[t].nodeType == Node.ELEMENT_NODE) {
				includeScript(path + "/dependencies/"
						+ depList[t].getAttribute("filename"));
			}
		}
	}
	consoleFunctions["installCp"] = function(path, isupd) {
		try {
			var abort = false;
			var cpTag;
			var tempCpInfo;
			var xhttpReq;
			if (ready) {
				var xhttpReq = new XMLHttpRequest();
				xhttpReq.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						var xmlTemp4 = this;
						tempCpInfo = xmlTemp4.responseXML;
						cpTag = tempCpInfo
								.getElementsByTagName("command-package")[0];
						var pathAttr = tempCpInfo.createAttribute('path');
						pathAttr.value = path;
						if (consoleFunctions["isCpInstalled"](cpTag
								.getAttribute("name"))) {

							logOnConsole("Cp already installed! To update use cp update!");
							abort = true;
						}
						if (abort) {
							return;
						}
						cpTag.setAttributeNode(pathAttr);
						console.log(pathAttr.value + " path to cp");
						var xhttpRequest = new XMLHttpRequest();
						xhttpRequest.onreadystatechange = function() {
							if (this.readyState == 4 && this.status == 200) {
								var tempXmlVar = this;
								var xmlCpList = tempXmlVar.responseXML;
								xmlCpList
										.getElementsByTagName("command-packages")[0]
										.appendChild(cpTag);
								console.log(cpTag);
								var ajx = new XMLHttpRequest();
								ajx.onreadystatechange = function() {
									if (ajx.readyState == 4
											&& ajx.status == 200) {
										console.log(ajx.responseText);
										console.log("calling TEMP LOAD")
										consoleFunctions["cpsTempLoad"]
												(
														cpTag
																.getAttribute("path"),
														cpTag
																.getAttribute("name"),
														cpTag
																.getAttribute("version"),
														isupd);
										if (cpTag.childNodes.length > 0) {
											consoleFunctions["depsTempLoad"](
													cpTag.getAttribute("path"),
													cpTag.childNodes);
										}
										if (!isupd) {
											logOnConsole(cpTag
													.getAttribute("name")
													+ " version "
													+ cpTag
															.getAttribute("version")
													+ " installed. Author: "
													+ cpTag
															.getAttribute("author"));
										}

									}

								};
								if (abort) {
									return;
								}
								ajx.open("POST", "./libs/cmd/savecplist.php",
										true);
								ajx
										.setRequestHeader("Content-type",
												"text/xml");
								ajx.send(new XMLSerializer()
										.serializeToString(xmlCpList));

							}
						};
						if (abort) {
							return;
						}
						xhttpRequest.open("GET", "./libs/cmd/loadcplist.php",
								true);
						xhttpRequest.send();
					}
				};
				if (abort) {
					return;
				}
				console.log(path);
				xhttpReq.open("GET", path + "/cpinfo.xml", true);
				xhttpReq.send();
			}
		} catch (err) {
			console.log(err.message);
		}
	};
	consoleFunctions["updateCp"] = function(cppath) {
		try {
			var cpXml;
			var httpRe = new XMLHttpRequest();
			httpRe.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var cpXmlTmp = this;
					cpXml = cpXmlTmp.responseXML;
					if (!consoleFunctions["isCpInstalled"](cpXml
							.getElementsByTagName("command-package")[0]
							.getAttribute("name"))) {
						logOnConsole("CP not installed");
						return;
					}
					if (consoleFunctions["isCpUpdate"](cpXml
							.getElementsByTagName("command-package")[0]
							.getAttribute("version"), (cpXml
							.getElementsByTagName("command-package")[0]
							.getAttribute("name")))) {
						consoleFunctions["uninstallCp"](cpXml
								.getElementsByTagName("command-package")[0]
								.getAttribute("name"), true, cppath);
						console.log("Old version uninstalled");
						logOnConsole((cpXml
								.getElementsByTagName("command-package")[0]
								.getAttribute("name")
								+ " updated to version " + cpXml
								.getElementsByTagName("command-package")[0]
								.getAttribute("version")));
					} else {
						logOnConsole("This cp is not and update!");
					}
				}
			};
			httpRe.open("GET", cppath + "/cpinfo.xml", true);
			httpRe.send();
		} catch (err) {
			console.log(err.message);
		}
	};

	consoleFunctions["uninstallCp"] = function(cpname, isupdt, updpath) {
		try {
			var tmpRemove;

			if (!consoleFunctions["isCpInstalled"](cpname)) {
				logOnConsole("Cp not found!");
				return;
			}
			if (ready) {

				var ajxTmp = new XMLHttpRequest();
				ajxTmp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
						var xmlTmp = this;
						cpListXml = xmlTmp.responseXML;
						console.log(cpListXml);
						for (var j = 0; j < cpListXml
								.getElementsByTagName("command-package").length; j++) {
							if (cpListXml
									.getElementsByTagName("command-package")[j]
									.getAttribute("name") == cpname) {
								console.log(cpname + " found on list");
								tmpRemove = cpListXml
										.getElementsByTagName("command-package")[j]
										.getAttribute("path")
										+ "/cpcmds.xml";
								var xhttpRemove = new XMLHttpRequest();
								xhttpRemove.onreadystatechange = function() {
									if (this.readyState == 4
											&& this.status == 200) {
										var xmlRemv = this;
										var xmlRemove = xmlRemv.responseXML;
										for (var k = 0; k < xmlRemove
												.getElementsByTagName("command").length; k++) {
											console
													.log(xmlRemove
															.getElementsByTagName("command")[k]
															.getAttribute("function")
															+ " cleared");
											consoleFunctions[xmlRemove
													.getElementsByTagName("command")[k]
													.getAttribute("function")] = undefined;
										}
										for (var o = 0; o >= 0; o++) {

											if (cpNames[o] == cpname) {
												console.log("removing "
														+ cpname + " data");
												cpCmds[cpNames[o]] = undefined;
												cpVers[cpNames[o]] = undefined;
												cpNames[o] = undefined;

												cpsLoaded -= 1;
												if (!isupdt) {
													logOnConsole(cpname
															+ " uninstalled");

												} else {
													consoleFunctions["installCp"]
															(updpath, true);
													console
															.log("New version installed!");
												}
												break;
											}
										}
									}
								};
								xhttpRemove.open("GET", tmpRemove, true);
								xhttpRemove.send();
							}
							cpListXml.getElementsByTagName("command-package")[j].parentNode
									.removeChild(cpListXml
											.getElementsByTagName("command-package")[j]);
							console
									.log(cpListXml
											.getElementsByTagName("command-packages")[0]);
							console.log(cpListXml);
							var ajxSave = new XMLHttpRequest();
							ajxSave.onreadystatechange = function() {
								if (ajxSave.readyState == 4
										&& ajxSave.status == 200) {
									console.log("New xml doc saved!");
									console.log(cpListXml);
								}
							};

							ajxSave.open("POST", "./libs/cmd/savecplist.php",
									true);
							ajxSave
									.setRequestHeader("Content-type",
											"text/xml");
							ajxSave.send(new XMLSerializer()
									.serializeToString(cpListXml));
						}

					}
				};
				ajxTmp.open("GET", "./libs/cmd/loadcplist.php", true);
				ajxTmp.send();
			}
		} catch (err) {
			console.log(err.message);
		}
	};
	consoleFunctions["iscp"] = function(args) {
		var operType = "none";
		var modNoReturn = false;
		var tempShowRetState;
		var target = "";
		var modsConfirmed = 0;
		if (args[0] == "install") {
			target = args[1];
			operType = "inst";
			console.log("CP operation type: " + operType)
		}
		if (args[0] == "uninstall") {
			target = args[1];
			operType = "uninst";
			console.log("CP operation type: " + operType)
		}
		if (args[0] == "update") {
			target = args[1];
			operType = "update";
			console.log("CP operation type: " + operType)
		}
		if (args[0] == "noargsused" || args[0] == "help") {
			var textArray = [
					"cp command use:         ",
					"cp install {cpPathFolder} installs the cp in ",
					"the indicated path---",
					"cp uninstall {cpName} uninstalls the indicated cp by its name",
					"cp update {newVerPath} updates the cp version to the indicated in the path",
					"--- " + "cp list get the list of all loaded cps" ];
			var textInfo = textArray.join("");
			logOnConsole(textInfo);
			return;
		}
		if (args.length > 3) {
			for (var modIter = 2; modIter < args.length; modIter++) {
				if (args[modIter] == "--nr") {
					modNoReturn = true;
					modsConfirmed++;
				}
			}
		}
		if (operType == "inst") {
			if (modsConfirmed > 0) {
				tempShowRetState = showReturn;
				showReturn = false;
				consoleFunctions["installCp"](target, false);
				showReturn = tempShowRetState;
				return;
			} else {
				consoleFunctions["installCp"](target, false);
				return;
			}
		}
		if (operType == "update") {
			if (modsConfirmed > 0) {
				tempShowRetState = showReturn;
				showReturn = false;
				consoleFunctions["updateCp"](target);
				showReturn = tempShowRetState;
				return;
			} else {
				console.log(target);
				consoleFunctions["updateCp"](target);
				return;
			}
		}
		if (operType == "uninst") {
			if (modsConfirmed > 0) {
				tempShowRetState = showReturn;
				showReturn = false;
				consoleFunctions["uninstallCp"](target, false, "");
				showReturn = tempShowRetState;
				return;
			} else {
				consoleFunctions["uninstallCp"](target, false, "");
				return;
			}
		}
		logOnConsole("Invalid cp command!");

	};

}(window, document, this));
