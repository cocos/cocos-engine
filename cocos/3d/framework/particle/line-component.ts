import { Texture2D } from '../../../assets';
import { Component } from '../../../components';
import { ccclass, executeInEditMode, menu, property } from '../../../core/data/class-decorator';
import { Vec3 } from '../../../core/value-types';
import { LineModel } from '../../../renderer/models/line-model';
import { Material } from '../../assets';
import { builtinResMgr } from '../../builtin';
import { AnimationCurve } from '../../geom-utils';
import CurveRange from './animator/curve-range';
import GradientRange from './animator/gradient-range';

const CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';
const define = { CC_USE_WORLD_SPACE: false };

@ccclass('cc.LineComponent')
@menu('Components/LineComponent')
@executeInEditMode
export class LineComponent extends Component {
    @property({
        type: Texture2D,
    })
    private _texture = null;

    @property({
        type: Texture2D,
        displayOrder: 0,
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

    @property({
        displayOrder: 1,
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

    @property({
        type: [Vec3],
        displayOrder: 2,
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

    @property({
        type: CurveRange,
        displayOrder: 3,
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

    @property({
        type: GradientRange,
    })
    private _color = new GradientRange();

    @property({
        type: GradientRange,
        displayOrder: 4,
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

    private _model: LineModel | null = null;

    constructor () {
        super();
    }

    public onEnable () {
        if (!this._model) {
            this._model = this._getRenderScene().createModel(LineModel, this.node);
            this._model.setCapacity(100);
            if (this._material == null) {
                this._material = new Material();
                this._material.copy(builtinResMgr.get<Material>('default-trail-material'));
                define[CC_USE_WORLD_SPACE] = this.worldSpace;
                this._material.recompileShaders(define);
            }
            this._model.setSubModelMaterial(0, this._material!);
        }
        this._model!.enabled = true;
        this.texture = this.texture;
        this._model.addLineVertexData(this._positions, this._width, this._color);
    }

    public onDisable () {
        if (this._model) {
            this._model.enabled = false;
        }
    }
}
