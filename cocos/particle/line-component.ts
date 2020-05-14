
/**
 * 粒子系统模块
 * @category particle
 */


import { Material, Texture2D } from '../core/assets';
import { Component } from '../core/components';
import { ccclass, help, executeInEditMode, menu, property } from '../core/data/class-decorator';
import { Vec3, Vec2, Vec4 } from '../core/math';
import { LineModel } from './models/line-model';
import { builtinResMgr } from '../core/3d/builtin';
import CurveRange from './animator/curve-range';
import GradientRange from './animator/gradient-range';
import { legacyCC } from '../core/global-exports';

const CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';
const define = { CC_USE_WORLD_SPACE: false };

@ccclass('cc.LineComponent')
@help('i18n:cc.LineComponent')
@menu('Components/Line')
@executeInEditMode
export class LineComponent extends Component {
    @property({
        type: Texture2D,
    })
    private _texture = null;

    /**
     * @zh 显示的纹理。
     */
    @property({
        type: Texture2D,
        displayOrder: 0,
        tooltip:'线段中显示的贴图',
    })
    get texture () {
        return this._texture;
    }

    set texture (val) {
        this._texture = val;
        if (this._material) {
            this._material.setProperty('mainTexture', val);
        }
    }

    private _material: Material | null = null;

    @property
    private _worldSpace = false;

    /**
     * @zh positions是否为世界空间坐标。
     */
    @property({
        displayOrder: 1,
        tooltip:'线段中各个点的坐标采用哪个坐标系，勾选使用世界坐标系，不选使用本地坐标系',
    })
    get worldSpace () {
        return this._worldSpace;
    }

    set worldSpace (val) {
        this._worldSpace = val;
        if (this._material) {
            define[CC_USE_WORLD_SPACE] = this.worldSpace;
            this._material.recompileShaders(define);
            if (this._model) {
                this._model.setSubModelMaterial(0, this._material!);
            }
        }
    }

    @property({
        type: [Vec3],
    })
    private _positions = [];

    /**
     * 每段折线的拐点坐标。
     */
    @property({
        type: [Vec3],
        displayOrder: 2,
        tooltip:'每个线段端点的坐标',
    })
    get positions () {
        return this._positions;
    }

    set positions (val) {
        this._positions = val;
        if (this._model) {
            this._model.addLineVertexData(this._positions, this._width, this._color);
        }
    }

    @property({
        type: CurveRange,
    })
    private _width = new CurveRange();

    /**
     * @zh 线段的宽度。
     */
    @property({
        type: CurveRange,
        displayOrder: 3,
        tooltip:'线段宽度，如果采用曲线，则表示沿着线段方向上的曲线变化',
    })
    get width () {
        return this._width;
    }

    set width (val) {
        this._width = val;
        if (this._model) {
            this._model.addLineVertexData(this._positions, this._width, this._color);
        }
    }

    @property
    private _tile = new Vec2(1, 1);

    /**
     * @zh 图块数。
     */
    @property({
        type: Vec2,
        displayOrder: 4,
        tooltip:'贴图平铺次数',
    })
    get tile () {
        return this._tile;
    }

    set tile (val) {
        this._tile.set(val);
        if (this._material) {
            this._tile_offset.x = this._tile.x;
            this._tile_offset.y = this._tile.y;
            this._material.setProperty('mainTiling_Offset', this._tile_offset);
        }
    }

    @property
    private _offset = new Vec2(0, 0);

    @property({
        type: Vec2,
        displayOrder: 5,
        tooltip:'贴图坐标的偏移',
    })
    get offset () {
        return this._offset;
    }

    set offset (val) {
        this._offset.set(val);
        if (this._material) {
            this._tile_offset.z = this._offset.x;
            this._tile_offset.w = this._offset.y;
            this._material.setProperty('mainTiling_Offset', this._tile_offset);
        }
    }

    @property({
        type: GradientRange,
    })
    private _color = new GradientRange();

    /**
     * @zh 线段颜色。
     */
    @property({
        type: GradientRange,
        displayOrder: 6,
        tooltip:'线段颜色，如果采用渐变色，则表示沿着线段方向上的颜色渐变',
    })
    get color () {
        return this._color;
    }

    set color (val) {
        this._color = val;
        if (this._model) {
            this._model.addLineVertexData(this._positions, this._width, this._color);
        }
    }

    /**
     * @ignore
     */
    private _model: LineModel | null = null;
    private _tile_offset: Vec4 = new Vec4();

    constructor () {
        super();
    }

    public onLoad () {
        this._model = legacyCC.director.root.createModel(LineModel);
        this._model!.initialize(this.node);
        this._model!.setCapacity(100);
        if (this._material == null) {
            this._material = new Material();
            this._material.copy(builtinResMgr.get<Material>('default-trail-material'));
            define[CC_USE_WORLD_SPACE] = this.worldSpace;
            this._material.recompileShaders(define);
        }
        this._model!.setSubModelMaterial(0, this._material!);
    }

    public onEnable () {
        if (!this._model) {
            return;
        }
        this.attachToScene();
        this.texture = this.texture;
        this.tile = this._tile;
        this.offset = this._offset;
        this._model.addLineVertexData(this._positions, this._width, this._color);
    }

    public onDisable () {
        if (this._model) {
            this.detachFromScene();
        }
    }

    private attachToScene () {
        if (this._model && this.node && this.node.scene) {
            if (this._model.scene) {
                this.detachFromScene();
            }
            this._getRenderScene().addModel(this._model);
        }
    }

    private detachFromScene () {
        if (this._model && this._model.scene) {
            this._model.scene.removeModel(this._model);
        }
    }
}
