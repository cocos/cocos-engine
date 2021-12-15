'use strict';
const fs = require("fs");
const path = require("path");
const showImage = ['cc.ImageAsset', 'cc.SpriteFrame', 'cc.Texture2D'];
exports.listeners = {};
exports.style = fs.readFileSync(path.join(__dirname, './asset.css'), 'utf8');
exports.template = `
<ui-section whole class="container">
    <header class="header" slot="header">
        <ui-icon class="icon" color tooltip="i18n:inspector.locate_asset"></ui-icon>
        <ui-image class="image" tooltip="i18n:inspector.locate_asset"></ui-image>
        <span class="name"></span>
        <ui-button class="save tiny green transparent" tooltip="i18n:inspector.asset.save">
            <ui-icon value="check"></ui-icon>
        </ui-button>
        <ui-button class="reset tiny red transparent" tooltip="i18n:inspector.asset.reset">
            <ui-icon value="reset"></ui-icon>
        </ui-button>
        <ui-icon class="lock" value="lock" tooltip="i18n:inspector.asset.prohibitEditInternalAsset"></ui-icon>
    </header>
    <section class="content">
        <section class="content-header"></section>
        <section class="content-section"></section>
        <section class="content-footer"></section>
    </section>
</ui-section>
`;
exports.$ = {
    container: '.container',
    header: '.header',
    content: '.content',
    lock: '.lock',
    icon: '.icon',
    image: '.image',
    name: '.name',
    save: '.save',
    reset: '.reset',
    contentHeader: '.content-header',
    contentSection: '.content-section',
    contentFooter: '.content-footer',
};
const Elements = {
    panel: {
        ready() {
            const panel = this;
            let animationId;
            panel.__assetChanged__ = (uuid) => {
                if (Array.isArray(panel.uuidList) && panel.uuidList.includes(uuid)) {
                    window.cancelAnimationFrame(animationId);
                    animationId = window.requestAnimationFrame(async () => {
                        await panel.reset();
                    });
                }
            };
            Editor.Message.addBroadcastListener('asset-db:asset-change', panel.__assetChanged__);
        },
        async update() {
            const panel = this;
            let assetList = [];
            try {
                assetList = await Promise.all(panel.uuidList.map((uuid) => {
                    return Editor.Message.request('asset-db', 'query-asset-info', uuid);
                }));
            }
            catch (err) {
                console.error(err);
            }
            assetList = assetList.filter(Boolean);
            panel.asset = assetList[0];
            panel.assetList = [];
            panel.uuidList = [];
            panel.type = 'unknown';
            if (panel.asset) {
                // 以第一个资源的类型，过滤多选的其他不同资源; 过滤只读资源的多选
                const type = panel.asset.importer;
                assetList.forEach((asset) => {
                    if (asset.importer === type) {
                        if (panel.uuidList.length > 0 && asset.readonly) {
                            return;
                        }
                        panel.uuidList.push(asset.uuid);
                        panel.assetList.push(asset);
                    }
                });
            }
            // 判断数据合法性
            if (!panel.asset) {
                panel.$.container.style.display = 'none';
            }
            else {
                panel.$.container.style.display = 'flex';
                panel.type = panel.asset.importer;
                if (panel.assetList.some((asset) => asset.importer !== panel.type)) {
                    panel.type = 'unknown';
                }
            }
            panel.$this.setAttribute('sub-type', panel.type);
            if (panel.type === 'unknown') {
                panel.metaList = [];
                panel.metaListOrigin = [];
                return false;
            }
            try {
                panel.metaList = await Promise.all(panel.uuidList.map((uuid) => {
                    return Editor.Message.request('asset-db', 'query-asset-meta', uuid);
                }));
            }
            catch (err) {
                console.error(err);
                panel.metaList = [];
            }
            panel.metaList = panel.metaList.filter(Boolean);
            panel.metaListOrigin = panel.metaList.map((meta) => {
                return JSON.stringify(meta);
            });
        },
        close() {
            const panel = this;
            Editor.Message.removeBroadcastListener('asset-db:asset-change', panel.__assetChanged__);
        },
    },
    header: {
        ready() {
            const panel = this;
            // save
            panel.$.save.addEventListener('click', (event) => {
                event.stopPropagation();
                panel.save();
            });
            // reset
            panel.$.reset.addEventListener('click', (event) => {
                event.stopPropagation();
                panel.reset();
            });
            // icon
            panel.$.icon.addEventListener('click', (event) => {
                event.stopPropagation();
                panel.uuidList.forEach((uuid) => {
                    Editor.Message.request('assets', 'ui-kit:touch-asset', uuid);
                });
            });
        },
        update() {
            const panel = this;
            if (!panel.asset) {
                return;
            }
            panel.$.name.innerHTML = panel.assetList.length === 1 ? panel.asset.name : `${panel.assetList.length} selections`;
            // 处理界面显示
            panel.$.lock.style.display = panel.asset.readonly ? 'inline-block' : 'none';
            const isImage = showImage.includes(panel.asset.type);
            if (isImage) {
                panel.$.image.value = panel.asset.uuid;
                panel.$.header.prepend(panel.$.image);
                panel.$.icon.remove();
            }
            else {
                panel.$.icon.value = panel.asset.importer;
                panel.$.header.prepend(panel.$.icon);
                panel.$.image.value = ''; // 清空，避免缓存
                panel.$.image.remove();
            }
        },
        async isDirty() {
            const panel = this;
            const isDirty = await panel.isDirty();
            if (isDirty) {
                panel.$.header.setAttribute('dirty', '');
            }
            else {
                panel.$.header.removeAttribute('dirty');
            }
        },
    },
    content: {
        ready() {
            const panel = this;
            panel.contentRenders = {};
        },
        update() {
            const panel = this;
            // 重置渲染对象
            panel.contentRenders = {
                header: {
                    list: [],
                    contentRender: panel.$.contentHeader,
                },
                section: {
                    list: panel.renderMap.section['unknown'],
                    contentRender: panel.$.contentSection,
                },
                footer: {
                    list: [],
                    contentRender: panel.$.contentFooter,
                },
            };
            for (const renderName in panel.renderMap) {
                if (panel.renderMap[renderName] && panel.renderMap[renderName][panel.type]) {
                    panel.contentRenders[renderName].list = panel.renderMap[renderName][panel.type];
                }
            }
            for (const renderName in panel.contentRenders) {
                const { list, contentRender } = panel.contentRenders[renderName];
                contentRender.__panels__ = Array.from(contentRender.children);
                let i = 0;
                for (i; i < list.length; i++) {
                    const file = list[i];
                    if (!contentRender.__panels__[i]) {
                        contentRender.__panels__[i] = document.createElement('ui-panel');
                        contentRender.__panels__[i].addEventListener('change', () => {
                            Elements.header.isDirty.call(panel);
                        });
                        contentRender.appendChild(contentRender.__panels__[i]);
                        // contentRender.__panels__[i] = contentRender.__panels__[i];
                    }
                    contentRender.__panels__[i].setAttribute('src', file);
                }
                // 清除尾部多余的节点
                for (i; i < contentRender.__panels__.length; i++) {
                    contentRender.removeChild(contentRender.__panels__[i]);
                }
                contentRender.__panels__ = Array.from(contentRender.children);
                Array.prototype.forEach.call(contentRender.__panels__, ($panel) => {
                    $panel.injectionStyle(`ui-prop { margin-top: 5px; }`);
                    $panel.update(panel.assetList, panel.metaList);
                });
            }
        },
    },
};
exports.methods = {
    async isDirty() {
        const panel = this;
        let isDirty = false;
        // 1/2 满足大部分资源的情况，因为大部分资源只修改 meta 数据
        if (panel.metaList) {
            isDirty = panel.metaList.some((meta, index) => {
                return panel.metaListOrigin[index] !== JSON.stringify(meta);
            });
            if (isDirty) {
                return isDirty;
            }
        }
        // 2/2 部分资源需要 scene 配合，数据的是否变动需要调接口
        for (const renderName in panel.contentRenders) {
            const { contentRender } = panel.contentRenders[renderName];
            if (!Array.isArray(contentRender.__panels__)) {
                continue;
            }
            for (let i = 0; i < contentRender.__panels__.length; i++) {
                isDirty = await contentRender.__panels__[i].callMethod('isDirty');
                if (isDirty) {
                    return isDirty;
                }
            }
        }
        return isDirty;
    },
    async save() {
        const panel = this;
        // 首先调用所有 panel 里的 methods.canApply 检查是否允许保存
        const tasks = [];
        for (const renderName in panel.contentRenders) {
            const { contentRender } = panel.contentRenders[renderName];
            if (!Array.isArray(contentRender.__panels__)) {
                continue;
            }
            for (let i = 0; i < contentRender.__panels__.length; i++) {
                tasks.push(contentRender.__panels__[i].callMethod('canApply'));
            }
        }
        const canApplyResults = await Promise.all(tasks);
        const canApply = !canApplyResults.some((boolean) => {
            return boolean === false;
        });
        // 不允许保存则中断
        if (!canApply) {
            return;
        }
        // 有些资源在内部的 apply 保存数据后，会自动重导资源，自动更新 meta 数据，所以 meta 不需要再额外更新
        let continueSaveMeta = true;
        for (const renderName in panel.contentRenders) {
            const { contentRender } = panel.contentRenders[renderName];
            if (!Array.isArray(contentRender.__panels__)) {
                continue;
            }
            for (let i = 0; i < contentRender.__panels__.length; i++) {
                const saveState = await contentRender.__panels__[i].callMethod('apply');
                /**
                 * return false; 是保存失败
                 * return true; 是保存成功，但不继续保存 meta
                 * return; 是保存成功，且向上冒泡继续保存 meta
                 */
                if (saveState === false) {
                    return;
                }
                if (saveState == true) {
                    continueSaveMeta = false;
                }
            }
        }
        panel.$.header.removeAttribute('dirty');
        if (continueSaveMeta === false) {
            return;
        }
        panel.uuidList.forEach((uuid, index) => {
            const content = JSON.stringify(panel.metaList[index]);
            // 没有变化则不修改
            if (content === panel.metaListOrigin[index]) {
                return;
            }
            panel.metaListOrigin[index] = content;
            Editor.Message.request('asset-db', 'save-asset-meta', uuid, content);
        });
    },
    async reset() {
        const panel = this;
        panel.$.header.removeAttribute('dirty');
        for (const renderName in panel.contentRenders) {
            const { contentRender } = panel.contentRenders[renderName];
            for (let i = 0; i < contentRender.__panels__.length; i++) {
                await contentRender.__panels__[i].callMethod('reset');
            }
        }
        panel.$this.update(panel.uuidList, panel.renderMap);
    },
};
async function update(uuidList, renderMap) {
    const panel = this;
    panel.uuidList = uuidList || [];
    panel.renderMap = renderMap;
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            await element.update.call(panel);
        }
    }
}
exports.update = update;
function ready() {
    const panel = this;
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(panel);
        }
    }
}
exports.ready = ready;
async function beforeClose() {
    const panel = this;
    if (panel.isDialoging) {
        return false;
    }
    for (const renderName in panel.contentRenders) {
        const { contentRender } = panel.contentRenders[renderName];
        if (!Array.isArray(contentRender.__panels__)) {
            continue;
        }
        for (let i = 0; i < contentRender.__panels__.length; i++) {
            const canClose = await contentRender.__panels__[i].canClose();
            if (!canClose) {
                return false;
            }
        }
    }
    const isDirty = await panel.isDirty();
    if (!isDirty) {
        return true;
    }
    let result = 2;
    if (await Editor.Profile.getConfig('inspector', 'asset.auto_save')) {
        result = 1;
    }
    else {
        panel.isDialoging = true;
        const message = Editor.I18n.t(`inspector.check_is_saved.assetMessage`).replace('${assetName}', panel.asset.name);
        const warnResult = await Editor.Dialog.warn(message, {
            buttons: [Editor.I18n.t('inspector.check_is_saved.abort'), Editor.I18n.t('inspector.check_is_saved.save'), 'Cancel'],
            default: 1,
            cancel: 2,
        });
        result = warnResult.response;
        panel.isDialoging = false;
    }
    if (result === 0) {
        // abort
        panel.$.header.removeAttribute('dirty');
        return true;
    }
    if (result === 1) {
        // save
        await panel.save();
        return true;
    }
    return false;
}
exports.beforeClose = beforeClose;
async function close() {
    const panel = this;
    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.close) {
            element.close.call(panel);
        }
    }
}
exports.close = close;

exports.config = {
    header: require('../assets-header'),
    section: require('../assets'),
    footer: require('../assets-footer'),
};
