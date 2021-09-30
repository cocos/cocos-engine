'use strict';

exports.template = `
<div class="image-preview">
    <ui-image class="image" show-alpha></ui-image>
    <div class="label">
        <span class="size"></span>
    </div>
</div>
`;

exports.style = `
    .image-preview {
        height: 200px;
        background: var(--color-normal-fill-emphasis);
        border: 1px solid var(--color-normal-border-emphasis);
        display: flex;
        padding: 10px;
        position: relative;
    }
    .image-preview > .image {
        width: 100%;
        height: 100%;
    }
    .image-preview > .label {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 4px;
        text-align: center;
    }
    .image-preview > .label > .size {
        font-size: 10px;
        padding: 2px 8px;
        background-color: var(--color-primary-fill);
        color: var(--color-primary-contrast-weakest);
        border-radius: calc(var(--size-normal-radius) * 1px);
    }
    .image-preview > .label > .size:empty {
        display: none;
    }
`;

exports.$ = {
    container: '.image-preview',
    image: '.image',
    size: '.size',
};

/**
 * attribute corresponds to the edit element
 */
const Elements = {
    imagePreview: {
        ready() {

            this.$.image.$img.addEventListener('load', () => {
                this.$.size.innerHTML = `${this.$.image.$img.naturalWidth} x ${this.$.image.$img.naturalHeight}`;
            });
        },
        update() {
            const panel = this;
            panel.$.image.value = panel.asset.uuid;

            if (panel.assetList.length > 1) {
                panel.$.container.style.display = 'none';
            } else {
                this.$.size.innerHTML = '';
                panel.$.container.style.display = 'block';
            }
        },
    },
};

/**
 * Methods for automatic rendering of components
 * @param assetList
 * @param metaList
 */
exports.update = function(assetList, metaList) {
    this.assetList = assetList;
    this.metaList = metaList;
    this.asset = assetList[0];
    this.meta = metaList[0];

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            element.update.call(this);
        }
    }
};

/**
 * Method of initializing the panel
 */
exports.ready = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
};

exports.close = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.close) {
            element.close.call(this);
        }
    }
};

exports.methods = {

};
