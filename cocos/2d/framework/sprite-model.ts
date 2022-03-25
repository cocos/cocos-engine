import { Sampler } from '../../core/gfx/base/states/sampler';
import { Texture } from '../../core/gfx/base/texture';
import { ModelLocalBindings } from '../../core/pipeline/define';
import { Model } from '../../core/renderer/scene/model';

export class SpriteModel extends Model {
    public updateTexture (texture: Texture, sampler: Sampler) {
        const subModels = this._subModels;
        const binding = ModelLocalBindings.SAMPLER_SPRITE;
        for (let i = 0; i < subModels.length; i++) {
            const { descriptorSet } = subModels[i];
            descriptorSet.bindTexture(binding, texture);
            descriptorSet.bindSampler(binding, sampler);
            descriptorSet.update();
        }
    }
}
