import * as fs from "fs";
import {promisify} from "util";

export const afs = {
    readFile: promisify(fs.readFile),
    readdir: promisify(fs.readdir),
    stat: promisify(fs.stat),
    exists: promisify(fs.exists),
    copyFile: promisify(fs.copyFile),
    writeFile: promisify(fs.writeFile),
    mkdir: promisify(fs.mkdir),
    mkdtemp: promisify(fs.mkdtemp),
    unlink: promisify(fs.unlink),
    rmdir: promisify(fs.rmdir)
};
