/*
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * @packageDocumentation
 * @module material
 */
import { EffectAsset } from './effect-asset';
import { Texture } from '../gfx';
import { TextureBase } from './texture-base';
import { legacyCC } from '../global-exports';
import { PassOverrides, MacroRecord, MaterialProperty } from '../renderer';

import { Color, Mat3, Mat4, Quat, Vec2, Vec3, Vec4 } from '../math';
import { setClassName } from '../utils/js-typed';
import { _applyDecoratedDescriptor, _assertThisInitialized, _initializerDefineProperty } from '../data/utils/decorator-jsb-utils';
import { ccclass, serializable, type } from '../data/decorators';

/**
 * @en The basic infos for material initialization.
 * @zh 用来初始化材质的基本信息。
 */
interface IMaterialInfo {
    /**
     * @en The EffectAsset to use. Must provide if `effectName` is not specified.
     * @zh
     * 这个材质将使用的 EffectAsset，直接提供资源引用，和 `effectName` 至少要指定一个。
     */
    effectAsset?: EffectAsset | null;
    /**
     * @en
     * The name of the EffectAsset to use. Must provide if `effectAsset` is not specified.
     * @zh
     * 这个材质将使用的 EffectAsset，通过 effect 名指定，和 `effectAsset` 至少要指定一个。
     */
    effectName?: string;
    /**
     * @en
     * The index of the technique to use.
     * @zh
     * 这个材质将使用第几个 technique，默认为 0。
     */
    technique?: number;
    /**
     * @en
     * The shader macro definitions. Default to 0 or the specified value in [[EffectAsset]].
     * @zh
     * 这个材质定义的预处理宏，默认全为 0，或 [[EffectAsset]] 中的指定值。
     */
    defines?: MacroRecord | MacroRecord[];
    /**
     * @en
     * The override values on top of the pipeline states specified in [[EffectAsset]].
     * @zh
     * 这个材质的自定义管线状态，将覆盖 effect 中的属性。<br>
     * 注意在可能的情况下请尽量少的自定义管线状态，以减小对渲染效率的影响。
     */
    states?: PassOverrides | PassOverrides[];
}

type MaterialPropertyFull = MaterialProperty | TextureBase | Texture | null;

const matProto: any = jsb.Material.prototype;

type setProperyCB = (name: string, val: MaterialPropertyFull | MaterialPropertyFull[], passIdx?: number) => void;
function wrapSetProperty (cb: setProperyCB, target: Material, name: string, val: MaterialPropertyFull | MaterialPropertyFull[], passIdx?: number) {
    if (passIdx) {
        cb.call(target, name, val, passIdx);
    } else {
        cb.call(target, name, val);
    }
}

matProto.setProperty = function (name: string, val: MaterialPropertyFull | MaterialPropertyFull[], passIdx?: number) {
    if (Array.isArray(val)) {
        const first = val[0];
        if (typeof first === 'number') {
            if (Number.isInteger(first)) {
                wrapSetProperty(this.setPropertyInt32Array, this, name, val, passIdx);
            } else {
                wrapSetProperty(this.setPropertyFloat32Array, this, name, val, passIdx);
            }
        } else if (first instanceof Vec2) {
            wrapSetProperty(this.setPropertyVec2Array, this, name, val, passIdx);
        } else if (first instanceof Vec3) {
            wrapSetProperty(this.setPropertyVec3Array, this, name, val, passIdx);
        } else if (first instanceof Vec4) {
            wrapSetProperty(this.setPropertyVec4Array, this, name, val, passIdx);
        } else if (first instanceof Color) {
            wrapSetProperty(this.setPropertyColorArray, this, name, val, passIdx);
        } else if (first instanceof Mat3) {
            wrapSetProperty(this.setPropertyMat3Array, this, name, val, passIdx);
        } else if (first instanceof Mat4) {
            wrapSetProperty(this.setPropertyMat4Array, this, name, val, passIdx);
        } else if (first instanceof Quat) {
            wrapSetProperty(this.setPropertyQuatArray, this, name, val, passIdx);
        } else if (first instanceof TextureBase) {
            wrapSetProperty(this.setPropertyTextureBaseArray, this, name, val, passIdx);
        } else if (first instanceof Texture) {
            wrapSetProperty(this.setPropertyGFXTextureArray, this, name, val, passIdx);
        } else {
            legacyCC.error(`Material.setProperty Unknown type: ${val}`);
        }
    } else if (typeof val === 'number') {
        if (Number.isInteger(val)) {
            wrapSetProperty(this.setPropertyInt32, this, name, val, passIdx);
        } else {
            wrapSetProperty(this.setPropertyFloat32, this, name, val, passIdx);
        }
    } else if (val instanceof Vec2) {
        wrapSetProperty(this.setPropertyVec2, this, name, val, passIdx);
    } else if (val instanceof Vec3) {
        wrapSetProperty(this.setPropertyVec3, this, name, val, passIdx);
    } else if (val instanceof Vec4) {
        wrapSetProperty(this.setPropertyVec4, this, name, val, passIdx);
    } else if (val instanceof Color) {
        wrapSetProperty(this.setPropertyColor, this, name, val, passIdx);
    } else if (val instanceof Mat3) {
        wrapSetProperty(this.setPropertyMat3, this, name, val, passIdx);
    } else if (val instanceof Mat4) {
        wrapSetProperty(this.setPropertyMat4, this, name, val, passIdx);
    } else if (val instanceof Quat) {
        wrapSetProperty(this.setPropertyQuat, this, name, val, passIdx);
    } else if (val instanceof TextureBase) {
        wrapSetProperty(this.setPropertyTextureBase, this, name, val, passIdx);
    } else if (val instanceof Texture) {
        wrapSetProperty(this.setPropertyGFXTexture, this, name, val, passIdx);
    } else {
        legacyCC.error(`Material.setProperty Unknown type: ${val}`);
    }
};

