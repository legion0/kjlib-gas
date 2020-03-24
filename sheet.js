'use strict';

var Sheet = class {
	static insertSheet(sheetName) {
		var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
		var sheetIndex = activeSpreadsheet.getSheets().length;
		return activeSpreadsheet.insertSheet(sheetName, sheetIndex);
	}

	static getSheetByName(sheetName) {
		return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
	}

	static deleteSheetByName(sheetName) {
		var sheet = Sheet.getSheetByName(sheetName);
		if (sheet != null) {
			SpreadsheetApp.getActiveSpreadsheet().deleteSheet(sheet);
		}
	}
};
