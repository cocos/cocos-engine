module.exports.mixin = function(result, ...args) {
    for (const arg of args) {
        mixinObject(result, arg);
    }
    return result;
};

module.exports.link = function(root) {
    const visited = new Set();

    link(root);

    return root;

    function link(o) {
        if (visited.has(o)) {
            return;
        }
        visited.add(o);

        const __extends__ = o.__extends__;
        const extended = {};
        if (typeof __extends__ === 'string') {
            const base = find(__extends__);
            if (!base) {
                console.error(`Can not find the __extends__ ${__extends__}`);
            } else {
                link(base);
                mixinObject(extended, base);
            }
        }

        for (const [k, v] of Object.entries(o)) {
            if (typeof v === 'object' && v) {
                link(v);
            }
        }

        mixinObject(o, extended);
    }

    function find(path) {
        const items = path.split('.');
        if (items.length === 0) {
            return undefined;
        }
        let result = root;
        for (const item of items) {
            if (!item) {
                return undefined;
            }
            if (!(item in result)) {
                return undefined;
            }
            const r = result[item];
            if (typeof r !== 'object' || !r) {
                return undefined;
            }
            result = r;
        }
        return result;
    }
};

function mixinObject(o1, o2, o1FullPath, o2FullPath) {
    for (const [k, v2] of Object.entries(o2)) {
        if (typeof v2 !== 'object' || !v2) {
            if (k in o1) {
                reportMixinFailure(k);
            } else {
                o1[k] = v2;
            }
            continue;
        }

        if (Array.isArray(v2)) {
            let v1;
            if (!(k in o1)) {
                v1 = o1[k] = [];
            } else if (Array.isArray(o1[k])) {
                v1 = o1[k];
            } else {
                reportMixinFailure(k);
                continue;
            }
            v1.push(...v2);
            continue;
        }

        // v2 is object
        {
            let v1;
            if (!(k in o1)) {
                v1 = o1[k] = {};
            } else {
                v1 = o1[k];
                if (typeof v1 !== 'object' || !v1) {
                    reportMixinFailure(k);
                    continue;
                }
            }
            mixinObject(v1, v2, getFullPath(o1FullPath, k), getFullPath(o2FullPath, k));
            continue;
        }
    }

    function reportMixinFailure(k) {
        console.error(
            `Can not mix `
            + `${getFullPath(o2FullPath, k)}(type: ${getLogType(o2[k])}) `
            + `into `
            + `${getFullPath(o1FullPath, k)}(type: ${getLogType(o1[k])})`
        );
    }

    function getFullPath(prefix, k) {
        return `${prefix}['${k}']`;
    }

    function getLogType(v) {
        if (typeof v !== 'object') {
            return typeof v;
        } else if (!v) {
            return 'null';
        } else if (Array.isArray(v)) {
            return 'array';
        } else {
            return 'object';
        }
    }
}
