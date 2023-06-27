import { Enum, cclegacy } from '../../core';
import { ToneMappingInfo } from '../../scene-graph/scene-globals';

export const ToneMappingType = Enum({
    DEFAULT: 0,
    LINEAR: 1,
});
export  class ToneMapping {
    protected _toneMappingType = ToneMappingType.DEFAULT;
    protected _activated = false;

    set toneMappingType (val) {
        this._toneMappingType = val;
        this._updatePipeline();
    }
    get toneMappingType () {
        return this._toneMappingType;
    }
    public initialize (toneMappingInfo: ToneMappingInfo) {
        this._toneMappingType = toneMappingInfo.toneMappingType;
    }

    public activate () {
        this._updatePipeline();
        this._activated = true;
    }

    protected _updatePipeline () {
        const root = cclegacy.director.root;
        const pipeline = root.pipeline;
        pipeline.macros.CC_TONE_MAPPING_TYPE = this._toneMappingType;
        if (this._activated) {
            root.onGlobalPipelineStateChanged();
        }
    }
}
