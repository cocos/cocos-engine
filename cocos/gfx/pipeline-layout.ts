import { GFXBindingLayout } from './binding-layout';
import { GFXObject, GFXObjectType, GFXShaderType } from './define';
import { GFXDevice } from './device';

export interface IGFXPushConstantRange {
    shaderType: GFXShaderType;
    offset: number;
    count: number;
}

export interface IGFXPipelineLayoutInfo {
    pushConstantsRanges?: IGFXPushConstantRange[];
    layouts: GFXBindingLayout[];
}

export abstract class GFXPipelineLayout extends GFXObject {

    /**
     * @zh
     * GFX绑定布局数组。
     */
    public get layouts (): GFXBindingLayout[] {
        return this._layouts;
    }

    /**
     * @zh
     * GFX设备。
     */
    protected _device: GFXDevice;

    /**
     * @zh
     * 推送常量范围数组。
     */
    protected _pushConstantsRanges: IGFXPushConstantRange[] = [];

    /**
     * @zh
     * GFX绑定布局数组。
     */
    protected _layouts: GFXBindingLayout[] = [];

    /**
     * @zh
     * 构造函数。
     * @param device GFX设备。
     */
    constructor (device: GFXDevice) {
        super(GFXObjectType.PIPELINE_LAYOUT);
        this._device = device;
    }

    /**
     * @zh
     * 初始化函数。
     * @param info GFX管线布局描述信息。
     */
    public abstract initialize (info: IGFXPipelineLayoutInfo): boolean;

    /**
     * @zh
     * 销毁函数。
     */
    public abstract destroy ();
}
