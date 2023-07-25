import { cclegacy } from '../../core';
import { ccclass, executeInEditMode, menu, override, visible } from '../../core/data/decorators';
import { ModelRenderer } from '../../misc';
import { Model } from '../../render-scene/scene';
import { Root } from '../../root';

@ccclass('cc.CanvasRenderer')
@menu('2D/CanvasRenderer')
@executeInEditMode
export class CanvasRenderer extends ModelRenderer {
    @override
    @visible(false)
    get sharedMaterials () {
        return null!;
    }
    set sharedMaterials (val) {
    }

    // for model
    private _model: Model | null = null;

    get model () {
        return this._model; // todo check
    }

    public onLoad () {
        this._updateModels();
    }

    public onEnable () {
        super.onEnable();
        if (!this._model) {
            this._updateModels();
        }
        this._attachToScene();
    }

    public onDisable () {
        if (this._model) {
            this._detachFromScene();
        }
    }

    public onDestroy () {
        if (this._model) {
            this._model.destroy();
            cclegacy.director.root.destroyModel(this._model);
            this._model = null;
            this._models.length = 0;
        }
    }

    public updateModels () {
        this._updateModels();
    }

    protected _updateModels () {
        const model = this._model;
        if (model) {
            model.destroy();
            model.initialize();
            model.node = model.transform = this.node;
        } else {
            this._createModel();
        }
    }

    protected _createModel () {
        const model = this._model = (cclegacy.director.root as Root).createModel<Model>(Model);
        model.visFlags = this.visibility;// will change child
        model.node = model.transform = this.node;
        this._models.length = 0;
        this._models.push(this._model);
    }

    protected _attachToScene () {
        if (!this.node.scene || !this._model) {
            return;
        }
        const renderScene = this._getRenderScene();
        if (this._model.scene !== null) {
            this._detachFromScene();
        }
        renderScene.addModel(this._model);
    }

    protected _detachFromScene () {
        if (this._model && this._model.scene) {
            this._model.scene.removeModel(this._model);
        }
    }
}
