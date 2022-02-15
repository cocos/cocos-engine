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
import { ccclass, editable, serializable } from 'cc.decorator';
import {
    _applyDecoratedDescriptor,
    _assertThisInitialized,
    _initializerDefineProperty,
} from '../data/utils/decorator-jsb-utils';
import { legacyCC } from '../global-exports';
import { Enum } from '../value-types';

export const Prefab = jsb.Prefab;
export type Prefab = jsb.Prefab;

const OptimizationPolicy = Enum({
    /**
     * @en The optimization policy is automatically chosen based on the number of instantiations.
     * When you first create an instance, the behavior is the same as SINGLE_INSTANCE.
     * MULTI_INSTANCE will be automatically used after multiple creation.
     * @zh 根据创建次数自动调整优化策略。初次创建实例时，行为等同 SINGLE_INSTANCE，多次创建后将自动采用 MULTI_INSTANCE。
     */
    AUTO: 0,
    /**
     * @en Optimize for single instance creation.<br>
     * This option skips code generation for this prefab.
     * When this prefab will usually create only one instances, please select this option.
     * @zh 优化单次创建性能。<br>
     * 该选项会跳过针对这个 prefab 的代码生成优化操作。当该 prefab 加载后，一般只会创建一个实例时，请选择此项。
     */
    SINGLE_INSTANCE: 1,
    /**
     * @en Optimize for creating instances multiple times.<br>
     * This option enables code generation for this prefab.
     * When this prefab will usually create multiple instances, please select this option.
     * It is also recommended to select this option if the prefab instance in the scene
     * has Auto Sync enabled and there are multiple instances in the scene.
     * @zh 优化多次创建性能。<br>
     * 该选项会启用针对这个 prefab 的代码生成优化操作。当该 prefab 加载后，一般会创建多个实例时，请选择此项。如果该 prefab 在场景中的节点启用了自动关联，并且在场景中有多份实例，也建议选择此项。
     */
    MULTI_INSTANCE: 2,
});

const clsDecorator = ccclass('cc.Prefab');

const prefabProto: any = Prefab.prototype;

const _class2$B = Prefab;
const _descriptor$v = _applyDecoratedDescriptor(_class2$B.prototype, 'data', [serializable, editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return null;
    },
});
const _descriptor2$o = _applyDecoratedDescriptor(_class2$B.prototype, 'optimizationPolicy', [serializable, editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return OptimizationPolicy.AUTO;
    },
});
const _descriptor2$p = _applyDecoratedDescriptor(_class2$B.prototype, 'persistent', [serializable, editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return false;
    },
});

prefabProto._ctor = function () {
    jsb.Asset.prototype._ctor.apply(this, arguments);
    // _initializerDefineProperty(_this, 'data', _descriptor$v, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, 'optimizationPolicy', _descriptor2$o, _assertThisInitialized(_this));
};

clsDecorator(Prefab);

legacyCC.Prefab = Prefab;
