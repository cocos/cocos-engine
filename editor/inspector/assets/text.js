const { createReadStream } = require('fs');
const ReadLine = require('readline');

const MAX_LINES = 400;
const MAX_LENGTH = 20000;

exports.template = `
<section class="asset-text">
    <ui-code language="xml"></ui-code>
</section>`;

exports.$ = {
    container: '.asset-text',
    code: 'ui-code',
};

exports.style = `
.asset-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 0px; // it is necessary
}
.asset-text > ui-code {
    flex: 1;
}
`;

exports.update = function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.meta = metaList[0];
    this.asset = assetList[0];

    let display = 'none';
    if (assetList.length === 1) {
        display = 'flex';
    }
    this.$.container.style.display = display;

    if (display === 'none') {
        return;
    }

    // Displays 400 lines or 20,000 characters
    let remainLines = MAX_LINES;
    let remainLength = MAX_LENGTH;
    let text = '';

    const readStream = createReadStream(this.asset.file, {
        encoding: 'utf-8',
    });

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

        if (this.$.code) {
            this.$.code.textContent = text;
        }
    });
};
