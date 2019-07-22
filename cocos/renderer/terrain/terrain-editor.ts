import { Terrain, TERRAIN_BLOCK_TILE_COMPLEXITY } from './terrain'
import { Vec3, Vec4, Rect } from '../../core/value-types';
import { Node } from '../../scene-graph/node';
import { clamp } from '../../core/vmath';
import { CameraComponent } from '../../3d/framework';
import { TerrainBrush, TerrainCircleBrush } from './terrain-brush';
import { TerrainHeightOperation, TerrainWeightOperation, TerrainHeightUndoRedo, TerrainWeightUndoRedo } from './terrain-operation';

//
export enum eTerrainEditorMode
{
    MANAGE,
    SCULPT,
    PAINT,
}

// 模式
//
export class TerrainEditor_Mode
{
    onUpdate(dtime: number) {
    }
}

// 管理模式
//  
export class TerrainEditor_Manage extends TerrainEditor_Mode
{
}

// 高度编辑
//
export class TerrainEditor_Sculpt extends TerrainEditor_Mode
{
    _brush: TerrainBrush = new TerrainCircleBrush;
    _undo: TerrainHeightUndoRedo|null = null;

    onUpdate(dtime: number) {
        if (this._undo != null) {
            this._updateHeight(dtime, false);
        }
    }

    onUpdateBrushPosition(pos: Vec3) {
        let terrain = TerrainEditor.Instance._terrain;
        if (terrain == null) {
            return;
        }

        this._brush.update(pos);

        let blocks = terrain.getBlocks();
        for (let i = 0; i < blocks.length; ++i) {
            let block = blocks[i];
            let index = block.getIndex();

            let bound = new Rect;
            bound.x = index[0] * terrain.info.tileSize;
            bound.y = index[1] * terrain.info.tileSize;
            bound.width = TERRAIN_BLOCK_TILE_COMPLEXITY * terrain.info.tileSize;
            bound.height = TERRAIN_BLOCK_TILE_COMPLEXITY * terrain.info.tileSize;

            let brushRect = new Rect;
            brushRect.x = this._brush.position.x - this._brush.radius;
            brushRect.y = this._brush.position.z - this._brush.radius;
            brushRect.width = this._brush.radius * 2;
            brushRect.height = this._brush.radius * 2;

            if (bound.intersects(brushRect)) {
                block.setBrushMaterial(this._brush.material);
            }
            else {
                block.setBrushMaterial(null);
            }
        }
    }

    onMouseDown()
    {
        this._undo = new TerrainHeightUndoRedo;
    }

    onMouseUp()
    {
        this._undo = null;
    }

    _updateHeight(dtime: number, shift_pressed: boolean)
    {
        let terrain = TerrainEditor.Instance._terrain;
        if (terrain == null) {
            return;
        }

        let x1 = this._brush.position.x - this._brush.radius;
        let y1 = this._brush.position.z - this._brush.radius;
        let x2 = this._brush.position.x + this._brush.radius;
        let y2 = this._brush.position.z + this._brush.radius;

        x1 /= terrain.info.tileSize;
        y1 /= terrain.info.tileSize;
        x2 /= terrain.info.tileSize;
        y2 /= terrain.info.tileSize;

        x1 = Math.floor(x1);
        y1 = Math.floor(y1);
        x2 = Math.floor(x2);
        y2 = Math.floor(y2);

        if (x1 > terrain.info.vertexCount[0] - 1 || x2 < 0)
            return;
        if (y1 > terrain.info.vertexCount[1] - 1 || y2 < 0)
            return;

        x1 = clamp(x1, 0, terrain.info.vertexCount[0] - 1);
        y1 = clamp(y1, 0, terrain.info.vertexCount[1] - 1);
        x2 = clamp(x2, 0, terrain.info.vertexCount[0] - 1);
        y2 = clamp(y2, 0, terrain.info.vertexCount[1] - 1);

        let op = new TerrainHeightOperation;
        for (let y = y1; y <= y2; ++y) {
            for (let x = x1; x <= x2; ++x) {
                let h = terrain.getHeight(x, y);

                if (this._undo != null) {
                    this._undo.push(x, y, h);
                }
                
                let xpos = x * terrain.info.tileSize;
                let ypos = y * terrain.info.tileSize;
                let delta = this._brush.getDelta(xpos, ypos) * dtime;

                if (!shift_pressed) {
                    h += delta;
                }
                else {
                    h -= delta;
                }

                op.push(x, y, h);
            } 
        }

        op.apply(terrain);
    }

}

// 权重编辑
//
export class TerrainEditor_Paint extends TerrainEditor_Mode
{
    _brush: TerrainBrush = new TerrainCircleBrush;
    _undo: TerrainWeightUndoRedo|null = null;
    _currentLayer: number = -1;

    onUpdate(dtime: number) {
        if (this._undo != null) {
            this._updateWeight(dtime);
        }
    }

