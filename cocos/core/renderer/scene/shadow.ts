import { ccclass, property } from '../../data/class-decorator';
import { Vec2 } from '../../../core/math';
import { CCBoolean, CCFloat } from '../../data/utils/attribute';
import { legacyCC } from '../../global-exports';


/**
 * @en Scene level shadow related information
 * @zh 常规阴影相关信息
 */
@ccclass('cc.Shadow')
export class Shadow {
    /**
     * @en Whether activate shadow
     * @zh 是否启用常规阴影？
     */
    @property({ 
        type: CCBoolean,
        visible: true,
    })
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

    @property
    protected _enabled: boolean = false;
    /**
     * @en get or set shadow camera near
     * @zh 获取或者设置阴影相机近裁剪面
     */
    @property({ 
        type: CCFloat,
    })
    public near: number = 1;
    /**
     * @en get or set shadow camera far
     * @zh 获取或者设置阴影相机远裁剪面
     */
    @property({ type: CCFloat })
    public far: number = 30;
    /**
     * @en get or set shadow camera aspect
     * @zh 获取或者设置阴影相机的宽高比
     */
    @property({ type: CCFloat })
    public aspect: number = 1;
    /**
     * @en get or set shadow camera orthoSize
     * @zh 获取或者设置阴影相机正交大小
     */
    @property({ type: CCFloat })
    public orthoSize: number = 5;
    /**
     * @en get or set shadow camera orthoSize
     * @zh 获取或者设置阴影纹理大小
     */
    @property({ type: Vec2 })
    public size: Vec2 = new Vec2(512, 512);

    public activate () {
        this._updatePipeline();
    }

    protected _updatePipeline () {
        const pipeline = legacyCC.director.root.pipeline;
        if (pipeline.macros.CC_RECEIVE_SHADOW === this.enabled) { return; }
        pipeline.macros.CC_RECEIVE_SHADOW = this.enabled;
    }
}