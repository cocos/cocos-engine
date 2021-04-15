'use strict';

/**
 * 传入一个 technique 下的某个 pass 数据，整理成树形结构
 * @param passData
 */
exports.buildEffect = function(index, passData) {

    const props = passData.props;
    const defs = passData.defines;

    const tree = {
        name: `Pass ${index}`,
        type: 'cc.Object',
        childMap: {},
    };

    const hideAttrs = ['USE_INSTANCING', 'USE_BATCHING'];

    function encode(item) {
        let current = tree;

        /**
         * USE_INSTANCING 和 USE_BATCHING 是 passes 中每个子项所共用的
         * 为了方便编辑，将它们提到 passes 的外部
         * 此时需要把 passes 中逐个设置为不可编辑，设置为不可见
         */

        if (hideAttrs.includes(item.name)) {
            item.visible = false;
        }

        if (item.defines && item.defines.length) {
            item.defines.forEach((name) => {

                // defines中以 ! 开头的是反向依赖，数据位置不会变动
                if (name.startsWith('!')) {
                    return;
                }

                let child = current.childMap[name];
                if (!child) {
                    child = current.childMap[name] = {
                        name,
                        // type: 'ui.Depend',
                        type: 'Boolean',
                        childMap: {},
                    };
                }
                current = child;
            });
        }

        if (current.childMap[item.name]) {
            const tempChildMap = current.childMap[item.name].childMap;
            current.childMap[item.name] = item;
            item.childMap = tempChildMap;
        } else {
            current.childMap[item.name] = item;
            item.childMap = {};
        }
        current.childMap[item.name].name = item.name;
    }

    defs.forEach((item) => {
        switch (item.type) {
            case 'Number':
                item.type = 'Enum';
                item.enumList = [];
                for (let i = item.range[0]; i <= item.range[1]; i++) {
                    item.enumList.push({
                        name: i,
                        value: i,
                    });
                }
                break;
            case 'String':
                item.type = 'Enum';
                item.enumList = item.options.map((str) => {
                    return {
                        name: str,
                        value: str,
                    };
                });
                break;
            case 'Enum': break; // 修复 item.type === 'Enum' 时被重置为 'ui.Depend' 的问题
            default:
                // item.type = 'ui.Depend';
                item.type = 'Boolean';
        }
        encode(item);
    });
    props.forEach(encode);

    function encodeStates(item) {
        let current = tree;
        if (current.childMap[item.name]) {
            const tempChildMap = current.childMap[item.name].childMap;
            current.childMap[item.name] = item;
            item.childMap = tempChildMap;
        } else {
            current.childMap[item.name] = item;
            item.childMap = {};
        }

        if (item.isObject && item.value) {
            current = current.childMap[item.name];
            Object.keys(item.value).forEach((name) => {
                let child = current.childMap[name];
                if (!child) {
                    child = current.childMap[name] = {
                        name,
                        type: 'cc.Object',
                        childMap: {},
                    };
                }
            });
        }
    }

    function modifyType(item) {
        if (!item) {
            return;
        }

        if (item.isObject) {
            Object.keys(item.value).forEach((key) => {
                modifyType(item.value[key]);
            });
        } else if (item.isArray) {
            item.value.forEach((data) => {
                modifyType(data);
            });

            modifyType(item.elementTypeData);
        } else {
            switch (item.type) {
                case 'Number':
                    if (item.isEnum) {
                        item.type = 'Enum';
                        item.enumList = [];
                        Object.keys(item.enumData).forEach((key) => {
                            item.enumList.push({
                                name: key,
                                value: item.enumData[key],
                            });
                        });
                    }
                    break;
            }
        }
    }

    modifyType(passData.states);
    encodeStates(passData.states);

    function translate(item) {
        const children = Object.keys(item.childMap).map((name) => {
            const child = item.childMap[name];
            translate(child);
            return child;
        });
        if (item) {
            item.children = children;
        }
        return item;
    }
    const dump = translate(tree);
    dump.value = tree.childMap;
    return dump;
}

exports.materialTechniquePolyfill = function(origin) {
    let useInstancing;
    let useBatching;
    const passes = origin.passes.map((data, index) => {
        // 合并 data.defines 和 data.props
        const pass = exports.buildEffect(index, data);
        pass.switch = data.switch;
        pass.propertyIndex = data.propertyIndex;

        if (!useInstancing && pass.childMap.USE_INSTANCING) {
            useInstancing = JSON.parse(JSON.stringify(pass.childMap.USE_INSTANCING));
            useInstancing.visible = true;
        }

        if (!useBatching && pass.childMap.USE_BATCHING) {
            useBatching = JSON.parse(JSON.stringify(pass.childMap.USE_BATCHING));
            useBatching.visible = true;
        }

        return pass;
    });

    /**
     * USE_INSTANCING 和 USE_BATCHING 是 passes 中每个子项所共用的
     * 为了方便编辑，将它们提到 passes 的外部
     * 外部提供两个变量 useInstancing, useBatching 来对接
     * 以第一个 pass 的值为准
     */
    const technique = {
        name: origin.name,
        passes,
        useInstancing,
        useBatching,
    };

    return technique;
}
