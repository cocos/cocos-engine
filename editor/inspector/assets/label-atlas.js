exports.template = `
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

const Elements = {
    spriteFrame: {
        ready() {
            this.$.spriteFrame.addEventListener('confirm', this.dataChange.bind(this, 'spriteFrameUuid'));
        },
        update() {
            this.$.spriteFrame.value = this.meta.userData.spriteFrameUuid;
            this.updateInvalid(this.$.spriteFrame, 'spriteFrameUuid');
            this.updateReadonly(this.$.spriteFrame);
        },
    },
    itemWidth: {
        ready() {
            this.$.itemWidth.addEventListener('change', this.dataChange.bind(this, 'itemWidth'));
        },
        update() {
            this.$.itemWidth.value = this.meta.userData.itemWidth;
            this.updateInvalid(this.$.itemWidth, 'itemWidth');
            this.updateReadonly(this.$.itemWidth);
        },
    },
    itemHeight: {
        ready() {
            this.$.itemHeight.addEventListener('change', this.dataChange.bind(this, 'itemHeight'));
        },
        update() {
            this.$.itemHeight.value = this.meta.userData.itemHeight;
            this.updateInvalid(this.$.itemHeight, 'itemHeight');
            this.updateReadonly(this.$.itemHeight);
        },
    },
    startChar: {
        ready() {
            this.$.startChar.addEventListener('change', this.dataChange.bind(this, 'startChar'));
        },
        update() {
            this.$.startChar.value = this.meta.userData.startChar;
            this.updateInvalid(this.$.startChar, 'startChar');
            this.updateReadonly(this.$.startChar);
        },
    },
    fontSize: {
        update() {
            this.$.fontSize.value = this.meta.userData.fontSize;
            this.updateInvalid(this.$.fontSize, 'fontSize');
        },
    },
};

exports.$ = {
    spriteFrame: '#spriteFrame',
    itemWidth: '#itemWidth',
    itemHeight: '#itemHeight',
    startChar: '#startChar',
    fontSize: '#fontSize',
};

exports.methods = {
    updateInvalid(element, prop) {
        const invalid = this.metaList.some((meta) => {
            return meta.userData[prop] !== this.meta.userData[prop];
        });
        element.invalid = invalid;
    },
    updateReadonly(element) {
        if (this.asset.readonly) {
            element.setAttribute('disabled', true);
        } else {
            element.removeAttribute('disabled');
        }
    },
    dataChange(key, event) {
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