    onUpdateBrushPosition(pos: Vec3) {
        let terrain = TerrainEditor.Instance._terrain;
        if (terrain == null) {
            return;
        }

        this._brush.update(pos);

        let blocks = terrain.getBlocks();
        for (let i = 0; i < blocks.length; ++i) {
            let block = blocks[i];
            let index = block.getIndex();

            let bound = new Rect;
            bound.x = index[0] * terrain.info.tileSize;
            bound.y = index[1] * terrain.info.tileSize;
            bound.width = TERRAIN_BLOCK_TILE_COMPLEXITY * terrain.info.tileSize;
            bound.height = TERRAIN_BLOCK_TILE_COMPLEXITY * terrain.info.tileSize;

            let brushRect = new Rect;
            brushRect.x = this._brush.position.x - this._brush.radius;
            brushRect.y = this._brush.position.z - this._brush.radius;
            brushRect.width = this._brush.radius * 2;
            brushRect.height = this._brush.radius * 2;

            if (bound.intersects(brushRect)) {
                block.setBrushMaterial(this._brush.material);
            }
            else {
                block.setBrushMaterial(null);
            }
        }
    }

    onMouseDown()
    {
        if (this._currentLayer == -1) {
            return;
        }

        this._undo = new TerrainWeightUndoRedo;
    }

    onMouseUp()
    {
        this._undo = null;
    }

    _updateWeight(dtime: number)
    {
        let terrain = TerrainEditor.Instance._terrain;
        if (terrain == null) {
            return;
        }

        let uWeigthComplexity = terrain.info.weightMapSize * terrain.info.blockCount[0];
        let vWeigthComplexity = terrain.info.weightMapSize * terrain.info.blockCount[1];
        if (uWeigthComplexity == 0 || vWeigthComplexity == 0) {
            return ;
        }

        let x1 = this._brush.position.x - this._brush.radius;
        let y1 = this._brush.position.z - this._brush.radius;
        let x2 = this._brush.position.x + this._brush.radius;
        let y2 = this._brush.position.z + this._brush.radius;

        x1 /= terrain.info.size[0];
        y1 /= terrain.info.size[1];
        x2 /= terrain.info.size[0];
        y2 /= terrain.info.size[1];

        x1 *= uWeigthComplexity - 1;
        y1 *= vWeigthComplexity - 1;
        x2 *= uWeigthComplexity - 1;
        y2 *= vWeigthComplexity - 1;

        x1 = Math.floor(x1);
        y1 = Math.floor(y1);
        x2 = Math.floor(x2);
        y2 = Math.floor(y2);

        if (x1 > uWeigthComplexity - 1 || x2 < 0)
            return;
        if (y1 > vWeigthComplexity - 1 || y2 < 0)
            return;

        x1 = clamp(x1, 0, uWeigthComplexity - 1);
        y1 = clamp(y1, 0, vWeigthComplexity - 1);
        x2 = clamp(x2, 0, uWeigthComplexity - 1);
        y2 = clamp(y2, 0, vWeigthComplexity - 1);

        let op = new TerrainWeightOperation;
        for (let y = y1; y <= y2; ++y) {
            for (let x = x1; x <= x2; ++x) {
                let w = terrain.getWeight(x, y);
                let bx = Math.floor(x / terrain.info.weightMapSize);
                let by = Math.floor(y / terrain.info.weightMapSize);
                let block = terrain.getBlock(bx, by);
                let layers = [block.getLayer(0), block.getLayer(1), block.getLayer(2), block.getLayer(3)];

                let xpos = x / (uWeigthComplexity - 1) * terrain.info.size[0];
                let ypos = y / (vWeigthComplexity - 1) * terrain.info.size[1];
                let delta = this._brush.getDelta(xpos, ypos) * dtime;

                if (delta == 0) {
                    continue;
                }
            
                if (layers[0] == this._currentLayer) {
                    w.x += delta;
                }
                else if (layers[1] == this._currentLayer) {
                    w.y += delta;
                }
                else if (layers[2] == this._currentLayer) {
                    w.z += delta;
                }
                else if (layers[3] == this._currentLayer) {
                    w.w += delta;
                }
                else {
                    if (layers[0] == -1) {
                        block.setLayer(0, this._currentLayer);
                        w.x += delta;
                    }
                    else if (layers[1] == -1) {
                        block.setLayer(1, this._currentLayer);
                        w.y += delta;
                    }
                    else if (layers[3] == -1) {
                        block.setLayer(2, this._currentLayer);
                        w.z += delta;
                    }
                    else if (layers[4] == -1) {
                        block.setLayer(3, this._currentLayer);
                        w.w += delta;
                    }
                    else {
                        continue;
                    }
                }

                let sum = w.x + w.y + w.z + w.w;
				if (sum > 0) {
					w = w.mul(1.0 / sum);
				}

                if (this._undo != null) {
                    this._undo.push(x, y, terrain.getWeight(x, y));
                    this._undo.pushBlock(block, layers);
                }

                op.push(x, y, w);
            } 
        }

        op.apply(terrain);
    }

    setCurrentLayer(layer: number) {
        this._currentLayer = layer;
    }

    getCurrentLayer() {
        return this._currentLayer;
    }
}

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
        if (this._currentMode == null) {
            return;
        }

        this._currentMode.onUpdate(dtime);
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
                sculptMode.onUpdateBrushPosition(vhit);
            }
            else if (this._currentMode == paintMode) {
                paintMode.onUpdateBrushPosition(vhit);
            }
        }
    }
}