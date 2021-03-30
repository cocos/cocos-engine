exports.style = `
.asset-texture-cube {
    overflow: auto;
    padding: 0 10px;
  }
  .asset-texture-cube .ins-prop {
    margin: 15px 0;
  }
  .asset-texture-cube .ins-prop ui-asset {
    flex: 1;
  }
  .asset-texture-cube .texture-cube-preview {
    height: 300px;
    background: var(--color-normal-fill-emphasis);
    outline: none;
    padding: 20px;
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
  .asset-texture-cube .texture-cube-preview .center {
    position: relative;
    width: calc(var(--size) * 4);
    height: calc(var(--size) * 3);
  }
  .asset-texture-cube .texture-cube-preview ui-image {
    line-height: var(--size);
    position: absolute;
    width: var(--size);
    height: var(--size);
    background: var(--color-normal-fill-weaker);
    text-align: center;
    overflow: hidden;
  }
  .asset-texture-cube .texture-cube-preview ui-image[hovering] {
    outline: 1px solid green;
  }
  .asset-texture-cube .texture-cube-preview canvas {
    pointer-events: none;
  }
  .asset-texture-cube .texture-cube-preview .top {
    top: 0;
    left: calc(var(--size) * 2);
  }
  .asset-texture-cube .texture-cube-preview .bottom {
    top: calc(var(--size) * 2);
    left: calc(var(--size) * 2);
  }
  .asset-texture-cube .texture-cube-preview .front {
    top: var(--size);
    left: calc(var(--size) * 2);
  }
  .asset-texture-cube .texture-cube-preview .back {
    top: var(--size);
    left: 0;
  }
  .asset-texture-cube .texture-cube-preview .left {
    top: var(--size);
    left: var(--size);
  }
  .asset-texture-cube .texture-cube-preview .right {
    top: var(--size);
    left: calc(var(--size) * 3);
  }
  .image-preview {
    height: 200px;
    background: var(--color-normal-fill-emphasis);
    border: 1px solid var(--color-normal-border-emphasis);
    display: flex;
    padding: 10px;
    position: relative;
  }
  .image-preview >.content {
    flex: 1;
    display: flex;
  }
  .image-preview >.content >canvas {
    max-width: 100%;
    margin: auto;
    display: block;
    background-image: url(packages://inspector/static/checkerboard-32x32.png);
    background-size: 32px 32px;
    background-position: center center;
  }
  .image-preview >.label {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 4px;
    text-align: center;
  }
  .image-preview >.label >span {
    font-size: 10px;
    padding: 2px 8px;
    background-color: var(--color-primary-fill);
    color: var(--color-primary-contrast-weakest);
    border-radius: calc(var(--size-normal-radius) * 1px);
  }
  .asset-texture {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .asset-texture > .content {
    padding-bottom: 15px;
    flex: 1;
    overflow: auto;
  }
  .asset-texture > .content > .edit-btn {
    text-align: center;
    margin-top: 10px;
  }
  .asset-texture > .content > ui-prop > .warn-words {
    margin-top: 20px;
    margin-bottom: 20px;
    line-height: 1.7;
    color: var(--color-warn-fill);
  }
  
`;

