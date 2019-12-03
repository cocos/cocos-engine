/**
 * @hidden
 */

import { ccclass } from '../../data/class-decorator';
import { GFXClearFlag } from '../../gfx/define';
import { toRadian } from '../../math';
import { Camera } from '../../renderer';
import { CameraComponent } from './camera-component';
import { CameraEditorMask } from '../../pipeline/define';

@ccclass('cc.EditorCameraComponent')
export class EditorCameraComponent extends CameraComponent {

    private _uiEditorCamera: Camera | null = null;

    set projection (val) {
        // @ts-ignore
        super.projection = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.projectionType = val;
        }
    }

    set fov (val) {
        // @ts-ignore
        super.fov = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.fov = toRadian(val);
        }
    }

    set orthoHeight (val) {
        // @ts-ignore
        super.orthoHeight = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.orthoHeight = val;
        }
    }

    set near (val) {
        // @ts-ignore
        super.near = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.nearClip = val;
        }
    }

    set far (val) {
        // @ts-ignore
        super.far = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.farClip = val;
        }
    }

    set color (val) {
        // @ts-ignore
        super.color = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.clearColor = val;
        }
    }

    set depth (val) {
        // @ts-ignore
        super.depth = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.clearDepth = val;
        }
    }

    set stencil (val) {
        // @ts-ignore
        super.stencil = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.clearStencil = val;
        }
    }

    set clearFlags (val) {
        // @ts-ignore
        super.clearFlags = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.clearFlag = val;
        }
    }

    set rect (val) {
        // @ts-ignore
        super.rect = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.viewport = val;
        }
    }

    set screenScale (val) {
        // @ts-ignore
        super.screenScale = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.screenScale = val;
        }
    }

    public onLoad () {
        super.onLoad();

        this._inEditorMode = true;
    }

    public onEnable () {
        super.onEnable();
        if (this._uiEditorCamera) {
            cc.director.root!.ui.renderScene.addCamera(this._uiEditorCamera);
        }
    }

    public onDisable() {
        super.onDisable();
        if (this._uiEditorCamera) {
            cc.director.root!.ui.renderScene.removeCamera(this._uiEditorCamera);
        }
    }

    public onDestroy () {
        super.onDestroy();
        if (this._uiEditorCamera) {
            cc.director.root!.destroyCamera(this._uiEditorCamera);
            this._uiEditorCamera = null;
        }
    }

    protected _createCamera () {
        const priorCamera = this._camera;
        super._createCamera();

        if (this._camera !== priorCamera && this._camera) {
            if (this._uiEditorCamera) {
                cc.director.root!.destroyCamera(this._uiEditorCamera);
                this._uiEditorCamera = null;
            }
            this._uiEditorCamera = cc.director.root!.createCamera();
            this._uiEditorCamera!.initialize({
                name: 'Editor UICamera',
                node: this._camera.node,
                projection: this._projection,
                window: cc.director.root!.mainWindow,
                priority: this._priority + 1,
                flows: ['UIFlow'],
            });

            this._uiEditorCamera!.visibility = CameraEditorMask;
            this._uiEditorCamera!.viewport = this._camera.viewport;
            this._uiEditorCamera!.fov = this._camera.fov;
            this._uiEditorCamera!.nearClip = this._camera.nearClip;
            this._uiEditorCamera!.farClip = this._camera.farClip;
            this._uiEditorCamera!.clearColor = this._camera.clearColor;
            this._uiEditorCamera!.clearDepth = this._camera.clearDepth;
            this._uiEditorCamera!.clearStencil = this._camera.clearStencil;
            this._uiEditorCamera!.clearFlag = GFXClearFlag.DEPTH_STENCIL;
        }
    }
}
