import { EffectAsset } from '../../assets';
import { DescriptorHierarchy } from './pipeline';

export class WebDescriptorHierarchy extends DescriptorHierarchy {
    constructor () {
        super();
    }
    public addEffect (asset: EffectAsset): void {
        const sz = asset.shaders.length;
        for (let i = 0; i !== sz; ++i) {
            const shader = asset.shaders[i];
        }
    }
}
