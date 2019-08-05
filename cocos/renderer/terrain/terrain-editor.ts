import { CameraComponent } from '../../3d/framework/camera-component';
import { Vec3 } from '../../core/math';
import { Node } from '../../scene-graph/node';
import { Terrain } from './terrain';
import { TerrainEditorManage } from './terrain-editor-manage';
import { eTerrainEditorMode, TerrainEditorMode } from './terrain-editor-mode';
import { TerrainEditorPaint } from './terrain-editor-paint';
import { TerrainEditorSculpt } from './terrain-editor-sculpt';

export class TerrainEditor {
    public static Instance: TerrainEditor;

    private _terrain: Terrain|null = null;
    private _modes: TerrainEditorMode[] =  [
        new TerrainEditorManage(),
        new TerrainEditorSculpt(),
        new TerrainEditorPaint(),
    ];

    private _currentMode: TerrainEditorMode | null = null;

    constructor () {
        TerrainEditor.Instance = this;

        this.setMode(eTerrainEditorMode.SCULPT);
    }

    public setEditTerrain (t: Terrain) {
        this._terrain = t;
    }

    public setMode (mode: eTerrainEditorMode) {
        const m = this._modes[mode];

        this._currentMode = m;

        // Invidate all brush material
        if (this._terrain != null) {
            for (const block of this._terrain.getBlocks()) {
                block.setBrushMaterial(null);
            }
        }
    }

    public getMode (mode: eTerrainEditorMode) {
        return this._modes[mode];
    }

    public getCurrentMode () {
        return this._currentMode;
    }

    public getCurrentModeType () {
        if (this._currentMode === this._modes[0]) {
            return eTerrainEditorMode.MANAGE;
        }
        else if (this._currentMode === this._modes[1]) {
            return eTerrainEditorMode.SCULPT;
        }
        else if (this._currentMode === this._modes[2]) {
            return eTerrainEditorMode.PAINT;
        }

        return eTerrainEditorMode.SCULPT;
    }

    public setCurrentLayer (id: number) {
        const paintMode = this.getMode(eTerrainEditorMode.PAINT) as TerrainEditorPaint;

        paintMode.setCurrentLayer(id);
    }

    public update (dtime: number) {
        if (this._currentMode == null || this._terrain == null) {
            return;
        }

        this._currentMode.onUpdate(this._terrain, dtime);
    }

    public onMouseDown (id: number, x: number, y: number) {
        if (this._terrain == null) {
            return;
        }

        const sculptMode = this.getMode(eTerrainEditorMode.SCULPT) as TerrainEditorSculpt;
        const paintMode = this.getMode(eTerrainEditorMode.PAINT) as TerrainEditorPaint;

        if (this._currentMode === sculptMode) {
            sculptMode.onMouseDown();
        }
        else if (this._currentMode === paintMode) {
            paintMode.onMouseDown();
        }
    }

    public onMouseUp (id: number, x: number, y: number) {
        if (this._terrain == null) {
            return;
        }

        const sculptMode = this.getMode(eTerrainEditorMode.SCULPT) as TerrainEditorSculpt;
        const paintMode = this.getMode(eTerrainEditorMode.PAINT) as TerrainEditorPaint;

        if (this._currentMode === sculptMode) {
            sculptMode.onMouseUp();
        }
        else if (this._currentMode === paintMode) {
            paintMode.onMouseUp();
        }
    }

    public onMouseMove (camera: Node, x: number, y: number) {
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
            const to = new Vec3();

            cameraComponent.screenToWorld(new Vec3(x, y, 0), to);

            const dir = new Vec3();
            Vec3.subtract(dir, to, from);
            Vec3.normalize(dir, dir);

            const vhit = this._terrain.rayCheck(from, dir, 0.1);
            if (vhit == null) {
                return ;
            }

            const sculptMode = this.getMode(eTerrainEditorMode.SCULPT) as TerrainEditorSculpt;
            const paintMode = this.getMode(eTerrainEditorMode.PAINT) as TerrainEditorPaint;

            if (this._currentMode === sculptMode) {
                sculptMode.onUpdateBrushPosition(this._terrain, vhit);
            }
            else if (this._currentMode === paintMode) {
                paintMode.onUpdateBrushPosition(this._terrain, vhit);
            }
        }
    }
}
