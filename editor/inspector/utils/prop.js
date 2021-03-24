/* eslint-disable @typescript-eslint/no-unsafe-return */
/*
 * Returns the ordered PropMap
 * @param {*} value of dump
 * @returns {key:string dump:object}[]
 */
exports.sortProp = function (propMap) {
    const orderList = [];
    const normalList = [];

    Object.keys(propMap).forEach((key) => {
        const item = propMap[key];
        if ('displayOrder' in item) {
            orderList.push({
                key,
                dump: item,
            });
        } else {
            normalList.push({
                key,
                dump: item,
            });
        }
    });

    orderList.sort((a, b) => a.dump.displayOrder - b.dump.displayOrder);

    return orderList.concat(normalList);
};

/**
 *
 * This function can filter the contents of the dump and is mainly used to get the user's dump data
 * @param {string[]} excludeList
 * @param {object} dump
 * @param {(element,prop)=>void} onElementCreated
 */
exports.getCustomPropElements = function (excludeList, dump, onElementCreated) {
    const customPropElements = [];
    const sortedProp = exports.sortProp(dump.value);
    sortedProp.forEach((prop) => {
        if (!excludeList.includes(prop.key)) {
            const node = document.createElement('ui-prop');
            node.setAttribute('type', 'dump');
            if (typeof onElementCreated === 'function') {
                onElementCreated(node, prop);
            }
            customPropElements.push(node);
        }
    });
    return customPropElements;
};
