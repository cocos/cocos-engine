'use strict';

const { updateElementReadonly, updateElementInvalid } = require('../utils/assets');
const { injectionStyle } = require('../utils/prop');

const path = require('path');

const Direction = {
    left: 'left ( -X )',
    right: 'right ( +X )',
    top: 'top ( +Y )',
    bottom: 'bottom ( -Y )',
    front: 'front ( +Z )',
    back: 'back ( -Z )',
};

exports.template = /* html */`
<section class="asset-texture-cube">
    <div class="assets"></div>
    <div class="preview">
        <div class="images"></div>
    </div>
    <ui-panel class="panel"></ui-panel>
</section>
`;

exports.style = /* css */`
  .asset-texture-cube > .assets {
    padding-right: 4px;
  }
  .asset-texture-cube > .preview {
    padding: 20px;
  }
  .asset-texture-cube > .preview > .images {
    position: relative;
    width: calc(var(--size) * 4);
    height: calc(var(--size) * 3);
  }
  .asset-texture-cube > .preview > .images > ui-drag-item > ui-image {
    position: absolute;
    line-height: var(--size);
    width: var(--size);
    height: var(--size);
    background-color: var(--color-normal-fill-emphasis);
    text-align: center;
  }
  .asset-texture-cube > .preview > .images > ui-drag-item > .top {
    top: 0;
    left: calc(var(--size) * 2);
  }
  .asset-texture-cube > .preview > .images > ui-drag-item > .bottom {
    top: calc(var(--size) * 2);
    left: calc(var(--size) * 2);
  }
  .asset-texture-cube > .preview > .images > ui-drag-item > .front {
    top: var(--size);
    left: calc(var(--size) * 2);
  }
  .asset-texture-cube > .preview > .images > ui-drag-item > .back {
    top: var(--size);
    left: 0;
  }
  .asset-texture-cube > .preview > .images > ui-drag-item > .left {
    top: var(--size);
    left: var(--size);
  }
  .asset-texture-cube > .preview > .images > ui-drag-item > .right {
    top: var(--size);
    left: calc(var(--size) * 3);
  }
  .asset-texture-cube > .panel {
    display: block;
    margin-top: 10px;
  }
`;

exports.$ = {
    container: '.asset-texture-cube',
    assets: '.assets',
    images: '.images',
    panel: '.panel',
};

const Elements = {
    assets: {
        ready() {
            const panel = this;

            for (const key in Direction) {
                const prop = document.createElement('ui-prop');
                panel.$.assets.appendChild(prop);
                prop.setAttribute('ui', 'asset');

                const label = document.createElement('ui-label');
                prop.appendChild(label);
                label.setAttribute('slot', 'label');
                label.setAttribute('value', Direction[key]);

                const asset = document.createElement('ui-asset');
                prop.appendChild(asset);
                asset.setAttribute('slot', 'content');
                asset.setAttribute('droppable', 'cc.ImageAsset');
                asset.addEventListener('confirm', panel.change.bind(panel, key));

                panel.$[`${key}-asset`] = asset;
            }
        },
        update() {
            const panel = this;

            for (const key in Direction) {
                panel.$[`${key}-asset`].value = panel.meta.userData[key] || '';
                updateElementInvalid.call(panel, panel.$[`${key}-asset`], key);
                updateElementReadonly.call(panel, panel.$[`${key}-asset`]);
            }
        },
    },
    images: {
        ready() {
            const panel = this;

            for (const key in Direction) {
                const dragItem = document.createElement('ui-drag-item');
                dragItem.setAttribute('type', 'cc.ImageAsset');
                dragItem.addEventListener('dragstart', panel.dragStart.bind(panel, key));

                const image = document.createElement('ui-image');

                dragItem.appendChild(image);
                panel.$.images.appendChild(dragItem);

                image.setAttribute('class', key);
                image.setAttribute('droppable', 'cc.ImageAsset');
                image.setAttribute('class', key);
                image.setAttribute('placeholder', key);
                image.setAttribute('show-alpha', '');
                image.setAttribute('fill', '');
                image.addEventListener('confirm', panel.change.bind(panel, key));

                panel.$[`${key}-drag-item`] = dragItem;
                panel.$[`${key}-image`] = image;
            }

            function observer() {
                cancelAnimationFrame(panel.animationFrameId);
                panel.animationFrameId = window.requestAnimationFrame(() => {
                    const { clientWidth } = panel.$.container;
                    const size = Math.round((clientWidth - 40) / 4);
                    // 16 is fault tolerance to avoid page scrollbar flickering
                    if (Math.abs((panel.cachePrevWidth || 0) - clientWidth) > 16) {
                        panel.cachePrevWidth = clientWidth;
                        panel.$.container.style.setProperty('--size', `${size}px`);
                    }
                });
            }

            panel.resizeObserver = new window.ResizeObserver(observer);
            panel.resizeObserver.observe(panel.$.container);
            observer();
        },
        update() {
            const panel = this;

            for (const key in Direction) {
                const value = panel.meta.userData[key] || '';

                panel.$[`${key}-drag-item`].setAttribute(
                    'additional',
                    JSON.stringify([
                        {
                            type: 'cc.ImageAsset',
                            value,
                        },
                    ]),
                );
                updateElementInvalid.call(panel, panel.$[`${key}-drag-item`], key);
                updateElementReadonly.call(panel, panel.$[`${key}-drag-item`]);

                panel.$[`${key}-image`].value = value;
                updateElementInvalid.call(panel, panel.$[`${key}-image`], key);
                updateElementReadonly.call(panel, panel.$[`${key}-image`]);
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
            this.$.panel.injectionStyle(injectionStyle);
            this.$.panel.addEventListener('change', () => {
                this.dispatch('change');
            });
            this.$.panel.addEventListener('snapshot', () => {
                this.dispatch('snapshot');
            });
        },
        update() {
            this.$.panel.update(this.assetList, this.metaList);
        },
    },
};

exports.methods = {
    change(key, event) {
        this.metaList.forEach((meta) => {
            if (this.dragStart.exchange && this.dragStart.exchange.value) {
                const exchangeValue = meta.userData[key] || '';
                meta.userData[this.dragStart.exchange.key] = exchangeValue;
            }

            meta.userData[key] = event.target.value || undefined;
        });

        this.dispatch('change');
        this.dispatch('snapshot');

        Elements.assets.update.call(this);
        Elements.images.update.call(this);
    },
    dragStart(key, event) {
        const additional = JSON.parse(event.currentTarget.getAttribute('additional'));
        this.dragStart.exchange = additional[0];
        this.dragStart.exchange.key = key;
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
