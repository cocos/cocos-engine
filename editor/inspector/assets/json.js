const { createReadStream } = require('fs');
const ReadLine = require('readline');

const MAX_LINES = 400;
const MAX_LENGTH = 20000;

exports.template = `
<section class="asset-json">
    <ui-code language="json"></ui-code>
</section>
`;

exports.style = `
.asset-json {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 0px; // it is necessary
}
.asset-json > ui-code {
    flex: 1;
}
`;

exports.$ = {
    container: '.asset-json',
    code: 'ui-code',
};

exports.ready = function() {
    this.code = this.$.code;
};

exports.update = function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.meta = metaList[0];
    this.asset = assetList[0];

    let display = 'none';
    if (assetList.length === 1 && this.asset.file.endsWith('.json')) {
        display = 'flex';
    }
    this.$.container.style.display = display;

    if (display === 'none') {
        return;
    }

    // Displays 400 lines or 20,000 characters
    const readStream = createReadStream(this.asset.file, {
        encoding: 'utf-8',
    });

    let remainLines = MAX_LINES;
    let remainLength = MAX_LENGTH;
    let text = '';

    const readLineStream = ReadLine.createInterface({
        input: readStream,
        setEncoding: 'utf-8',
    });

    readLineStream.on('line', (line) => {
        const lineLength = line.length;
        if (lineLength > remainLength) {
            line = line.substr(0, remainLength);
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
            throw err;
        }

        if (this.code) {
            this.code.textContent = text;
        }
    });
};
