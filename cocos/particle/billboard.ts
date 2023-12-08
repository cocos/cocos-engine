/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass, help, executeInEditMode, menu, tooltip, type, serializable } from 'cc.decorator';
import { builtinResMgr } from '../asset/asset-manager';
import { createMesh } from '../3d/misc';
import { Mesh } from '../3d/assets';
import { Material, Texture2D } from '../asset/assets';
import { Component } from '../scene-graph/component';
import { Attribute, AttributeName, Format, PrimitiveMode } from '../gfx';
import { Color, toDegree, toRadian, Vec4, cclegacy } from '../core';
import { scene } from '../render-scene';

@ccclass('cc.Billboard')
@help('i18n:cc.Billboard')
@menu('Effects/Billboard')
@executeInEditMode
export class Billboard extends Component {
    @type(Texture2D)
    private _texture = null;

    /**
     * @zh Billboard纹理。
     */
    @type(Texture2D)
    @tooltip('i18n:billboard.texture')
    get texture (): null {
        return this._texture;
    }

    set texture (val) {
        this._texture = val;
        this.updateTexture();
    }

    private updateTexture (): void {
        if (this._material) {
            this._material.setProperty('mainTexture', this._texture);
        }
    }

    @serializable
    private _height = 0;

    /**
     * @zh 高度。
     */
    @tooltip('i18n:billboard.height')
    get height (): number {
        return this._height;
    }

    set height (val) {
        this._height = val;
        this.updateHeight();
    }

    private updateHeight (): void {
        if (this._material) {
            this._uniform.y = this._height;
            this._material.setProperty('cc_size_rotation', this._uniform);
        }
    }

    @serializable
    private _width = 0;

    /**
     * @zh 宽度。
     */
    @tooltip('i18n:billboard.width')
    public get width (): number {
        return this._width;
    }

    public set width (val) {
        this._width = val;
        this.updateWidth();
    }

    private updateWidth (): void {
        if (this._material) {
            this._uniform.x = this._width;
            this._material.setProperty('cc_size_rotation', this._uniform);
        }
    }

    @serializable
    private _rotation = 0;

    /**
     * @zh billboard绕中心点旋转的角度
     */
    @tooltip('i18n:billboard.rotation')
    public get rotation (): number {
        return Math.round(toDegree(this._rotation) * 100) / 100;
    }

    public set rotation (val) {
        this._rotation = toRadian(val);
        this.updateRotation();
    }

    private updateRotation (): void {
        if (this._material) {
            this._uniform.z = this._rotation;
            this._material.setProperty('cc_size_rotation', this._uniform);
        }
    }

    @serializable
    private _techIndex = 0;

    @tooltip('i18n:billboard.technique')
    public get technique (): number {
        return this._techIndex;
    }

    public set technique (val: number) {
        // clamp technique index
        val = Math.floor(val);
        const techs = this._material?.effectAsset?.techniques;
        if (techs && val >= techs.length) {
            val = techs.length - 1;
        }
        if (val < 0) {
            val = 0;
        }
        // set technique index
        this._techIndex = val;
        // recreate model
        this.updateTechnique();
    }

    private updateTechnique (): void {
        if (this._model && this._mesh && this._material && this._material.technique !== this._techIndex) {
            // destroy model
            this.detachFromScene();
            this._model.destroy();
            this._model = null;
            this._material.destroy();
            this._material = null;
            this._mesh.destroy();
            this._mesh = null;
            // recreate model
            this.createModel();
            // set properties
            this.updateWidth();
            this.updateHeight();
            this.updateRotation();
            this.updateTexture();
            // enable/disable model
            if (this.enabled) {
                this.attachToScene();
                this._model!.enabled = true;
            } else {
                this._model!.enabled = false;
            }
        }
    }

    private _model: scene.Model | null = null;

    private _mesh: Mesh | null = null;

    private _material: Material | null = null;

    private _uniform = new Vec4(1, 1, 0, 0);

    constructor () {
        super();
    }

    public onLoad (): void {
        this.createModel();
    }

    public onEnable (): void {
        this.attachToScene();
        this._model!.enabled = true;
        this.updateWidth();
        this.updateHeight();
        this.updateRotation();
        this.updateTexture();
        this.updateTechnique();
    }

    public onDisable (): void {
        this.detachFromScene();
    }

    private attachToScene (): void {
        if (this._model && this.node && this.node.scene) {
            if (this._model.scene) {
                this.detachFromScene();
            }
            this._getRenderScene().addModel(this._model);
        }
    }

    private detachFromScene (): void {
        if (this._model && this._model.scene) {
            this._model.scene.removeModel(this._model);
        }
    }

    private createModel (): void {
        this._mesh = createMesh({
            primitiveMode: PrimitiveMode.TRIANGLE_LIST,
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
                new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F),
                new Attribute(AttributeName.ATTR_TEX_COORD, Format.RG32F),
                new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8UI, true),
            ],
            indices: [0, 1, 2, 1, 2, 3],
        }, undefined, { calculateBounds: false });
        const model = this._model = cclegacy.director.root.createModel(scene.Model, this.node);
        model.node = model.transform = this.node;
        if (this._material == null) {
            this._material = new Material();
            this._material.copy(
                builtinResMgr.get<Material>('default-billboard-material'),
                { technique: this._techIndex },
            );
        }
        model.initSubModel(0, this._mesh.renderingSubMeshes[0], this._material);
    }
}