const KEYS = ['left', 'right', 'top', 'bottom', 'front', 'back'];
exports.template = `
<section class="asset-texture-cube">
    <div id="allContent">
        <ui-prop>
            <div slot="label">
                <span tootip="left">left ( -X ) </span>
            </div>
            <div slot="content">
                <ui-asset
                    droppable="cc.ImageAsset"
                    id="left"
                ></ui-asset>
            </div>
        </ui-prop>
        <ui-prop>
            <div slot="label">
                <span tootip="right">right ( +X ) </span>
            </div>
            <div slot="content">
                <ui-asset
                    droppable="cc.ImageAsset"
                    id="right"
                ></ui-asset>
            </div>
        </ui-prop>
        <ui-prop>
            <div slot="label">
                <span tootip="top">top ( +Y ) </span>
            </div>
            <div slot="content">
                <ui-asset
                    droppable="cc.ImageAsset"
                    id="top"
                ></ui-asset>
            </div>
        </ui-prop>
        <ui-prop>
            <div slot="label">
                <span tootip="bottom">bottom ( -Y ) </span>
            </div>
            <div slot="content">
                <ui-asset
                    droppable="cc.ImageAsset"
                    id="bottom"
                ></ui-asset>
            </div>
        </ui-prop>
        <ui-prop>
            <div slot="label">
                <span tootip="front">front ( +Z ) </span>
            </div>
            <div slot="content">
                <ui-asset
                    droppable="cc.ImageAsset"
                    id="front"
                ></ui-asset>
            </div>
        </ui-prop>
        <ui-prop>
            <div slot="label">
                <span tootip="back">back ( -Z ) </span>
            </div>
            <div slot="content">
                <ui-asset
                    droppable="cc.ImageAsset"
                    id="back"
                ></ui-asset>
            </div>
        </ui-prop>
        <div
            class="texture-cube-preview"
            id="preview"
        >
            <div class="center">
                <ui-drag-item
                    id="leftDragItem"
                    type="cc.ImageAsset"
                >
                    <ui-image
                        class="info left"
                        droppable="cc.ImageAsset"
                        placeholder="left"
                        tooltip="left"
                    ></ui-image>
                </ui-drag-item>
                <ui-drag-item
                    id="rightDragItem"
                    type="cc.ImageAsset"
                >
                    <ui-image
                        class="info right"
                        droppable="cc.ImageAsset"
                        placeholder="right"
                        tooltip="right"
                    ></ui-image>
                </ui-drag-item>
                <ui-drag-item
                    id="topDragItem"
                    type="cc.ImageAsset"
                >
                    <ui-image
                        class="info top"
                        droppable="cc.ImageAsset"
                        placeholder="top"
                        tooltip="top"
                    ></ui-image>
                </ui-drag-item>
                <ui-drag-item
                    id="bottomDragItem"
                    type="cc.ImageAsset"
                >
                    <ui-image
                        class="info bottom"
                        droppable="cc.ImageAsset"
                        placeholder="bottom"
                        class="bottom"
                    ></ui-image>
                </ui-drag-item>
                <ui-drag-item
                    id="frontDragItem"
                    type="cc.ImageAsset"
                >
                    <ui-image
                        class="info front"
                        droppable="cc.ImageAsset"
                        placeholder="front"
                        tooltip="front"
                    ></ui-image>
                </ui-drag-item>
                <ui-drag-item
                    id="backDragItem"
                    type="cc.ImageAsset"
                >
                    <ui-image
                        class="info back"
                        droppable="cc.ImageAsset"
                        placeholder="back"
                        tooltip="back"
                    ></ui-image>
                </ui-drag-item>
            </div>
        </div>
        <section class="asset-texture">
            <div class="content">
                <ui-prop>
                    <span slot="label">
                        <ui-label
                            tooltip="i18n:ENGINE.assets.textureCube.anisotropyTip"
                            i18n
                        >ENGINE.assets.textureCube.anisotropy</ui-label>
                        <ui-icon value="lock"></ui-icon>
                    </span>
                    <ui-num-input
                        slot="content"
                        id="anisotropy"
                    ></ui-num-input>
                </ui-prop>
                <ui-prop>
                    <span slot="label">
                        <ui-label
                            tooltip="i18n:ENGINE.assets.textureCube.minFilterTip"
                            i18n
                        >ENGINE.assets.textureCube.minFilter</ui-label>
                        <ui-icon value="lock"></ui-icon>
                    </span>
                    <ui-select
                        slot="content"
                        id="minfilter"
                    >
                        <option value="nearest">nearest</option>
                        <option value="linear">linear</option>

                    </ui-select>
                </ui-prop>
                <ui-prop>
                    <span slot="label">
                        <ui-label
                            tooltip="i18n:ENGINE.assets.textureCube.magFilterTip"
                            i18n
                        >ENGINE.assets.textureCube.magFilter</ui-label>
                        <ui-icon value="lock"></ui-icon>
                    </span>
                    <ui-select
                        slot="content"
                        id="magfilter"
                    >
                        <option value="nearest">nearest</option>
                        <option value="linear">linear</option>
                    </ui-select>
                </ui-prop>
                <ui-prop>
                    <ui-prop>
                        <span slot="label">
                            <ui-label
                                tooltip="i18n:ENGINE.assets.textureCube.mipFilterTip"
                                i18n
                            >ENGINE.assets.textureCube.mipFilter</ui-label>
                            <ui-icon value="lock"></ui-icon>
                        </span>
                        <ui-select
                            slot="content"
                            id="mipfilter"
                        >
                            <option value="none">none</option>
                            <option value="nearest">nearest</option>
                            <option value="linear">linear</option>
                        </ui-select>
                    </ui-prop>
                    <ui-prop id="warpModeSUIProp">
                        <span slot="label">
                            <ui-label
                                tooltip="i18n:ENGINE.assets.textureCube.wrapModeSTip"
                                i18n
                            >ENGINE.assets.textureCube.wrapModeS</ui-label>
                            <ui-icon value="lock"></ui-icon>
                        </span>
                        <ui-select
                            slot="content"
                            id="wrapModeS"
                        >
                            <option value="repeat">repeat</option>
                            <option value="clamp-to-edge">clamp-to-edge</option>
                            <option value="mirrored-repeat">mirrored-repeat</option>
                        </ui-select>
                    </ui-prop>
                    <ui-prop id="warpModeTUIProp">
                        <span slot="label">
                            <ui-label
                                tooltip="i18n:ENGINE.assets.textureCube.wrapModeTTip"
                                i18n
                            >ENGINE.assets.textureCube.wrapModeT</ui-label>
                            <ui-icon value="lock"></ui-icon>
                        </span>
                        <ui-select
                            slot="content"
                            id="wrapModeT"
                        >
                            <option value="repeat">repeat</option>
                            <option value="clamp-to-edge">clamp-to-edge</option>
                            <option value="mirrored-repeat">mirrored-repeat</option>
                        </ui-select>
                    </ui-prop>
                    <div class="warn-words">
                        <ui-label
                            i18n
                            id=warnWords
                        >ENGINE.assets.texture.modeWarn</ui-label>
                    </div>
                </ui-prop>
            </div>
        </section>
    </div>
</section>
`;

