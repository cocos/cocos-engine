// Some files are text-like and can be tried to display
// such as .atlas

const textLike = ['.atlas'];
const { createReadStream } = require('fs');
const ReadLine = require('readline');
const { extname } = require('path');

const MAX_LINES = 400;
const MAX_LENGTH = 20000;

exports.template = /* html */`
<section class="asset-unknown">
    <ui-code language="xml"></ui-code>
</section>`;

exports.$ = {
    container: '.asset-unknown',
    code: 'ui-code',
};

exports.style = /* css */`
.asset-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    /* it is necessary */
    height: 0px;
}
.asset-text > ui-code {
    flex: 1;
}
`;

exports.methods = {
    renderContent(content, type) {
        const isTextLike = textLike.includes(type);

        if (isTextLike) {
            this.$.code.textContent = content;
            this.$.code.style.display = 'block';
        } else {
            this.$.code.textContent = '';
            this.$.code.style.display = 'none';
        }
    },
};

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
            throw err;
        }

        this.renderContent(text, extname(this.asset.name));
    });
};

