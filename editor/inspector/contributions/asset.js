'use strict';
const fs = require('fs');
const path = require('path');
const { injectionStyle } = require('../utils/prop');
const History = require('./asset-history/index');

exports.listeners = {};

exports.style = fs.readFileSync(path.join(__dirname, './asset.css'), 'utf8');

exports.template = `
<div class="container">
    <header class="header">
        <ui-asset-image class="asset-thumbnail" size="small" tooltip="i18n:ENGINE.assets.locate_asset"></ui-asset-image>
        <ui-label class="name"></ui-label>
        <ui-button class="save tiny green" tooltip="i18n:ENGINE.assets.save">
            <ui-icon value="check"></ui-icon>
        </ui-button>
        <ui-button class="reset tiny" tooltip="i18n:ENGINE.assets.reset">
            <ui-icon value="reset" color></ui-icon>
        </ui-button>
        <ui-button class="location transparent" icon tooltip="i18n:ENGINE.assets.locate_asset">
            <ui-icon value="location"></ui-icon>
        </ui-button>
        <ui-button class="copy transparent" icon tooltip="i18n:ENGINE.inspector.cloneToEdit">
            <ui-icon value="copy"></ui-icon>
        </ui-button>
        <ui-link value="" class="help" tooltip="i18n:ENGINE.menu.help_url">
            <ui-icon value="help"></ui-icon>
        </ui-link>
    </header>
    <section class="content">
        <section class="content-header">
            <inspector-resize-preview area="header"></inspector-resize-preview>
        </section>
        <section class="content-section"></section>
        <section class="content-footer">
            <inspector-resize-preview area="footer"></inspector-resize-preview>
        </section>
    </section>
</div>
`;

