const { existsSync, createReadStream } = require('fs');
const { createInterface } = require('readline');


class TextLikeRead {
    constructor(options = { maxLines: 400, maxLength: 20 * 1000 }) {
        this.options = options;
    }
    read(file = '') {
        return new Promise((resolve, reject) => {
            if (typeof file !== 'string') {
                reject(new Error('File path must be a string'));
            }
            if (!existsSync(file)) {
                reject(new Error('The file does not exist'));
            }
            let remainLines = this.options.maxLines;
            let remainLength = this.options.maxLength;
            let text = '';

            const readStream = createReadStream(file, {
                encoding: 'utf-8',
            });

            const readLineStream = createInterface({
                input: readStream,
                setEncoding: 'utf-8',
            });

            readLineStream.on('line', (line) => {
                const lineLength = line.length;
                if (lineLength > remainLength) {
                    line = line.substring(0, remainLength);
                    remainLength = 0;
                } else {
                    remainLength -= lineLength;
                }

                remainLines--;
                text += `${line}\n`;

                if (remainLines <= 0 || remainLength <= 0) {
                    text += '...\n';
                    readLineStream.close();
                    readStream.close();
                }
            });

            readLineStream.on('close', (err) => {
                if (err) {
                    reject(err);
                }

                resolve(text);
            });
        });
    }
}

exports.TextLikeRead = TextLikeRead;
