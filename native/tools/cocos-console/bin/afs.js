"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util_1 = require("util");
exports.afs = {
    readFile: util_1.promisify(fs.readFile),
    readdir: util_1.promisify(fs.readdir),
    stat: util_1.promisify(fs.stat),
    exists: util_1.promisify(fs.exists),
    copyFile: util_1.promisify(fs.copyFile),
    writeFile: util_1.promisify(fs.writeFile),
    mkdir: util_1.promisify(fs.mkdir),
    mkdtemp: util_1.promisify(fs.mkdtemp),
    unlink: util_1.promisify(fs.unlink),
    rmdir: util_1.promisify(fs.rmdir)
};
//# sourceMappingURL=afs.js.map