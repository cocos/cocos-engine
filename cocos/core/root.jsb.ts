import { Pool } from './memop';
import { warnID } from './platform';
import { Batcher2D } from '../2d/renderer/batcher-2d';
import legacyCC from '../../predefine';
import { DataPoolManager } from '../3d/skeletal-animation/data-pool-manager';
import { Device } from './gfx';
import { builtinResMgr } from './builtin';

export const Root = jsb.Root;

enum LightType {
    DIRECTIONAL,
    SPHERE,
    SPOT,
    UNKNOWN,
}

/**
 * @zh
 * Root描述信息
 */
export interface IRootInfo {
    enableHDR?: boolean;
}

const rootProto: any = Root.prototype;

Object.defineProperty(rootProto, 'batcher2D', {
    configurable: true,
    enumerable: true,
    get () : Batcher2D {
        return this._batcher;
    },
});

Object.defineProperty(rootProto, 'dataPoolManager', {
    configurable: true,
    enumerable: true,
    get () : DataPoolManager {
        return this._dataPoolMgr;
    },
});

rootProto._ctor = function (device: Device) {
    this._dataPoolMgr = legacyCC.internal.DataPoolManager && new legacyCC.internal.DataPoolManager(device) as DataPoolManager;
    this._modelPools = new Map();
    this._lightPools = new Map();
    this._batcher = null;
    this._registerListeners();
};

rootProto.initialize = function (info: IRootInfo) {
    // TODO:
    this._initialize();
    return Promise.resolve(builtinResMgr.initBuiltinRes(this.device)).then(() => {
        legacyCC.view.on('design-resolution-changed', () => {
            const width = legacyCC.game.canvas.width;
            const height = legacyCC.game.canvas.height;
            this.resize(width, height);
        }, this);
    });
};

rootProto.createModel = function (ModelCtor) {
    let p = this._modelPools.get(ModelCtor);
    if (!p) {
        this._modelPools.set(ModelCtor, new Pool(() => new ModelCtor(), 10));
        p = this._modelPools.get(ModelCtor)!;
    }
    const model = p.alloc();
    model.initialize();
    return model;
};

rootProto.removeModel = function (m) {
    const p = this._modelPools.get(m.constructor);
    if (p) {
        p.free(m);
        m.destroy();
        if (m.scene) {
            m.scene.removeModel(m);
        }
    } else {
        warnID(1300, m.constructor.name);
    }
};

rootProto.createLight = function (LightCtor) {
    let l = this._lightPools.get(LightCtor);
    if (!l) {
        this._lightPools.set(LightCtor, new Pool(() => new LightCtor(), 4));
        l = this._lightPools.get(LightCtor)!;
    }
    const light = l.alloc();
    light.initialize();
    return light;
};

rootProto.destroyLight = function (l) {
    const p = this._lightPools.get(l.constructor);
    l.destroy();
    if (p) {
        p.free(l);
        if (l.scene) {
            switch (l.type) {
            case LightType.SPHERE:
                l.scene.removeSphereLight(l);
                break;
            case LightType.SPOT:
                l.scene.removeSpotLight(l);
                break;
            default:
                break;
            }
        }
    }
};

rootProto._onBatch2DInit = function () {
    if (!this._batcher && legacyCC.internal.Batcher2D) {
        this._batcher = new legacyCC.internal.Batcher2D(this) as Batcher2D;
        if (!this._batcher.initialize()) {
            this.destroy();
            return false;
        }
    }
};

rootProto._onBatch2DUpdate = function () {
    if (this._batcher) this._batcher.update();
};

rootProto._onBatch2DUploadBuffers = function () {
    if (this._batcher) this._batcher.uploadBuffers();
};

rootProto._onBatch2DReset = function () {
    if (this._batcher) this._batcher.reset();
};

const oldFrameMove = rootProto.frameMove;
rootProto.frameMove = function (deltaTime: number) {
    oldFrameMove.call(this, deltaTime, legacyCC.director.getTotalFrames());
};