exports.$ = {
    container: '.container',
    header: '.header',
    content: '.content',
    location: '.location',
    copy: '.copy',
    assetThumbnail: '.asset-thumbnail',
    name: '.name',
    help: '.help',
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
            panel.__assetChangedHandle__ = undefined;

            panel.__assetChanged__ = (uuid) => {
                if (Array.isArray(panel.uuidList) && panel.uuidList.includes(uuid)) {
                    window.cancelAnimationFrame(panel.__assetChangedHandle__);
                    panel.__assetChangedHandle__ = window.requestAnimationFrame(async () => {
                        await panel.reset();
                    });
                }
            };

            Editor.Message.addBroadcastListener('asset-db:asset-change', panel.__assetChanged__);

            Elements.panel.i18nChangeBind = Elements.panel.i18nChange.bind(panel);
            Editor.Message.addBroadcastListener('i18n:change', Elements.panel.i18nChangeBind);

            panel.history = new History();
        },
        async update() {
            const panel = this;

            let assetList = [];

            try {
                assetList = await Promise.all(
                    panel.uuidList.map((uuid) => {
                        return Editor.Message.request('asset-db', 'query-asset-info', uuid);
                    }),
                );
            } catch (err) {
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
            } else {
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
                return;
            }

            try {
                panel.metaList = await Promise.all(
                    panel.uuidList.map((uuid) => {
                        return Editor.Message.request('asset-db', 'query-asset-meta', uuid);
                    }),
                );
            } catch (err) {
                console.error(err);
                panel.metaList = [];
            }

            panel.metaList = panel.metaList.filter(Boolean);

            panel.metaListOrigin = panel.metaList.map((meta) => {
                return JSON.stringify(meta);
            });

            panel.setHelpUrl(panel.$.help, { help: panel.type });
        },
        close() {
            const panel = this;

            if (panel.__assetChangedHandle__) {
                window.cancelAnimationFrame(panel.__assetChangedHandle__);
                panel.__assetChangedHandle__ = undefined;
            }

            Editor.Message.removeBroadcastListener('asset-db:asset-change', panel.__assetChanged__);

            delete panel.history;
        },
        i18nChange() {
            const panel = this;

            const $links = panel.$.container.querySelectorAll('ui-link');
            $links.forEach($link => panel.setHelpUrl($link));
        },
    },
    header: {
        ready() {
            const panel = this;

            panel.$.save.addEventListener('click', (event) => {
                event.stopPropagation();
                panel.save();
            });

            panel.$.reset.addEventListener('click', (event) => {
                event.stopPropagation();
                panel.reset();
            });

            panel.$.copy.addEventListener('click', async (event) => {
                event.stopPropagation();
                const assetsDir = path.join(Editor.Project.path, 'assets');
                const result = await Editor.Dialog.select({
                    path: assetsDir,
                    type: 'directory',
                });

                let filePath = result.filePaths[0];
                if (!filePath) {
                    return;
                }

                filePath = path.join(filePath, panel.asset.name);

                // 必须保存在 /assets 文件夹下
                if (!Editor.Utils.Path.contains(assetsDir, filePath)) {
                    await Editor.Dialog.warn(Editor.I18n.t('ENGINE.dialog.warn'), {
                        detail: Editor.I18n.t('ENGINE.inspector.cloneToDirectoryIllegal'),
                        buttons: [Editor.I18n.t('ENGINE.dialog.confirm')],
                    });
                    return;
                }

                const target = await Editor.Message.request('asset-db', 'query-url', filePath);
                if (target) {
                    const asset = await Editor.Message.request('asset-db', 'copy-asset', panel.asset.url, target);
                    if (asset) {
                        const lastSelectType = Editor.Selection.getLastSelectedType();
                        if (lastSelectType === 'asset') {
                            // 纯资源模式下
                            Editor.Selection.clear(lastSelectType);
                            Editor.Selection.select(lastSelectType, asset.uuid);
                        } else if (lastSelectType === 'node') {
                            // 节点里使用资源的情况下，如材质
                            Editor.Message.broadcast('inspector:replace-asset-uuid-in-nodes', panel.asset.uuid, asset.uuid);
                        }
                    }
                }
            });

            panel.$.assetThumbnail.addEventListener('click', (event) => {
                event.stopPropagation();
                panel.uuidList.forEach((uuid) => {
                    Editor.Message.request('assets', 'ui-kit:touch-asset', uuid);
                });
            });

            panel.$.location.addEventListener('click', (event) => {
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

            panel.$.name.value = panel.assetList.length === 1 ? panel.asset.name : `${panel.assetList.length} selections`;

            if (panel.asset.readonly) {
                panel.$.name.setAttribute('tooltip', 'i18n:inspector.asset.prohibitEditInternalAsset');
                panel.$.name.setAttribute('readonly', '');

                if (panel.asset.source && panel.asset.importer !== 'database') {
                    panel.$.copy.style.display = 'inline-flex';
                } else {
                    panel.$.copy.style.display = 'none';
                }
            } else {
                panel.$.name.removeAttribute('tooltip');
                panel.$.name.removeAttribute('readonly');
                panel.$.copy.style.display = 'none';
            }

            panel.$.assetThumbnail.value = panel.asset.uuid;
        },
        async isDirty() {
            const panel = this;

            const isDirty = await panel.isDirty();
            if (isDirty) {
                panel.$.header.setAttribute('dirty', '');
            } else {
                panel.$.header.removeAttribute('dirty');
            }
        },
    },
    content: {
        ready() {
            const panel = this;

            panel.contentRenders = {};
        },
        async update() {
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
                contentRender.__panels__ = Array.from(contentRender.children).filter((el) => el.tagName === 'UI-PANEL');
                let i = 0;
                for (i; i < list.length; i++) {
                    const file = list[i];
                    if (!contentRender.__panels__[i]) {
                        contentRender.__panels__[i] = document.createElement('ui-panel');
                        contentRender.__panels__[i].injectionStyle(injectionStyle);
                        contentRender.__panels__[i].addEventListener('change', () => {
                            Elements.header.isDirty.call(panel);
                        });
                        contentRender.__panels__[i].addEventListener('snapshot', () => {
                            panel.history && panel.history.snapshot(panel);
                        });
                        contentRender.appendChild(contentRender.__panels__[i]);
                    }
                    contentRender.__panels__[i].setAttribute('src', file);
                }

                // 清除尾部多余的节点
                for (i; i < contentRender.__panels__.length; i++) {
                    contentRender.removeChild(contentRender.__panels__[i]);
                }

                try {
                    await Promise.all(
                        contentRender.__panels__.map(($panel) => {
                            return $panel.update(panel.assetList, panel.metaList);
                        }),
                    );
                } catch (err) {
                    console.error(err);
                }
            }
        },
    },
};

