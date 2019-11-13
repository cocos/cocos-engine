import { ccclass, property, executeInEditMode, menu } from "../../platform/CCClassDecorator";
import { Texture2D } from "../../assets";
import { createMesh } from "../../misc/utils";
import { GFXPrimitiveMode, GFXFormat } from "../../../renderer/gfx/define";
import gfx from '../../../renderer/gfx';
import { Color } from "../../value-types";
import Model from "../../../renderer/scene/model";
import Component from "../../components/CCComponent";
import { toRadian, toDegree } from "../../../core/value-types";

const Material = require('../../assets/material/CCMaterial');

@ccclass('cc.BillboardComponent')
@menu('Components/BillboardComponent')
@executeInEditMode
export class BillboardComponent extends Component {

    @property({
        type: Texture2D,
    })
    _texture = null;

    @property({
        type: Texture2D,
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

    _height = 0;

    /**
     * @zh 高度。
     */
    @property
    get height () {
        return this._height;
    }

    set height (val) {
        this._height = val;
        if (this._material) {
            this._uniform.y = val;
            this._material.setProperty('cc_size_rotation', this._uniform);
        }
    }

    _width = 0;

    @property
    get width () {
        return this._width;
    }

    set width (val) {
        this._width = val;
        if (this._material) {
            this._uniform.x = val;
            this._material.setProperty('cc_size_rotation', this._uniform);
        }
    }

    _rotation = 0;

    /**
     * @zh 角度。
     */
    @property
    get rotation () {
        return Math.round(toDegree(this._rotation) * 100) / 100;
    }

    set rotation (val) {
        this._rotation = toRadian(val);
        if (this._material) {
            this._uniform.z = this._rotation;
            this._material.setProperty('cc_size_rotation', this._uniform);
        }
    }

    _model = null;

    _mesh = null;

    _material = null;

    _uniform = cc.v4(1, 1, 0, 0);

    constructor () {
        super();
    }

    onEnable () {
        if (!this._model) {
            this.createModel();
        }
        this._model.enabled = true;
        this.width = this._width;
        this.height = this._height;
        this.rotation = this.rotation;
        this.texture = this.texture;
    }

    onDisable () {
        if (this._model) {
            this._model.enabled = false;
        }
    }

    createModel () {
        this._mesh = createMesh({
            primitiveMode: GFXPrimitiveMode.TRIANGLE_LIST,
            positions: [0, 0, 0,
                0, 0, 0,
                0, 0, 0,
                0, 0, 0],
            uvs: [0, 0,
                1, 0,
                0, 1,
                1, 1],
            colors: [
                Color.WHITE.r, Color.WHITE.g, Color.WHITE.b, Color.WHITE.a,
                Color.WHITE.r, Color.WHITE.g, Color.WHITE.b, Color.WHITE.a,
                Color.WHITE.r, Color.WHITE.g, Color.WHITE.b, Color.WHITE.a,
                Color.WHITE.r, Color.WHITE.g, Color.WHITE.b, Color.WHITE.a],
            attributes: [
                { name: gfx.ATTR_POSITION, format: GFXFormat.RGB32F },
                { name: gfx.ATTR_TEX_COORD, format: GFXFormat.RG32F },
                { name: gfx.ATTR_COLOR, format: GFXFormat.RGBA8UI, isNormalized: true },
            ],
            indices: [0, 1, 2, 1, 2, 3],
        }, undefined, { calculateBounds: false });
        this._model = this._getRenderScene().createModel(Model, this.node);
        if (this._material == null) {
            this._material = Material.getInstantiatedBuiltinMaterial('default-billboard-material');
        }
        this._model.initSubModel(0, this._mesh.getSubMesh(0), this._material);
    }
}
