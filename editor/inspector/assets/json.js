const { createReadStream } = require('fs-extra');
const ReadLine = require('readline');

const MAX_LINES = 400;
const MAX_LENGTH = 20000;

exports.template = `
<section class="asset-javascript">
    <ui-code 
        language="json" 
        id="code"
    >
    </ui-code>
</section>`;

exports.$ = {
    code: '#code',
};

let panel;

exports.style = `
:host > .asset-javascript > ui-code[hidden] {
    display: none;
}
.asset-javascript {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
}
.asset-javascript .line {
    display: flex;
    margin-bottom: 6px;
}
.asset-javascript .line > ui-label {
    display: inline-block;
    width: 150px;
}
.asset-javascript .line > .content {
    flex: 1;
}
.asset-javascript .indent {
    padding-left: 20px;
}
.asset-javascript .indent > ui-label {
    width: 130px;
}
.asset-javascript .assets > ui-asset {
    margin-top: 8px;
}
.asset-javascript ui-code {
    flex: 1;
    position: relative;
    overflow: auto;
    margin: 0;
    padding: 10px;
    font-size: 12px;
    border: 1px solid var(--color-normal-border);
    background: var(--color-normal-fill-emphasis);
    -webkit-user-select: text;
    cursor: auto;
}
`;
/**
 * Methods to automatically render components
 */
exports.update = function (assetList, metaList) {
    if (assetList.length === 1) {
        const info = assetList[0];
        panel.$.code.hidden = false;
        if (info.importer !== 'json') {
            return;
        }
        const readStream = createReadStream(info.file, { encoding: 'utf-8' });
        // Displays 400 lines or 20,000 characters
        let remainLines = MAX_LINES;
        let remainLength = MAX_LENGTH;
        let text = '';
        const readLineStream = ReadLine.createInterface({ input: readStream, setEncoding: 'utf-8' });
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
            }
        });
        readLineStream.on('close', (err) => {
            if (err) {
                throw err;
            }
            panel.$.code.innerHTML = text;
        });
    } else {
        panel.$.code.innerText = '';
        panel.$.code.hidden = true;
    }
};

/**
 * A method to initialize the panel
 */
exports.ready = function () {
    panel = this;
};
