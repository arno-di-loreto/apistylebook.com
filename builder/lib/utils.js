'use strict';

const fs = require('fs');
const yaml = require('js-yaml');

/**
 * @description Saves data as a json file
 * @param {String} filename JSON filename
 * @param {Object} data Data to save
 */
function saveJsonFile(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

/**
 * @description Saves data as a yaml file
 * @param {String} filename YAML filename
 * @param {Object} data Data to save
 */
function saveYamlFile(filename, data) {
  fs.writeFileSync(filename, yaml.dump(data, {noRefs: true, lineWidth: -1}));
}

/**
 * @description Saves string data as a file
 * @param {String} filename Filename
 * @param {String} data Data to save
 */
function saveStringFile(filename, data) {
  fs.writeFileSync(filename, data);
}

/**
 * @description Saves data as a yaml or json file
 * @param {String} filename YAML filename
 * @param {String} format Format (.json or .yaml)
 * @param {Object} data Data to save
 */
function saveFile(filename, format, data) {
  if (format.localeCompare('.yaml') === 0) {
    saveYamlFile(filename + format, data);
  }
  else if (format.localeCompare('.json') === 0) {
    saveJsonFile(filename + format, data);
  }
  else if (format.localeCompare('.md') === 0) {
    saveStringFile(filename + format, data);
  }
  else {
    throw new Error('unexpected format ' + format);
  }
}

exports._saveJsonFile = saveJsonFile;
exports._saveYamlFile = saveYamlFile;
exports._saveStringFile = saveStringFile;
exports.saveFile = saveFile;
