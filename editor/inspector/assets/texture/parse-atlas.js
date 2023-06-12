// reference:
// http://zh.esotericsoftware.com/spine-atlas-format

const { extname } = require('path');
const { existsSync, createReadStream } = require('fs');
const { createInterface } = require('readline');


function isNumber(value) {
    return !isNaN(Number(value));
}

function isBoolean(value) {
    return /^(true)|(false)$/.test(value);
}

function formatValue(value) {
    const _value = String(value).trim();
    if (/^(undefined)|(null)|(NaN)$/.test(_value)) {
        return _value;
    }
    if (_value === '') {
        return null;
    }
    const list = _value.split(',').map(v => {
        v = v.trim();
        if (v === '') {
            return null;
        }
        if (isNumber(v)) {
            return Number(v);
        }
        if (isBoolean(v)) {
            return Boolean(v);
        }
        return v;
    });
    if (list.length === 1) {
        return list[0];
    }
    return list;
}

const imageExt = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
const pageAttr = ['name', 'size', 'format', 'filter', 'repeat', 'pma'];

class ParseAtlasFile {
    constructor() { }

    #json = {};
    #lockPage = false;
    #currentPage = '';
    #currentRegin = '';

    reset() {
        this.#json = {};
        this.#lockPage = false;
        this.#currentPage = '';
        this.#currentRegin = '';
    }

    #push(line) {
        const string = line.trim();
        const isEmptyLine = string.length === 0;
        const isPage = imageExt.includes(extname(line)); // the begin of page

        if (isEmptyLine) {
            // if is a empty line,we need create a new page.
            this.#lockPage = false;
            return;
        }

        if (isPage && !this.#lockPage) {
            this.#json[line] = {};
            this.#lockPage = true;
            this.#currentPage = line;
            this.#currentRegin = '';
        } else {
            const keyValue = line.split(':');
            const key = keyValue[0].trim();
            const value = formatValue(keyValue[1]);

            // Check if it's region
            const isRegion = keyValue.length === 1;

            if (isRegion) {
                this.#currentRegin = key;
                this.#json[this.#currentPage][this.#currentRegin] = {};
            } else {
                if (this.#currentRegin) {
                    this.#json[this.#currentPage][this.#currentRegin][key] = value;
                } else {
                    if (!pageAttr.includes(key)) {
                        console.error(`${key} is not a valid attribute, Please check!`);
                    }
                    this.#json[this.#currentPage][key] = value;
                }
            }
        }
    }

    parse(atlasFile) {
        this.reset();

        return new Promise((resolve, reject) => {
            if (typeof atlasFile !== 'string') {
                reject(new Error('File path must be a string'));
            }
            if (extname(atlasFile) !== '.atlas') {
                reject(new Error('The file does not a .atlas'));
            }
            if (!existsSync(atlasFile)) {
                reject(new Error('The file does not exist'));
            }

            const readStream = createReadStream(atlasFile, {
                encoding: 'utf-8',
            });

            const readLineStream = createInterface({
                input: readStream,
                setEncoding: 'utf-8',
            });

            readLineStream.on('line', (line) => {
                this.#push(line);
            });

            readLineStream.on('close', (err) => {
                if (err) {
                    reject(err);
                }
                resolve(this.#json);
            });
        });
    }
}

exports.ParseAtlasFile = ParseAtlasFile;
