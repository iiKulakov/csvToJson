const fileUtils = require('./util/fileUtils');
const stringUtils = require('./util/stringUtils');
const jsonUtils = require('./util/jsonUtils');
const mailUtils = require('./util/mailUtil');

const newLine = /\r?\n/;
const defaultFieldDelimiter = ';';

class CsvToJson {
  formatValueByType() {
    this.printValueFormatByType = true;
    return this;
  }

  fieldDelimiter(delimieter) {
    this.delimiter = delimieter;
    return this;
  }

  generateJsonFileFromCsv(fileInputName, fileOutputName) {
    const jsonStringified = this.getJsonFromCsvStringified(fileInputName);
    fileUtils.writeFile(jsonStringified, fileOutputName);
  }

  getJsonFromCsvStringified(fileInputName) {
    const json = this.getJsonFromCsv(fileInputName);
    const jsonStringified = JSON.stringify(json, undefined, 1);
    jsonUtils.validateJson(jsonStringified);
    return jsonStringified;
  }

  getJsonFromCsv(fileInputName) {
    const parsedCsv = fileUtils.readFile(fileInputName);
    return this.csvToJson(parsedCsv);
  }

  csvStringToJson(csvString) {
    return this.csvToJson(csvString);
  }

  csvToJson(parsedCsv) {
    const lines = parsedCsv.split(newLine);
    const fieldDelimiter = this.getFieldDelimiter();
    const headers = lines[0].split(fieldDelimiter);

    const jsonResult = [];
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(fieldDelimiter);
      if (stringUtils.hasContent(currentLine)) {
        jsonResult.push(this.buildJsonResult(headers, currentLine));
      }
    }
    //     for firebase
    const modified = { users: jsonResult };

    return modified;
  }

  getFieldDelimiter() {
    if (this.delimiter) {
      return this.delimiter;
    }
    return defaultFieldDelimiter;
  }

  buildJsonResult(headers, currentLine) {
    const jsonObject = {};
    const { checkEmail } = mailUtils;

    for (let j = 0; j < headers.length; j++) {
      const propertyName = stringUtils.trimPropertyName(headers[j]);

      let value = currentLine[j];
      const modifiedValue = value.trim().toLowerCase();

      // if (this.printValueFormatByType) {
      value = stringUtils.getValueFormatByType(currentLine[j]);
      // }
      if (checkEmail(modifiedValue)) {
        value = modifiedValue;
      }
      jsonObject[propertyName] = value;
    }
    return jsonObject;
  }
}

module.exports = new CsvToJson();
