import murmurhash2 from '../../../renderer/murmurhash2_gc';
import utils from './utils';

export default class CustomProperties {
    constructor () {
        this._properties = {};
        this._defines = {};
        this._dirty = false;
    }

    setProperty (name, value, type, directly) {
        let uniform = this._properties[name];
        if (!uniform) {
            uniform = Object.create(null);
            uniform.name = name;
            uniform.type = type
            uniform.directly = directly;
            this._properties[name] = uniform;
        }
        else if (uniform.value === value) return;
        
        this._dirty = true;
        uniform.directly = directly;
        uniform.value = value;
    }

    getProperty(name) {
        let prop = this._properties[name];
        if (prop) return prop.value;
        return null;
    }

    define (name, value) {
        if (this._defines[name] === value) return;
        this._dirty = true;
        this._defines[name] = value;
    }

    getDefine (name) {
        return this._defines[name];
    }

    extractProperties(out = {}) {
        Object.assign(out, this._properties);
        return out;
    }

    extractDefines(out = {}) {
        Object.assign(out, this._defines);
        return out;
    }

    getHash () {
        if (!this._dirty) return this._hash;
        this._dirty = false;
        
        let hash = '';
        hash += utils.serializeDefines(this._defines);
        hash += utils.serializeUniforms(this._properties);

        return this._hash = murmurhash2(hash, 666);
    }
}

cc.CustomProperties = CustomProperties;
