var path = require('path');
var fs = require('fs');

var EXTENSION = '.json';

var files = fs.readdirSync(__dirname);

var targetFiles = files.filter(function(file) {
    return path.extname(file).toLowerCase() === EXTENSION;
});

// console.log(targetFiles)

var allData = [];

targetFiles.forEach(function (file, index) {
  	let rawdata = fs.readFileSync(file);
	let data = JSON.parse(rawdata);
	allData = allData.concat(data)
});

var allData = allData.filter(element => {
  return element !== null;
});

fs.writeFile('full_results.json', JSON.stringify(allData), function (err) {
  if (err) return console.log(err);
  console.log('wrote results to full_results.json');
});

// console.log(allData);