exports.methods = {
    undo() {
        const panel = this;
        panel.history && panel.history.undo();
    },
    redo() {
        const panel = this;
        panel.history && panel.history.redo();
    },
    async record() {
        const panel = this;

        const renderData = {};
        for (const renderName in panel.contentRenders) {
            const { contentRender } = panel.contentRenders[renderName];

            if (!Array.isArray(contentRender.__panels__)) {
                continue;
            }

            renderData[renderName] = [];

            for (let i = 0; i < contentRender.__panels__.length; i++) {
                try {
                    if (contentRender.__panels__[i].panelObject.record) {
                        const data = await contentRender.__panels__[i].callMethod('record');
                        renderData[renderName].push(data);
                    } else {
                        renderData[renderName].push(null);
                    }
                } catch (error) {
                    renderData[renderName].push(null);
                    console.debug(error);
                }
            }
        }

        return {
            uuidListStr: JSON.stringify(panel.uuidList),
            metaListStr: JSON.stringify(panel.metaList),
            renderDataStr: JSON.stringify(renderData),
        };
    },
    restore(record) {
        const panel = this;

        try {
            const { uuidListStr, metaListStr, renderDataStr } = record;

            // uuid 数据不匹配表明不是同一个编辑对象了
            if (JSON.stringify(panel.uuidList) !== uuidListStr) {
                return false;
            }

            // metaList 数据不一样的对 metaList 进行更新
            if (JSON.stringify(panel.metaList) !== metaListStr) {
                panel.metaList = JSON.parse(metaListStr);

                for (const renderName in panel.contentRenders) {
                    const { contentRender } = panel.contentRenders[renderName];

                    if (!Array.isArray(contentRender.__panels__)) {
                        continue;
                    }

                    for (let i = 0; i < contentRender.__panels__.length; i++) {
                        contentRender.__panels__[i].update(panel.assetList, panel.metaList);
                    }
                }
            }

            const renderData = JSON.parse(renderDataStr);
            for (const renderName in panel.contentRenders) {
                const { contentRender } = panel.contentRenders[renderName];

                if (!Array.isArray(contentRender.__panels__)) {
                    continue;
                }

                if (!Array.isArray(renderData[renderName])) {
                    continue;
                }

                if (!renderData[renderName].length) {
                    continue;
                }

                for (let i = 0; i < contentRender.__panels__.length; i++) {
                    if (renderData[renderName][i] && contentRender.__panels__[i].panelObject.restore) {
                        contentRender.__panels__[i].callMethod('restore', renderData[renderName][i]);
                    }
                }
            }

            Elements.header.isDirty.call(panel);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

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
                } else if (saveState === true) {
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
    async abort() {
        const panel = this;
        panel.$.header.removeAttribute('dirty');

        for (const renderName in panel.contentRenders) {
            const { contentRender } = panel.contentRenders[renderName];

            for (let i = 0; i < contentRender.__panels__.length; i++) {
                await contentRender.__panels__[i].callMethod('abort');
            }
        }
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

        if (panel.ready !== true) {
            return;
        }

        panel.$this.update(panel.uuidList, panel.renderMap);
    },
    setHelpUrl($link, data) {
        if (data) {
            $link.helpData = data;
        } else {
            if (!$link.helpData) {
                return;
            }
            data = $link.helpData;
        }

        const url = this.getHelpUrl(data);

        if (url) {
            $link.style.display = 'block';
            $link.value = url;
        } else {
            $link.style.display = 'none';
        }
    },
    getHelpUrl(data) {
        return Editor.I18n.t(`ENGINE.help.assets.${data.help}`);
    },
    replaceContainerWithUISection(params) {
        const panel = this;
        const $containerDiv = panel.$.container;
        const $header = panel.$.container.querySelector('.header');
        $header.setAttribute('slot', 'header');

        const $content = panel.$.container.querySelector('.content');

        const $containerUISection = document.createElement('ui-section');
        $containerUISection.setAttribute('class', 'container config no-padding');
        $containerUISection.setAttribute('cache-expand', params.uuid);

        $containerUISection.appendChild($header);
        $containerUISection.appendChild($content);

        $containerDiv.replaceWith($containerUISection);

    },
};

exports.update = async function update(uuidList, renderMap, dropConfig) {
    const panel = this;

    const enginePath = path.join('editor', 'inspector', 'assets');
    Object.values(renderMap).forEach(config => {
        Object.values(config).forEach(renders => {
            renders.sort((a, b) => {
                return b.indexOf(enginePath) - a.indexOf(enginePath);
            });
        });
    });

    panel.uuidList = uuidList || [];
    panel.renderMap = renderMap;
    panel.dropConfig = dropConfig;

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.update) {
            await element.update.call(panel);
        }
    }
    panel.history && panel.history.snapshot(panel);
};

exports.ready = function ready() {
    const panel = this;
    panel.ready = true;

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.ready) {
            element.ready.call(panel);
        }
    }
};

exports.beforeClose = async function beforeClose() {
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
    } else {
        panel.isDialoging = true;
        const message = Editor.I18n.t(`ENGINE.assets.check_is_saved.assetMessage`).replace('${assetName}', panel.asset.name);
        const warnResult = await Editor.Dialog.warn(message, {
            buttons: [Editor.I18n.t('ENGINE.assets.check_is_saved.abort'), Editor.I18n.t('ENGINE.assets.check_is_saved.save'), 'Cancel'],
            default: 1,
            cancel: 2,
        });

        result = warnResult.response;

        panel.isDialoging = false;
    }

    if (result === 0) {
        // abort
        await panel.abort();
        return true;
    }

    if (result === 1) {
        // save
        await panel.save();
        return true;
    }

    return false;
};

exports.close = async function close() {
    const panel = this;
    panel.ready = false;

    for (const prop in Elements) {
        const element = Elements[prop];
        if (element.close) {
            element.close.call(panel);
        }
    }
};

exports.config = {
    header: require('../assets-header'),
    section: require('../assets'),
    footer: require('../assets-footer'),
};