exports.methods = {
    /**
     * Checks whether a data is invalid in the multiple - selected state
     * @param key string
     */
    getInvalid (key) {
        const source = this.metas[0].userData[key];
        return !this.metas.every((meta) => source === meta.userData[key]);
    },

    calcSize () {
        if (!this.$.preview) {
            return;
        }
        const { clientWidth, clientHeight } = this.$.preview;
        this.size = Math.round(Math.min((clientWidth - 40) / 4, (clientHeight - 40) / 3));
        this.$.preview.style.setProperty('--size', `${this.size}px`);
    },

    /**
     *
     * @param {*} key string
     * @param {*} param2 event | options
     * @param {*} param3 event | undefinded
     */
    _onChangeData (key, param2 = { delay: 0 }, param3) {
        const event = param3 || param2;
        this.metas.forEach((meta) => {
            meta.userData[key] = event && event.target && event.target.value;
        });

        if (param2.delay) {
            setTimeout(() => {
                this.checkWrapMode();
            }, param2.delay);
        } else {
            this.checkWrapMode();
        }
        this.dispatch('change');
    },

    /**
     * 条件检查：图片的宽高是否是 2 的幂次方
     * 在 wrap mode 值为 repeat 的情况下条件不成立需要给出警告信息
     */
    checkWrapMode () {
        const { wrapModeT, wrapModeS } = this.meta.userData;

        this.isUnlegalWrapModeT = false;
        this.isUnlegalWrapModeS = false;

        const uiImages = this.$this.querySelectorAll('ui-image');
        uiImages.forEach((uiImage) => {
            if (uiImage.$img.src) {
                const image = new Image();
                image.src = uiImage.$img.src;
                const { width, height } = image;
                // 判断 2 的幂次方算法：(number & number - 1) === 0
                const isUnlegal = (width & width - 1) || (height & height - 1);

                const isUnlegalT = isUnlegal && wrapModeT === 'repeat';
                const isUnlegalS = isUnlegal && wrapModeS === 'repeat';

                if (isUnlegalT) {
                    this.isUnlegalWrapModeT = isUnlegalT;
                }

                if (isUnlegalS) {
                    this.isUnlegalWrapModeS = isUnlegalS;
                }
            }
        });
    },

    /**
     * 开始拖拽图片
     * @param name 图片名称
     * @param event
     */
    onImageDragStart (name, event) {
        const uuid = this.meta.userData[name] || '';
        event.dataTransfer.setData('value', uuid);
        event.dataTransfer.setData('name', name);
        event.dataTransfer.setData('from', 'texture-cube-image');
    },

    /**
     * 拖拽图片后,移除原始图片
     * @param event
     */
    onImageDrop (event) {
        const from = event.dataTransfer.getData('from');
        if (from !== 'texture-cube-image') {
            return;
        }
        const name = event.dataTransfer.getData('name');
        this._onChangeData(name, null);
    },
};

exports.$ = {
    allContent: '#allContent',
    anisotropy: '#anisotropy',
    minfilter: '#minfilter',
    magfilter: '#magfilter',
    mipfilter: '#mipfilter',
    wrapModeS: '#wrapModeS',
    wrapModeT: '#wrapModeT',
    warnWords: '#warnWords',
    preview: '#preview',
    warpModeSUIProp: '#warpModeSUIProp',
    warpModeTUIProp: '#warpModeTUIProp',
};

