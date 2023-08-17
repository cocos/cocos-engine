'use strict';

const { updateElementReadonly, updateElementInvalid } = require('../utils/assets');

exports.template = /* html */`
<section class="asset-label-atlas">
    <div class="content">
        <ui-prop ui="asset">
            <ui-label slot="label"
                tooltip="i18n:ENGINE.assets.label-atlas.SpriteFrameTip"
                value="i18n:ENGINE.assets.label-atlas.SpriteFrame"
            ></ui-label>
            <ui-asset slot="content" id="spriteFrame" droppable="cc.SpriteFrame"></ui-asset> 
        </ui-prop>
        <ui-prop>
            <ui-label slot="label"
                tooltip="i18n:ENGINE.assets.label-atlas.ItemWidthTip"
                value="i18n:ENGINE.assets.label-atlas.ItemWidth"
            ></ui-label>
            <ui-num-input slot="content" id="itemWidth"
                preci="0"
                step="1"
                min="0"
            ></ui-num-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label"
                tooltip="i18n:ENGINE.assets.label-atlas.ItemHeightTip"
                value="i18n:ENGINE.assets.label-atlas.ItemHeight"
            ></ui-label>
            <ui-num-input slot="content" id="itemHeight"
                preci="0"
                step="1"
                min="0"
            ></ui-num-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label"
                tooltip="i18n:ENGINE.assets.label-atlas.StartCharTip"
                value="i18n:ENGINE.assets.label-atlas.StartChar"
            ></ui-label>
            <ui-input slot="content" id="startChar"></ui-input>
        </ui-prop>
        <ui-prop>
            <ui-label slot="label"
                tooltip="i18n:ENGINE.assets.label-atlas.FontSizeTip"
                value="i18n:ENGINE.assets.label-atlas.FontSize"
            ></ui-label>
            <ui-input slot="content" id="fontSize" disabled></ui-input>
        </ui-prop>
    </div> 
</section>
`;


exports.style = /* css */`
.asset-label-atlas {
    padding-right: 4px;
}
`;

exports.$ = {
    spriteFrame: '#spriteFrame',
    itemWidth: '#itemWidth',
    itemHeight: '#itemHeight',
    startChar: '#startChar',
    fontSize: '#fontSize',
};

const Elements = {
    spriteFrame: {
        ready() {
            this.$.spriteFrame.addEventListener('confirm', (event) => {
                this.change.call(this, 'spriteFrameUuid', event);
                this.dispatch('snapshot');
            });
        },
        update() {
            this.$.spriteFrame.value = this.meta.userData.spriteFrameUuid;
            updateElementInvalid.call(this, this.$.spriteFrame, 'spriteFrameUuid');
            updateElementReadonly.call(this, this.$.spriteFrame);
        },
    },
    itemWidth: {
        ready() {
            this.$.itemWidth.addEventListener('change', this.change.bind(this, 'itemWidth'));
            this.$.itemWidth.addEventListener('confirm', () => {
                this.dispatch('snapshot');
            });
        },
        update() {
            this.$.itemWidth.value = this.meta.userData.itemWidth;
            updateElementInvalid.call(this, this.$.itemWidth, 'itemWidth');
            updateElementReadonly.call(this, this.$.itemWidth);
        },
    },
    itemHeight: {
        ready() {
            this.$.itemHeight.addEventListener('change', this.change.bind(this, 'itemHeight'));
            this.$.itemHeight.addEventListener('confirm', () => {
                this.dispatch('snapshot');
            });
        },
        update() {
            this.$.itemHeight.value = this.meta.userData.itemHeight;
            updateElementInvalid.call(this, this.$.itemHeight, 'itemHeight');
            updateElementReadonly.call(this, this.$.itemHeight);
        },
    },
    startChar: {
        ready() {
            this.$.startChar.addEventListener('change', this.change.bind(this, 'startChar'));
            this.$.startChar.addEventListener('confirm', () => {
                this.dispatch('snapshot');
            });
        },
        update() {
            this.$.startChar.value = this.meta.userData.startChar;
            updateElementInvalid.call(this, this.$.startChar, 'startChar');
            updateElementReadonly.call(this, this.$.startChar);
        },
    },
    fontSize: {
        update() {
            this.$.fontSize.value = this.meta.userData.fontSize;
            updateElementReadonly.call(this, this.$.fontSize, 'fontSize');
        },
    },
};

exports.methods = {
    change(key, event) {
        this.metaList.forEach((meta) => {
            meta.userData[key] = event.target.value;
        });
        this.dispatch('change');
    },
};

exports.ready = function() {
    for (const key in Elements) {
        if (Elements[key].ready) {
            Elements[key].ready.call(this);
        }
    }
};

exports.update = function(assetList, metaList) {
    this.metaList = metaList;
    this.assetList = assetList;
    this.meta = metaList[0];
    this.asset = assetList[0];

    for (const key in Elements) {
        if (Elements[key].update) {
            Elements[key].update.call(this);
        }
    }
};
