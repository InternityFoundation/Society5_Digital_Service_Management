var json2xls = require('json2xls');
var fs = require('fs')

/**
 * 
 * @param {Object} data 
 */
const convertJsonToXlsx = (data, fileName) => {
    var xls = json2xls(data);
    fs.writeFileSync(`public/rtiClaims/${fileName}.xlsx`, xls, 'binary');
}

module.exports = {
    convertJsonToXlsx
}