matProto.getProperty = function (name: string, passIdx?: number) {
    const val = this._getProperty(name, passIdx);
    if (Array.isArray(val)) {
        const first = val[0];
        const arr = []; // cjh TODO: optimize temporary gc objects being created
        if (first instanceof Vec2) {
            for (let i = 0, len = val.length; i < len; ++i) {
                const e = val[i];
                arr.push(new Vec2(e.x, e.y));
            }
        } else if (first instanceof Vec3) {
            for (let i = 0, len = val.length; i < len; ++i) {
                const e = val[i];
                arr.push(new Vec3(e.x, e.y, e.z));
            }
        } else if (first instanceof Vec4) {
            for (let i = 0, len = val.length; i < len; ++i) {
                const e = val[i];
                arr.push(new Vec4(e.x, e.y, e.z, e.w));
            }
        } else if (first instanceof Color) {
            for (let i = 0, len = val.length; i < len; ++i) {
                const e = val[i];
                arr.push(new Color(e.r, e.g, e.b, e.a));
            }
        } else if (first instanceof Mat3) {
            for (let i = 0, len = val.length; i < len; ++i) {
                const e = val[i];
                arr.push(new Mat3(
                    e[0], e[1], e[2],
                    e[3], e[4], e[5],
                    e[6], e[7], e[8],
                ));
            }
        } else if (first instanceof Mat4) {
            for (let i = 0, len = val.length; i < len; ++i) {
                const e = val[i];
                arr.push(new Mat4(
                    e[0], e[1], e[2], e[3],
                    e[4], e[5], e[6], e[7],
                    e[8], e[9], e[10], e[11],
                    e[12], e[13], e[14], e[15],
                ));
            }
        } else if (first instanceof Quat) {
            for (let i = 0, len = val.length; i < len; ++i) {
                const e = val[i];
                arr.push(new Quat(e.x, e.y, e.z, e.w));
            }
        }

        return arr || val;
    }

    let ret;
    const e = val;
    if (val instanceof Vec2) {
        ret = new Vec3(e.x, e.y);
    } else if (val instanceof Vec3) {
        ret = new Vec3(e.x, e.y, e.z);
    } else if (val instanceof Vec4) {
        ret = new Vec4(e.x, e.y, e.z, e.w);
    } else if (val instanceof Color) {
        ret = new Color(e.r, e.g, e.b, e.a);
    } else if (val instanceof Mat3) {
        ret = new Mat3(
            e[0], e[1], e[2],
            e[3], e[4], e[5],
            e[6], e[7], e[8],
        );
    } else if (val instanceof Mat4) {
        ret = new Mat4(
            e[0], e[1], e[2], e[3],
            e[4], e[5], e[6], e[7],
            e[8], e[9], e[10], e[11],
            e[12], e[13], e[14], e[15],
        );
    } else if (val instanceof Quat) {
        ret = new Quat(e.x, e.y, e.z, e.w);
    }

    return ret || val;
};

export type Material = jsb.Material;
export const Material = jsb.Material;
legacyCC.Material = Material;

const materialProto: any = Material.prototype;

const clsDecorator = ccclass('cc.Material');

// Deserialization
const _class2$f = Material;
const _dec2$7 = type(EffectAsset);
const _descriptor$d = _applyDecoratedDescriptor(_class2$f.prototype, '_effectAsset', [_dec2$7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return null;
    },
});

const _descriptor2$9 = _applyDecoratedDescriptor(_class2$f.prototype, '_techIdx', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 0;
    },
});

const _descriptor3$7 = _applyDecoratedDescriptor(_class2$f.prototype, '_defines', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return [];
    },
});
const _descriptor4$6 = _applyDecoratedDescriptor(_class2$f.prototype, '_states', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return [];
    },
});
const _descriptor5$4 = _applyDecoratedDescriptor(_class2$f.prototype, '_props', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return [];
    },
});

materialProto._ctor = function () {
    this._props = {};
    // _initializerDefineProperty(_this, "_effectAsset", _descriptor$d, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, "_techIdx", _descriptor2$9, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, "_defines", _descriptor3$7, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, "_states", _descriptor4$6, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, "_props", _descriptor5$4, _assertThisInitialized(_this));
};

const oldOnLoaded = materialProto.onLoaded;
materialProto.onLoaded = function () {
    this._propsInternal = this._props;
    oldOnLoaded.call(this);
};

clsDecorator(Material);
