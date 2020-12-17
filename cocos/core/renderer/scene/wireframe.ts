import { Material } from '../../assets/material';
import { Color } from '../../math/color';

export enum WireframeMode {
    SHADED,
    BLEND,
    WIREFRAME
}

export class Wireframe {
    protected _renderMaterial: Material | null = null;
    protected _instancedMaterial: Material | null = null;
    protected _batchedMaterial: Material | null = null;
    private _isEnabled: boolean = false;
    private _color: Color = Color.GRAY;
    public activate () {
        if (!this._renderMaterial) {
            this._renderMaterial = new Material();
            this._renderMaterial.initialize({ effectName: 'wireframe' });
        }
        if(!this._instancedMaterial) {
            this._instancedMaterial = new Material();
            this._instancedMaterial.initialize({ effectName: 'wireframe', defines: { USE_INSTANCING: true }});
        }
        if(!this._batchedMaterial) {
            this._batchedMaterial = new Material();
            this._batchedMaterial.initialize({ effectName: 'wireframe', defines: { USE_BATCHING: true}});
        }
        this.color = Color.GRAY;
        
    }

    public set color (color: Color) {
        this._color = color;
        const instanceHandle = this.instancedMaterial!.passes[0].getHandle('lineColor');
        this.instancedMaterial!.passes[0].setUniform(instanceHandle!, color);
        const renderHandle = this.renderMaterial!.passes[0].getHandle('lineColor');
        this.renderMaterial!.passes[0].setUniform(renderHandle!, color);
        const batchedHandle = this.batchedMaterial!.passes[0].getHandle('lineColor');
        this.batchedMaterial!.passes[0].setUniform(batchedHandle!, color);
        this.instancedMaterial!.passes[0].update();
        this.renderMaterial!.passes[0].update();
        this.batchedMaterial!.passes[0].update();
    }

    public get color() {
        return this._color;
    }

    public get instancedMaterial() {
        return this._instancedMaterial;
    }

    public get batchedMaterial() {
        return this._batchedMaterial;
    }

    public get renderMaterial() {
        return this._renderMaterial!;
    }

    public get enabled() {
        return this._isEnabled;
    }

    public set enabled(val: boolean) {
        this._isEnabled = val;
        val && this.activate();
    }

    public destroy () {
        if (this._renderMaterial) {
            this._renderMaterial.destroy();
            this._renderMaterial = null;
        }
    }
}
