'use strict';

const path = require('path');

const Direction = {
    left: 'left ( -X )',
    right: 'right ( +X )',
    top: 'top ( +Y )',
    bottom: 'bottom ( -Y )',
    front: 'front ( +Z )',
    back: 'back ( -Z )',
};

exports.template = `
<section class="asset-texture-cube">
    <div class="assets"></div>
    <div class="preview">
        <div class="images"></div>
    </div>
    <ui-panel class="panel"></ui-panel>
</section>
`;

exports.$ = {
    container: '.asset-texture-cube',
    assets: '.assets',
    images: '.images',
    panel: '.panel',
};

exports.style = `
  .asset-texture-cube > .preview {
    background: var(--color-normal-fill-emphasis);
    padding: 20px;
    margin-top: 10px;
  }
  .asset-texture-cube > .preview > .images {
    position: relative;
    width: calc(var(--size) * 4);
    height: calc(var(--size) * 3);
  }
  .asset-texture-cube > .preview > .images > ui-image {
    position: absolute;
    line-height: var(--size);
    width: var(--size);
    height: var(--size);
    background: var(--color-normal-fill);
    text-align: center;
  }
  .asset-texture-cube > .preview > .images > .top {
    top: 0;
    left: calc(var(--size) * 2);
  }
  .asset-texture-cube > .preview > .images > .bottom {
    top: calc(var(--size) * 2);
    left: calc(var(--size) * 2);
  }
  .asset-texture-cube > .preview > .images > .front {
    top: var(--size);
    left: calc(var(--size) * 2);
  }
  .asset-texture-cube > .preview > .images > .back {
    top: var(--size);
    left: 0;
  }
  .asset-texture-cube > .preview > .images > .left {
    top: var(--size);
    left: var(--size);
  }
  .asset-texture-cube > .preview > .images > .right {
    top: var(--size);
    left: calc(var(--size) * 3);
  }
  .asset-texture-cube > .panel {
    display: block;
    margin-top: 10px;
  }
`;

const Elements = {
    assets: {
        ready() {
            const panel = this;

            for (const key in Direction) {
                const prop = document.createElement('ui-prop');
                panel.$.assets.appendChild(prop);
                prop.setAttribute('is', 'asset');

                const label = document.createElement('ui-label');
                prop.appendChild(label);
                label.setAttribute('slot', 'label');
                label.setAttribute('value', Direction[key]);

                const asset = document.createElement('ui-asset');
                prop.appendChild(asset);
                asset.setAttribute('slot', 'content');
                asset.setAttribute('droppable', 'cc.ImageAsset');
                asset.addEventListener('confirm', panel.dataChange.bind(panel, key));

                panel.$[`${key}-asset`] = asset;
            }
        },
        update() {
            const panel = this;

            for (const key in Direction) {
                panel.$[`${key}-asset`].value = panel.meta.userData[key] || '';
                panel.updateInvalid(panel.$[`${key}-asset`], key);
                panel.updateReadonly(panel.$[`${key}-asset`]);
            }
        },
    },
    images: {
        ready() {
            const panel = this;

            for (const key in Direction) {
                const image = document.createElement('ui-image');
                panel.$.images.appendChild(image);

                image.setAttribute('class', key);
                image.setAttribute('droppable', 'cc.ImageAsset');
                image.setAttribute('class', key);
                image.setAttribute('placeholder', key);
                image.addEventListener('confirm', panel.dataChange.bind(panel, key));

                panel.$[`${key}-image`] = image;
            }

            function observer() {
                cancelAnimationFrame(panel.animationFrameId);
                panel.animationFrameId = window.requestAnimationFrame(() => {
                    const { clientWidth, clientHeight } = panel.$.container;
                    const size = Math.round(Math.min((clientWidth - 40) / 4, (clientHeight - 40) / 3));
                    panel.$.container.style.setProperty('--size', `${size}px`);
                });
            }

            panel.resizeObserver = new window.ResizeObserver(observer);
            panel.resizeObserver.observe(panel.$.container);
            observer();
        },
        update() {
            const panel = this;

            for (const key in Direction) {
                panel.$[`${key}-image`].value = panel.meta.userData[key] || '';
                panel.updateInvalid(panel.$[`${key}-image`], key);
                panel.updateReadonly(panel.$[`${key}-image`]);
            }
        },
        close() {
            const panel = this;
            panel.resizeObserver.unobserve(panel.$.container);
        },
    },
    panel: {
        ready() {
            this.$.panel.setAttribute('src', path.join(__dirname, './erp-texture-cube.js'));
            this.$.panel.addEventListener('change', () => {
                this.dispatch('change');
            });
        },
        update() {
            this.$.panel.update(this.assetList, this.metaList);
        },
    },
};

exports.ready = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(this);
        }
    }
};

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

exports.close = function() {
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.close) {
            element.close.call(this);
        }
    }
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
            meta.userData[key] = event.target.value || undefined;
        });

        this.dispatch('change');

        Elements.assets.update.call(this);
        Elements.images.update.call(this);
    },
};
