'use strict';

var Trigger = class {
	static clearTriggers() {
		let currentTriggers = ScriptApp.getScriptTriggers();
		for (let i in currentTriggers) {
			ScriptApp.deleteTrigger(currentTriggers[i]);
		}
	}

	static deleteTriggerByName(name) {
		console.log('Removing trigger: [%s].', name);
		let triggers =
			ScriptApp.getUserTriggers(SpreadsheetApp.getActiveSpreadsheet());
		for (let i = 0; i < triggers.length; i++) {
			if (triggers[i].getHandlerFunction() == name) {
				ScriptApp.deleteTrigger(triggers[i]);
			}
		}
	}
};
