/**
 * @hidden
 */

import { ccclass, property } from '../../data/class-decorator';
import { ModelComponent } from '../../3d/framework/model-component';
import { IValueProxyFactory } from '../value-proxy';

/**
 * @en
 * Value proxy factory for setting morph weights of specified sub-mesh on model component target.
 * @zh
 * 用于设置模型组件目标上指定子网格形变权重的曲线值代理工厂。
 */
@ccclass('cc.animation.MorphWeightsValueProxy')
export class MorphWeightsValueProxy implements IValueProxyFactory {
    /**
     * @en Sub-mesh index.
     * @zh 子网格索引。
     */
    @property
    public subMeshIndex: number = 0;

    public forTarget (target: ModelComponent) {
        return {
            set: (value: number[]) => {
                target.setWeights(value, this.subMeshIndex);
            },
        };
    }
}

/**
 * @en
 * Value proxy factory for setting morph weights of each sub-mesh on model component target.
 * @zh
 * 用于设置模型组件目标上所有子网格形变权重的曲线值代理工厂。
 */
@ccclass('cc.animation.MorphWeightsAllValueProxy')
export class MorphWeightsAllValueProxy implements IValueProxyFactory {
    public forTarget (target: ModelComponent) {
        return {
            set: (value: number[]) => {
                const nSubMeshes = target.mesh?.struct.primitives.length ?? 0;
                for (let iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
                    target.setWeights(value, iSubMesh);
                }
            },
        };
    }
}