const uiElements = {
    warpModeSUIProp: {
        update () {
            this.$.warpModeSUIProp.className = this.isUnlegalWrapModeS ? 'warn' : undefined;
        },
    },
    warpModeTUIProp: {
        update () {
            this.$.warpModeTUIProp.className = this.isUnlegalWrapModeT ? 'warn' : undefined;
        },
    },
    insProps: {
        ready () {
            for (const key of KEYS) {
                this.$[key] = this.$this.shadowRoot.querySelector(`#${key}`);
                const element = this.$[key];
                element.addEventListener('confirm', this._onChangeData.bind(this, key, 100));
            }
        },
        update () {
            for (const key of KEYS) {
                const element = this.$[key];
                element.value = this.meta.userData[key] || '';
            }
        },

    },
    dragItems: {
        ready () {
            for (const key of KEYS) {
                this.$[`${key}DragItem`] = this.$this.shadowRoot.querySelector(`#${key}DragItem`);
                const element = this.$[`${key}DragItem`];
                element.addEventListener('dragstart', this.onImageDragStart.bind(this, key));
                const image = element.querySelector('ui-image');
                image.addEventListener('change', this._onChangeData.bind(this, key, 100));
                image.addEventListener('drop', this.onImageDrop.bind(this));
            }
        },
        update () {
            for (const key of KEYS) {
                const element = this.$[`${key}DragItem`];
                element.draggable = this.meta.userData[key];
                const image = element.querySelector('ui-image');
                image.value = this.meta.userData[key] || '';
            }
        },
    },
    warnWords: {
        update () {
            const isHidden = !(this.isUnlegalWrapModeT || this.isUnlegalWrapModeS);
            this.$.warnWords.style = isHidden ? 'display:none' : '';
        },
    },
    allContent: {
        update () {
            this.$.allContent.hidden = this.metas.length !== 1;
        },
    },
    lockIcons: {
        ready () {
            this.lockIcons = this.$this.shadowRoot.querySelectorAll('ui-icon[value="lock"]');
        },
        update () {
            this.lockIcons.forEach((icon) => {
                const isHidden = !this.assetInfo.readonly;
                icon.style = isHidden ? 'display:none' : '';
            });
        },
    },
    anisotropy: {
        ready () {
            this.$.anisotropy.addEventListener('change', this._onChangeData.bind(this, 'anisotropy'));
        },
        update () {
            this.$.anisotropy.invalid = this.getInvalid('anisotropy');
            this.$.anisotropy.disabled = this.assetInfo.readonly;
            this.$.anisotropy.value = this.meta.userData.anisotropy;
        },
    },
    minfilter: {
        ready () {
            this.$.minfilter.addEventListener('change', this._onChangeData.bind(this, 'minfilter'));
        },
        update () {
            this.$.minfilter.invalid = this.getInvalid('minfilter');
            this.$.minfilter.disabled = this.assetInfo.readonly;
            this.$.minfilter.value = this.meta.userData.minfilter;
        },
    },
    magfilter: {
        ready () {
            this.$.magfilter.addEventListener('change', this._onChangeData.bind(this, 'magfilter'));
        },
        update () {
            this.$.magfilter.invalid = this.getInvalid('magfilter');
            this.$.magfilter.disabled = this.assetInfo.readonly;
            this.$.magfilter.value = this.meta.userData.magfilter;
        },
    },
    mipfilter: {
        ready () {
            this.$.mipfilter.addEventListener('change', this._onChangeData.bind(this, 'mipfilter'));
        },
        update () {
            this.$.mipfilter.invalid = this.getInvalid('mipfilter');
            this.$.mipfilter.disabled = this.assetInfo.readonly;
            this.$.mipfilter.value = this.meta.userData.mipfilter;
        },
    },
    wrapModeS: {
        ready () {
            this.$.wrapModeS.addEventListener('change', this._onChangeData.bind(this, 'wrapModeS'));
        },
        update () {
            this.$.wrapModeS.invalid = this.getInvalid('wrapModeS');
            this.$.wrapModeS.disabled = this.assetInfo.readonly;
            this.$.wrapModeS.value = this.meta.userData.wrapModeS;
        },
    },
    wrapModeT: {
        ready () {
            this.$.wrapModeT.addEventListener('change', this._onChangeData.bind(this, 'wrapModeT'));
        },
        update () {
            this.$.wrapModeT.invalid = this.getInvalid('wrapModeT');
            this.$.wrapModeT.disabled = this.assetInfo.readonly;
            this.$.wrapModeT.value = this.meta.userData.wrapModeT;
        },
    },
};
exports.ready = function () {
    this.size = 40;
    this.isUnlegalWrapModeS = false;
    this.isUnlegalWrapModeT = false;
    for (const key in uiElements) {
        const element = uiElements[key];
        if (typeof element.ready === 'function') {
            element.ready.call(this);
        }
    }
};
exports.update = function (assetList, metaList) {
    this.metas = metaList;
    this.meta = this.metas[0];
    this.assetInfo = assetList[0];
    this.calcSize();
    for (const key in uiElements) {
        const element = uiElements[key];
        if (typeof element.update === 'function') {
            element.update.call(this);
        }
    }
};
