import { TerrainEditor_Mode, eTerrainEditorMode} from './terrain-editor-mode'
import { TerrainEditor_Manage } from './terrain-editor-manage'
import { TerrainEditor_Sculpt } from './terrain-editor-sculpt'
import { TerrainEditor_Paint } from './terrain-editor-paint'
import { Terrain } from './terrain'
import { Node } from '../../scene-graph/node';
import { CameraComponent } from '../../3d/framework';

export class TerrainEditor
{
    static Instance: TerrainEditor;

    _terrain: Terrain|null = null;
    _modes: Array<TerrainEditor_Mode> =  [
        new TerrainEditor_Manage,
        new TerrainEditor_Sculpt,
        new TerrainEditor_Paint,
    ];

    _currentMode: TerrainEditor_Mode | null = null;

    constructor() {
        TerrainEditor.Instance = this;

        this.setMode(eTerrainEditorMode.SCULPT);
    }

    setEditTerrain(t: Terrain) {
        this._terrain = t;
    }

    setMode(mode: eTerrainEditorMode) {
        let m = this._modes[mode];

        this._currentMode = m;
    }

    getMode(mode: eTerrainEditorMode) {
        return this._modes[mode];
    }

    getCurrentMode() {
        return this._currentMode;
    }

    getCurrentModeType() {
        if (this._currentMode == this._modes[0]) {
            return eTerrainEditorMode.MANAGE;
        }
        else if (this._currentMode == this._modes[1]) {
            return eTerrainEditorMode.SCULPT;
        }
        else if (this._currentMode == this._modes[2]) {
            return eTerrainEditorMode.PAINT;
        }

        return eTerrainEditorMode.SCULPT;
    }

    setCurrentLayer(id: number) {
        let paintMode = this.getMode(eTerrainEditorMode.PAINT) as TerrainEditor_Paint;

        paintMode.setCurrentLayer(id);
    }

    update(dtime: number) {
        if (this._currentMode == null || this._terrain == null) {
            return;
        }

        this._currentMode.onUpdate(this._terrain, dtime);
    }

    onMouseDown(id: number, x: number, y: number) {
        if (this._terrain == null) {
            return;
        }

        let sculptMode = this.getMode(eTerrainEditorMode.SCULPT) as TerrainEditor_Sculpt;
        let paintMode = this.getMode(eTerrainEditorMode.PAINT) as TerrainEditor_Paint;

        if (this._currentMode == sculptMode) {
            sculptMode.onMouseDown();
        }
        else if (this._currentMode == paintMode) {
            paintMode.onMouseDown();
        }
    }

    onMouseUp(id: number, x: number, y: number) {
        if (this._terrain == null) {
            return;
        }

        let sculptMode = this.getMode(eTerrainEditorMode.SCULPT) as TerrainEditor_Sculpt;
        let paintMode = this.getMode(eTerrainEditorMode.PAINT) as TerrainEditor_Paint;

        if (this._currentMode == sculptMode) {
            sculptMode.onMouseUp();
        }
        else if (this._currentMode == paintMode) {
            paintMode.onMouseUp();
        }
    }

    onMouseMove(camera: Node, x: number, y: number) {
        if (this._terrain == null) {
            return;
        }

        const scene = this._terrain.node.scene;
        if (camera != null) {
            const cameraComponent = camera.getComponent(CameraComponent);
            if (cameraComponent == null) {
                return;
            }

            const from = camera.getPosition();
            const to = new cc.vmath.vec3();

            cameraComponent.screenToWorld(new cc.vmath.vec3(x, y, 0), to);

            const dir = new cc.Vec3();
            cc.vmath.vec3.subtract(dir, to, from);
            cc.vmath.vec3.normalize(dir, dir);

            let vhit = this._terrain.rayCheck(from, dir, 0.1);
            if (vhit == null) {
                return ;
            }

            let sculptMode = this.getMode(eTerrainEditorMode.SCULPT) as TerrainEditor_Sculpt;
            let paintMode = this.getMode(eTerrainEditorMode.PAINT) as TerrainEditor_Paint;

            if (this._currentMode == sculptMode) {
                sculptMode.onUpdateBrushPosition(this._terrain, vhit);
            }
            else if (this._currentMode == paintMode) {
                paintMode.onUpdateBrushPosition(this._terrain, vhit);
            }
        }
    }
}