import { Enum, cclegacy } from '../../core';
import { PostSettingsInfo } from '../../scene-graph/scene-globals';

export const ToneMappingType = Enum({
    DEFAULT: 0,
    LINEAR: 1,
});

export  class PostSettings {
    protected _toneMappingType = ToneMappingType.DEFAULT;
    protected _activated = false;

    set toneMappingType (val) {
        this._toneMappingType = val;
        this._updatePipeline();
    }
    get toneMappingType (): number {
        return this._toneMappingType;
    }
    public initialize (postSettingsInfo: PostSettingsInfo): void {
        this._toneMappingType = postSettingsInfo.toneMappingType;
    }

    public activate (): void {
        this._updatePipeline();
        this._activated = true;
    }

    protected _updatePipeline (): void {
        const root = cclegacy.director.root;
        const pipeline = root.pipeline;
        pipeline.macros.CC_TONE_MAPPING_TYPE = this._toneMappingType;
        if (this._activated) {
            root.onGlobalPipelineStateChanged();
        }
    }
}
