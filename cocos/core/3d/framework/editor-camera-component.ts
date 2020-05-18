/**
 * @hidden
 */

import { ccclass } from '../../data/class-decorator';
import { GFXClearFlag } from '../../gfx/define';
import { toRadian } from '../../math';
import { Camera } from '../../renderer';
import { CameraComponent } from './camera-component';
import { CAMERA_EDITOR_MASK } from '../../pipeline/define';
import { legacyCC } from '../../global-exports';

@ccclass('cc.EditorCameraComponent')
export class EditorCameraComponent extends CameraComponent {

    private _uiEditorCamera: Camera | null = null;

    set projection (val) {
        super.projection = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.projectionType = val;
        }
    }

    set fov (val) {
        super.fov = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.fov = toRadian(val);
        }
    }

    set orthoHeight (val) {
        super.orthoHeight = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.orthoHeight = val;
        }
    }

    set near (val) {
        super.near = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.nearClip = val;
        }
    }

    set far (val) {
        super.far = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.farClip = val;
        }
    }

    set clearColor (val) {
        super.clearColor = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.clearColor = val;
        }
    }

    set clearDepth (val) {
        super.clearDepth = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.clearDepth = val;
        }
    }

    set clearStencil (val) {
        super.clearStencil = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.clearStencil = val;
        }
    }

    set clearFlags (val) {
        super.clearFlags = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.clearFlag = val;
        }
    }

    set rect (val) {
        super.rect = val;
        if (this._uiEditorCamera) {
            this._uiEditorCamera.viewport = val;
        }
    }

    set screenScale (val) {
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
            legacyCC.director.root!.ui.renderScene.addCamera(this._uiEditorCamera);
            this._uiEditorCamera.enabled = true;
        }
    }

    public onDisable () {
        super.onDisable();
        if (this._uiEditorCamera) {
            legacyCC.director.root!.ui.renderScene.removeCamera(this._uiEditorCamera);
        }
    }

    public onDestroy () {
        super.onDestroy();
        if (this._uiEditorCamera) {
            legacyCC.director.root!.destroyCamera(this._uiEditorCamera);
            this._uiEditorCamera = null;
        }
    }

    protected _createCamera () {
        const priorCamera = this._camera;
        super._createCamera();

        if (this._camera !== priorCamera && this._camera) {
            if (this._uiEditorCamera) {
                legacyCC.director.root!.destroyCamera(this._uiEditorCamera);
                this._uiEditorCamera = null;
            }
            this._uiEditorCamera = legacyCC.director.root!.createCamera();
            this._uiEditorCamera!.initialize({
                name: 'Editor UICamera',
                node: this._camera.node,
                projection: this._projection,
                window: legacyCC.director.root!.mainWindow,
                priority: this._priority + 1,
                flows: ['UIFlow'],
            });
            this._uiEditorCamera!.enabled = true;

            this._uiEditorCamera!.visibility = CAMERA_EDITOR_MASK;
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
