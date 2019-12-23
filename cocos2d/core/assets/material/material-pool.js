import utils from './utils';
import Pool from '../../utils/pool';

/**
 * {
 *   effectUuid: {
 *     defineSerializeKey: []
 *   }
 * }
 */
class MaterialPool extends Pool {
    // default disabled material pool
    enabled = false;
    
    _pool = {};

    get (exampleMat, renderComponent) {
        let pool = this._pool;

        if (exampleMat instanceof cc.MaterialVariant) {
            if (exampleMat._owner) {
                if (exampleMat._owner === renderComponent) {
                    return exampleMat;
                }
                else {
                    exampleMat = exampleMat.material;
                }
            }
            else {
                exampleMat._owner = renderComponent;
                return exampleMat;
            }
        }

        let instance;
        if (this.enabled) {
            let uuid = exampleMat.effectAsset._uuid;
            if (pool[uuid]) {
                let key = 
                    utils.serializeDefines(exampleMat._effect._defines) +
                    utils.serializeTechniques(exampleMat._effect._techniques);
                instance = pool[uuid][key] && pool[uuid][key].pop();
            }
        }
    
        if (!instance) {
            instance = new cc.MaterialVariant(exampleMat);
            instance._name = exampleMat._name + ' (Instance)';
            instance._uuid = exampleMat._uuid;
        }
        else {
            this.count--;
        }
    
        instance._owner = renderComponent;
    
        return instance;
    }
    
    put (mat) {
        if (!this.enabled || !mat._owner) {
            return;
        }

        let pool = this._pool;
        let uuid = mat.effectAsset._uuid;
        if (!pool[uuid]) {
            pool[uuid] = {};
        }
        let key = 
            utils.serializeDefines(mat._effect._defines) +
            utils.serializeTechniques(mat._effect._techniques);
        if (!pool[uuid][key]) {
            pool[uuid][key] = [];
        }
        if (this.count > this.maxSize) return;

        this._clean(mat);
        pool[uuid][key].push(mat);
        this.count++;
    }

    clear () {
        this._pool = {};
        this.count = 0;
    }

    _clean (mat) {
        mat._owner = null;
    }
}

let materialPool = new MaterialPool();
Pool.register('material', materialPool);
export default materialPool;
