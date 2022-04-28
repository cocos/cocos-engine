const path = require('path');
const fs = require('fs');

const configJsonPath = path.join(__dirname, '../../native/external-config.json');
const configData = fs.readFileSync(configJsonPath);
const config = JSON.parse(configData);
const externalVersion = config.from.checkout;
console.log(externalVersion);