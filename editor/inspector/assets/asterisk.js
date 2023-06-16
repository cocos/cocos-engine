// Some files are text-like and can be tried to display
// such as .atlas

const textLike = ['.atlas'];
const { extname } = require('path');
const { TextLikeRead } = require('../utils/text-like-read.js');

exports.template = /* html */`
<section class="asset-asterisk">
</section>`;

exports.$ = {
    container: '.asset-asterisk',
};

exports.style = /* css */`
.asset-asterisk {
    flex: 1;
    display: flex;
    flex-direction: column;
    /* it is necessary */
    height: 0px;
}
.asset-asterisk > ui-code {
    flex: 1;
}
`;

exports.methods = {
    renderText() {
        this.textLikeRead.read(this.asset.file).then(text => {
            const code = document.createElement('ui-code');
            code.setAttribute('language', 'xml');
            code.textContent = text;
            this.$.container.innerHTML = '';
            this.$.container.appendChild(code);
        });
    },
};

exports.ready = function() {
    this.textLikeRead = new TextLikeRead();
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

    const isTextLike = textLike.includes(extname(this.asset.name));
    if (isTextLike) {
        this.renderText();
    }
};

