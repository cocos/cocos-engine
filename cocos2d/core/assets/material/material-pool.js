
import utils from './utils';

let _pool = {};

export function getMaterial (exampleMat, renderComponent) {
    let instance;
    let uuid = exampleMat.effectAsset._uuid;
    if (_pool[uuid]) {
        let key = utils.serializeDefines(exampleMat._effect._defines);
        instance = _pool[uuid][key] && _pool[uuid][key].pop();
    }

    if (!instance) {
        instance = new cc.Material();
        instance.copy(exampleMat);
        instance._name = exampleMat._name + ' (Instance)';
        instance._uuid = exampleMat._uuid;
    }

    instance._owner = renderComponent;

    return instance;
}

export function putMaterial (mat) {
    let uuid = mat.effectAsset._uuid;
    if (!_pool[uuid]) {
        _pool[uuid] = {};
    }
    let key = utils.serializeDefines(mat._effect._defines);
    if (!_pool[uuid][key]) {
        _pool[uuid][key] = [];
    }
    _pool[uuid][key].push(mat);
}

export function clear () {
    _pool = {};
}
