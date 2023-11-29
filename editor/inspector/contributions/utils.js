'use strict';
function translate(dump, path, dumps, assets, ignoreCollectAssets) {
    const type = typeof dump;
    if (!dump || type !== 'object') {
        return;
    }
    if (Array.isArray(dump)) {
        dump.forEach((item, index) => {
            if (item === null || item === undefined) {
                console.warn(`data in node dump (${path} ${index}) is ${item}!`);
                return;
            }
            if (typeof item === 'object') {
                item.name = `[${index}]`;
                item.path = `${path}.${index}`;
                let values;
                if (dumps) {
                    values = dumps.map((dump) => {
                        if (dump[index]) {
                            return dump[index].value;
                        }
                    });
                    // 仅当存在 value 数据时才添加 values
                    item.values = values;
                }
                collectAssets(item, assets, ignoreCollectAssets);
                translate(item.value, item.path, values, assets, ignoreCollectAssets);
                // 如果是数组，内部元素不需要显示 displayName
                delete item.displayName;
            }
        });
        return;
    }

    for (const name of Object.keys(dump)) {
        const item = dump[name];
        if (item === null || item === undefined) {
            console.warn(`data in node dump (${path} ${name}) is ${item}!`);
            continue;
        }
        if (typeof item === 'object') {
            item.name = name;
            item.path = `${path}.${name}`;

            // Once parent data has visible = false，itself and children do not collect Assets any more.
            let ignoreCollect = false;
            if (ignoreCollectAssets) {
                ignoreCollect = ignoreCollectAssets;
            } else {
                ignoreCollect = !item.visible;
            }

            collectAssets(item, assets, ignoreCollect);
            collectGroups(item);
            let values;
            if (dumps) {
                try {
                    values = dumps.map((dump) => {
                        if (dump[name]) {
                            return dump[name].value;
                        }
                    });
                    // When merging dumps, as long as there is a value of readonly is ture, it must be set to true
                    const readonly = dumps.some(dump => {
                        if (dump[name]) {
                            return dump[name].readonly;
                        }
                        return false;
                    });
                    item.readonly = readonly;
                    // 仅当存在 value 数据时才添加 values
                    item.values = values;
                } catch (error) {
                    values = undefined;
                }
            }

            translate(item.value, item.path, values, assets, ignoreCollect);
        }
    }
}
/**
 * 收集节点内的资源
 * @param item
 * @param assets
 */
function collectAssets(dump, assets, ignore) {
    if (!ignore && Array.isArray(dump.extends) && dump.value && dump.value.uuid) {
        if (dump.extends.includes('cc.Asset')) {
            if (!assets[dump.type]) {
                assets[dump.type] = {};
            }
            if (assets[dump.type][dump.value.uuid] === undefined) {
                assets[dump.type][dump.value.uuid] = {};
            }
            // assets[dump.type][dump.value.uuid] 的 keys length 大于 0 是指里面多次使用
            assets[dump.type][dump.value.uuid][dump.path] = dump;
        }
    }
}
function collectGroups(dump) {
    if (!dump || !dump.value || typeof dump.value !== 'object') {
        return;
    }
    if (!dump.groups) {
        dump.groups = {};
    }

    for (const name in dump.value) {
        const info = dump.value[name];
        if (!info) {
            continue;
        }

        if (!info.group) {
            if (info.isArray && Array.isArray(info.value)) {
                info.value.forEach((item) => {
                    collectGroups(item);
                });
            }
            continue;
        }

        if (typeof info.group !== 'object') {
            info.group = {
                id: 'default',
                name: info.group,
            };
        }
        const key = info.group.id || 'default';
        if (!dump.groups[key]) {
            dump.groups[key] = {
                displayOrder: Infinity,
                style: 'tab',
            };
        }
        const clone = JSON.parse(JSON.stringify(info.group));
        delete clone.id;
        delete clone.name;
        Object.assign(dump.groups[key], clone);
    }
}
/**
 * 填充 dump 数据内缺失的数据
 * @param dump
 * @param dumps
 * @param assets 收集节点内的资源
 */
function translationDump(dump, dumps, assets) {
    dump.active.path = 'active';
    dump.name.path = 'name';
    if (dump.isScene) {
        // 场景节点的数据结构不同，不能多选
        return translationSceneDump(dump, dumps, assets);
    }
    dump.position.path = 'position';
    dump.rotation.path = 'rotation';
    dump.scale.path = 'scale';
    dump.mobility.path = 'mobility';
    dump.layer.path = 'layer';
    if (dumps) {
        dump.active.values = dumps.map((dump) => dump.active.value);
        dump.name.values = dumps.map((dump) => dump.name.value);
        dump.position.values = dumps.map((dump) => dump.position.value);
        dump.rotation.values = dumps.map((dump) => dump.rotation.value);
        dump.scale.values = dumps.map((dump) => dump.scale.value);
        dump.mobility.values = dumps.map((dump) => dump.mobility.value);
        dump.layer.values = dumps.map((dump) => dump.layer.value);
    }
    for (let i = 0; i < dump.__comps__.length; i++) {
        const component = dump.__comps__[i];
        component.path = `__comps__.${i}`;
        const allow = dumps ? dumps.every((dump) => dump.__comps__[i] && dump.__comps__[i].type === component.type) : true;
        if (allow) {
            collectGroups(component);
            translate(component.value, component.path, dumps ? dumps.map((dump) => dump.__comps__[i].value) : undefined, assets);
        } else {
            break;
        }
    }
    return dump;
}
function translationSceneDump(dump, dumps, assets) {
    dump.autoReleaseAssets.path = 'autoReleaseAssets';
    Object.keys(dump._globals).forEach((key) => {
        const property = dump._globals[key];
        property.name = property.type;
        property.path = `_globals.${key}`;
        translate(property.value, property.path, dumps ? dumps.map((dump) => dump._globals[key].value) : undefined, assets);
    });
}

exports.translationDump = translationDump;

