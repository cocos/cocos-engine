import { ccclass, property } from '../../data/class-decorator';
import { ModelComponent } from '../../3d/framework/model-component';
import { IValueProxyFactory } from '../value-proxy';

@ccclass('cc.animation.MorphWeightsValueProxy')
export class MorphWeightsValueProxy implements IValueProxyFactory {
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