'use strict';
/* globals Sheet */

var Table = class {
	constructor(sheetName, fieldNames, mutable, encoder, decoder) {
		this._mutable = mutable;
		this._fieldNames = fieldNames;
		this._sheet = Sheet.getSheetByName(sheetName);
		this._encoder = encoder ? encoder : (v => v);
		this._decoder = decoder ? decoder : (v => v);
		this.trim = function (newSize) {
			if (!this._mutable) {
				throw Error('Cannot trim immutable table!');
			}
			if (newSize === undefined) {
				newSize = this.getNumRows();
			}
			this._trim(newSize);
		};
		this._trim = function (newSize) {
			let rowPosition = 2 + newSize;
			let howMany = this._sheet.getMaxRows() - (1 + newSize);
			if (howMany > 0) {
				this._sheet.deleteRows(rowPosition, howMany);
			}
		};
		this.getNumRows = function () {
			let lastRow = this._sheet.getLastRow();
			return lastRow - 1;
		};
		this.getRow = function (rowIdx) {
			let range = this._getRange(rowIdx + 1);
			let obj = this._rowToObject(range.getValues()[0]);
			return obj;
		};
		this.getRows = function () {
			let firstRow = 1; // skip header
			let numRows = this.getNumRows();
			if (numRows == 0) {
				return [];
			}
			let range = this._getRange(firstRow, numRows);
			let objects = this._rowsToObjects(range.getValues());
			return objects;
		};
		this.setRows = function (values, optFirstRow) {
			let firstRow = (optFirstRow != null ? optFirstRow : 0) + 1; // skip header
			let numRows = values.length;
			let range = this._getRange(firstRow, numRows);
			let rows = this._objectsToRows(values);
			return range.setValues(rows);
		};
		this.setRow = function (rowIdx, value) {
			if (!this._mutable) {
				throw Error('Cannot setRow on immutable table!');
			}
			let range = this._getRange(rowIdx + 1);
			let row = this._objectToRow(value);
			return range.setValues([row]);
		};
		this._rowToObject = function (row) {
			let obj = {};
			for (let i = 0; i < this._fieldNames.length; i++) {
				let fieldName = this._fieldNames[i];
				obj[fieldName] = row[i];
			}
			return this._decoder(obj);
		};
		this._rowsToObjects = function (rows) {
			let objects = [];
			for (let i = 0; i < rows.length; i++) {
				objects.push(this._rowToObject(rows[i]));
			}
			return objects;
		};
		this._objectToRow = function (obj) {
			obj = this._encoder(obj);
			let row = [];
			for (let i = 0; i < this._fieldNames.length; i++) {
				let fieldName = this._fieldNames[i];
				let v = (fieldName in obj) ? obj[fieldName] : null;
				row.push(v);
			}
			return row;
		};
		this._objectsToRows = function (rowObjects) {
			let rows = [];
			for (let i = 0; i < rowObjects.length; i++) {
				rows.push(this._objectToRow(rowObjects[i]));
			}
			return rows;
		};
		this.appendRows = function (rowObjects) {
			if (!this._mutable) {
				throw Error('Cannot appendRows on immutable table!');
			}
			if (!rowObjects.length || rowObjects.length < 1) {
				return;
			}
			let firstRowIdx = this.getNumRows() + 1; // skip header row
			let range = this._getRange(firstRowIdx, rowObjects.length);
			let rows = this._objectsToRows(rowObjects);
			return range.setValues(rows);
		};
		this._getColumnIndex = function (fieldName) {
			for (let i = 0; i < this._fieldNames.length; i++) {
				if (fieldName == this._fieldNames[i]) {
					return i;
				}
			}
			return null;
		};
		this.clearColumn = function (fieldName) {
			let columnIdx = this._getColumnIndex(fieldName);
			let row = 2;
			let column = columnIdx + 1;
			let numRows = this.getNumRows();
			let numColumns = 1;
			let range = this._sheet.getRange(row, column, numRows, numColumns);
			range.clearContent();
		};
		this._getRange = function (rowIdx, optNumRows) {
			let numRows = optNumRows != undefined ? optNumRows : 1;
			let firstRow = rowIdx + 1; // 1 indexed
			let numColumns = this._fieldNames.length;
			let range = this._sheet.getRange(firstRow, /*column=*/ 1, numRows, numColumns);
			return range;
		};
		this.unshiftRow = function (row) {
			this._sheet.insertRowAfter(/*afterPosition=*/ 1);
			this.setRow(0, row);
		};
		this.unshiftRows = function (rows) {
			this._sheet.insertRowsAfter(/*afterPosition=*/ 1, /*howMany=*/ rows.length);
			this.setRows(rows);
		};
		this.shiftRows = function (howMany) {
			let rowPosition = 2;
			this._sheet.deleteRows(rowPosition, howMany);
		};
		this.protect = function () {
			this._sheet.protect()
				.setWarningOnly(true)
				.setDescription('Do not edit while script is running');
		};
		this.unprotect = function () {
			this._sheet.protect().remove();
		};
		if (!sheetName) {
			return; // inheritence
		}
		if (!this._sheet) {
			this._sheet = Sheet.insertSheet(sheetName);
			this._trim(0);
			this._sheet.deleteColumns(1 + fieldNames.length, this._sheet.getMaxColumns() - fieldNames.length);
			this._sheet.getRange(1, 1, 1, fieldNames.length).setValues([fieldNames]);
			SpreadsheetApp.flush();
		}
	}
};

function nameValueMapper_(nameValueMapIndex) {
	return function (row) {
		let mapper = nameValueMapIndex[row.name];
		if (mapper) {
			let newRow = Object.deepClone(row);
			newRow.value = mapper(row.value);
			return newRow;
		}
		return row;
	};
}

function rowFieldMapper_(fieldMapIndex) {
	return function (row) {
		let newRow = Object.deepClone(row);
		let fields = Object.keys(fieldMapIndex);
		for (let i = 0; i < fields; i++) {
			let fieldName = fields[i];
			newRow[fieldName] = fieldMapIndex[fieldName](row[fieldName]);
		}
		return newRow;
	};
}
