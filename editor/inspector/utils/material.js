'use strict';

/**
 * Pass the data of a pass under a technique and organize it into a tree structure
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
         * USE_INSTANCING and USE_BATCHING are common to every child in passes
         * To make editing easier, they are referred to the outside of the passes
         * At this point, you need to set each of the passes to be non-editable and invisible
         */

        if (hideAttrs.includes(item.name)) {
            item.visible = false;
        }

        if (item.defines && item.defines.length) {
            item.defines.forEach((name) => {

                // The defines starting with ! are reverse dependencies, the data position will not change
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
            case 'Enum': break; // Fix the problem that item.type === 'Enum' is reset to 'ui.Depend'
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
};

exports.materialTechniquePolyfill = function(origin) {
    let useInstancing;
    let useBatching;
    const passes = origin.passes.map((data, index) => {
        // Merge data.defines and data.props
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
     * USE_INSTANCING and USE_BATCHING are common to every child in passes
     * For ease of editing, they are referred to outside of the passes
     * Two external variables useInstancing, useBatching are provided to dock
     * The value of the first pass takes precedence
     */
    const technique = {
        name: origin.name,
        passes,
        useInstancing,
        useBatching,
    };

    return technique;
};
