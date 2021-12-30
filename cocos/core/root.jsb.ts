import { Pool } from './memop';
import { warnID } from './platform';
import { IBatcher } from '../2d/renderer/i-batcher';
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
    get(): IBatcher {
        return this._batcher;
    },
});

Object.defineProperty(rootProto, 'dataPoolManager', {
    configurable: true,
    enumerable: true,
    get(): DataPoolManager {
        return this._dataPoolMgr;
    },
});

rootProto._ctor = function (device: Device) {
    this._device = device;
    this._dataPoolMgr = legacyCC.internal.DataPoolManager && new legacyCC.internal.DataPoolManager(device) as DataPoolManager;
    this._modelPools = new Map();
    this._lightPools = new Map();
    this._batcher = null;
    this._registerListeners();
};

rootProto.initialize = function (info: IRootInfo) {
    // TODO:
    this._initialize(legacyCC.game._swapchain);
    return Promise.resolve(builtinResMgr.initBuiltinRes(this._device));
};

rootProto.createModel = function (ModelCtor) {
    let p = this._modelPools.get(ModelCtor);
    if (!p) {
        this._modelPools.set(ModelCtor, new Pool(() => new ModelCtor(), 10, (obj) => obj.destroy()));
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
        this._lightPools.set(LightCtor, new Pool(() => new LightCtor(), 4, (obj) => obj.destroy()));
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
        this._batcher = new legacyCC.internal.Batcher2D(this) as IBatcher;
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

rootProto._onDirectorBeforeCommit = function () {
    legacyCC.director.emit(legacyCC.Director.EVENT_BEFORE_COMMIT);
};

const oldFrameMove = rootProto.frameMove;
rootProto.frameMove = function (deltaTime: number) {
    oldFrameMove.call(this, deltaTime, legacyCC.director.getTotalFrames());
};

const oldSetPipeline = rootProto.setRenderPipeline;
rootProto.setRenderPipeline = function (pipeline) {
    if (!pipeline) {
        // pipeline should not be created in C++, ._ctor need to be triggered
        pipeline = new nr.ForwardPipeline();
        pipeline.initialize({});
    }
    return oldSetPipeline.call(this, pipeline);
}