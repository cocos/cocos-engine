import { ctor2enums } from '../../renderer/types';
import RecyclePool from '../../renderer/memop/recycle-pool';

let _uniformPool = new RecyclePool(function () {
    return {
        name: '',
        type: -1,
        value: null
    };
}, 1);

export default class ShaderConfig {
    constructor () {
        this._uniforms = null;
        this._defines = null;
    }

    setUniform (name, value) {
        if (!this._uniforms) this._uniforms = {};

        let uniform = this._uniforms[name];
        if (!uniform) {
            uniform = _uniformPool.add();
            this._uniforms[name] = uniform;
        }

        uniform.name = name;
        uniform.type = ctor2enums[value.constructor];
        uniform.value = value;
    }

    setDefine (name, value) {
        if (!this._defines) this._defines = {};
        this._defines[name] = value;
    }
}
