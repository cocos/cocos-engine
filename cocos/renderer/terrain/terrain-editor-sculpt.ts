import { clamp, Rect, Vec3 } from '../../core/math';
import { Terrain, TERRAIN_BLOCK_TILE_COMPLEXITY } from './terrain';
import { TerrainBrush, TerrainCircleBrush } from './terrain-brush';
import { TerrainEditorMode } from './terrain-editor-mode';
import { TerrainHeightOperation, TerrainHeightUndoRedo } from './terrain-operation';

export class TerrainEditorSculpt extends TerrainEditorMode {
    public _brush: TerrainBrush = new TerrainCircleBrush();
    public _undo: TerrainHeightUndoRedo|null = null;

    public onUpdate (terrain: Terrain, dtime: number) {
        if (this._undo != null) {
            this._updateHeight(terrain, dtime, false);
        }
    }

    public onUpdateBrushPosition (terrain: Terrain, pos: Vec3) {
        this._brush.update(pos);

        for (const block of terrain.getBlocks()) {
            const index = block.getIndex();

            const bound = new Rect();
            bound.x = index[0] * TERRAIN_BLOCK_TILE_COMPLEXITY * terrain.info.tileSize;
            bound.y = index[1] * TERRAIN_BLOCK_TILE_COMPLEXITY * terrain.info.tileSize;
            bound.width = TERRAIN_BLOCK_TILE_COMPLEXITY * terrain.info.tileSize;
            bound.height = TERRAIN_BLOCK_TILE_COMPLEXITY * terrain.info.tileSize;

            const brushRect = new Rect();
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

    public onMouseDown () {
        this._undo = new TerrainHeightUndoRedo();
    }

    public onMouseUp () {
        this._undo = null;
    }

    public _updateHeight (terrain: Terrain, dtime: number, shift_pressed: boolean) {
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

        if (x1 > terrain.info.vertexCount[0] - 1 || x2 < 0) {
            return;
        }
        if (y1 > terrain.info.vertexCount[1] - 1 || y2 < 0) {
            return;
        }

        x1 = clamp(x1, 0, terrain.info.vertexCount[0] - 1);
        y1 = clamp(y1, 0, terrain.info.vertexCount[1] - 1);
        x2 = clamp(x2, 0, terrain.info.vertexCount[0] - 1);
        y2 = clamp(y2, 0, terrain.info.vertexCount[1] - 1);

        const op = new TerrainHeightOperation();
        for (let y = y1; y <= y2; ++y) {
            for (let x = x1; x <= x2; ++x) {
                let h = terrain.getHeight(x, y);

                if (this._undo != null) {
                    this._undo.push(x, y, h);
                }

                const xpos = x * terrain.info.tileSize;
                const ypos = y * terrain.info.tileSize;
                const delta = this._brush.getDelta(xpos, ypos) * dtime;

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
