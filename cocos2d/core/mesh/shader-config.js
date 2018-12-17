import { ctor2enums } from '../../renderer/types';
import RecyclePool from '../../renderer/memop/recycle-pool';
import { serializeDefines, serializeUniforms } from '../utils/hash/compute';

let _uniformPool = new RecyclePool(function () {
    return {
        name: '',
        type: -1,
        value: null
    };
}, 1);

export default class ShaderConfig {
    constructor () {
        this._uniforms = {};
        this._defines = {};
        this._hash = '';
    }

    setUniform (name, value) {
        if (!this._uniforms) this._uniforms = {};

        let uniform = this._uniforms[name];
        if (!uniform) {
            uniform = _uniformPool.add();
            uniform.name = name;
            uniform.type = ctor2enums[value.constructor];
            this._uniforms[name] = uniform;
        }
        
        if (uniform.value === value) {
            return;
        }
        uniform.value = value;
        this.updateHash();
    }

    setDefine (name, value) {
        if (!this._defines) this._defines = {};
        if (this._defines[name] === value) return;
        this._defines[name] = value;
        this.updateHash();
    }

    updateHash (val) {
        this._hash = val || serializeDefines(this._defines) + '__ '+ serializeUniforms(this._uniforms);
    }
}
