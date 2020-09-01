import { Vec2 } from '../../../core/math';
import { legacyCC } from '../../global-exports';
import { UBOShadow } from '../../pipeline/define';
import { ForwardPipeline } from '../../pipeline';
import { GFXDescriptorSet } from '../../gfx';
import { Color } from '../../math';

/**
 * @en Scene level shadow related information
 * @zh 常规阴影相关信息
 */
export class Shadow {
    /**
     * @en Whether activate shadow
     * @zh 是否启用常规阴影？
     */
    get enabled () {
        return this._enabled;
    }

    set enabled (val: boolean) {
        if (this._enabled === val) {
            return
        }
        this._enabled = val;
        this._enabled ? this.activate() : this._updatePipeline();
    }

    protected _enabled: boolean = false;
    /**
     * @en get or set shadow camera near
     * @zh 获取或者设置阴影相机近裁剪面
     */
    public near: number = 1;
    /**
     * @en get or set shadow camera far
     * @zh 获取或者设置阴影相机远裁剪面
     */
    public far: number = 30;
    /**
     * @en get or set shadow camera aspect
     * @zh 获取或者设置阴影相机的宽高比
     */
    public aspect: number = 1;
    /**
     * @en get or set shadow camera orthoSize
     * @zh 获取或者设置阴影相机正交大小
     */
    public orthoSize: number = 5;
    /**
     * @en get or set shadow camera orthoSize
     * @zh 获取或者设置阴影纹理大小
     */
    public size: Vec2 = new Vec2(512, 512);
    protected _data = Float32Array.from([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, // matLightPlaneProj
        0.0, 0.0, 0.0, 0.3, // shadowColor
    ]);
    protected _globalDescriptorSet: GFXDescriptorSet | null = null;

    public activate () {
        const pipeline = legacyCC.director.root.pipeline;
        this._globalDescriptorSet = pipeline.descriptorSet;
        this._data = (pipeline as ForwardPipeline).shadowUBO;
        Color.toArray(this._data, pipeline.planarShadows.shadowColor, UBOShadow.SHADOW_COLOR_OFFSET);
        this._globalDescriptorSet!.getBuffer(UBOShadow.BLOCK.binding).update(this._data);
        this._updatePipeline();
    }

    protected _updatePipeline () {
        const root = legacyCC.director.root
        const pipeline = root.pipeline;
        if (pipeline.macros.CC_RECEIVE_SHADOW === this.enabled) { return; }
        pipeline.macros.CC_RECEIVE_SHADOW = this.enabled;
        root.onGlobalPipelineStateChanged();
    }
}
legacyCC.Shadow = Shadow;