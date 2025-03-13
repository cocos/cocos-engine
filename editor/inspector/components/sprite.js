const { template, $, update, close } = require('./base');

exports.template = template;
exports.$ = $;
exports.update = update;
exports.close = close;

const { setHidden, setReadonly, isMultipleInvalid } = require('../utils/prop');

// Query an automatic atlas
async function findAutoAtlasFolder(spriteFrameUuid) {
    // auto atlas
    const info = await Editor.Message.request('builder', 'request-to-build-worker', 'build-worker:query-atlas-by-sprite', spriteFrameUuid);
    return info && info.uuid;
}

// query the dom node by type
function findDomByType(parentElement, type) {
    for (const child of parentElement.children) {
        if (child.dump.type === type) {
            return child;
        }
    }
    return null;
}

exports.ready = function() {
    this.elements = {
        fillType: {
            update(element, dump) {
                setHidden(isMultipleInvalid(dump.type) || dump.type.value !== 3, element);
            },
        },
        fillCenter: {
            update(element, dump) {
                this.elements.fillType.update.call(this, element, dump);
                setReadonly(dump.fillType.value !== 2, element);
            },
        },
        fillStart: {
            update(element, dump) {
                this.elements.fillType.update.call(this, element, dump);
            },
        },
        fillRange: {
            update(element, dump) {
                this.elements.fillType.update.call(this, element, dump);
            },
        },
        spriteFrame: {
            updateAtlas(spriteFrameUuid, parentElement) {
                if (!spriteFrameUuid || !parentElement) { return; }

                Editor.Message.request('asset-db', 'query-asset-meta', spriteFrameUuid)
                    .then(async (spriteFrameMeta) => {
                        if (!spriteFrameMeta || !spriteFrameMeta.userData) { return; }

                        let autoAtlasUuid = '';
                        if (!spriteFrameMeta.userData.atlasUuid) {
                            autoAtlasUuid = await findAutoAtlasFolder(spriteFrameUuid);
                        }

                        const spriteAtlasDom = findDomByType(parentElement, 'cc.SpriteAtlas');
                        if (!spriteAtlasDom) { return; }

                        spriteAtlasDom.value = spriteFrameMeta.userData.atlasUuid || autoAtlasUuid;
                        spriteAtlasDom.dispatch('change');
                        spriteAtlasDom.dispatch('confirm');
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            ready(element, dump) {
                element.addEventListener('change-dump', (event) => {
                    const spriteFrameDump = event.target.dump;
                    const spriteFrameUuid = spriteFrameDump.value.uuid;
                    if (!spriteFrameUuid) { return; }

                    this.elements.spriteFrame.updateAtlas(spriteFrameUuid, event.target.parentElement);
                });
            },
        },
    };
};
