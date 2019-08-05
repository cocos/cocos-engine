import { clamp, Rect, Vec3 } from '../../core/math';
import { Terrain, TERRAIN_BLOCK_TILE_COMPLEXITY } from './terrain';
import { TerrainBrush, TerrainCircleBrush } from './terrain-brush';
import { TerrainEditorMode } from './terrain-editor-mode';
import { TerrainWeightOperation, TerrainWeightUndoRedo } from './terrain-operation';

export class TerrainEditorPaint extends TerrainEditorMode {
    public _brush: TerrainBrush;
    public _undo: TerrainWeightUndoRedo|null = null;
    public _currentLayer: number = -1;

    constructor () {
        super();

        const brush = new TerrainCircleBrush();
        brush.strength = 5;

        this._brush = brush;
    }

    public setCurrentLayer (layer: number) {
        this._currentLayer = layer;
    }

    public getCurrentLayer () {
        return this._currentLayer;
    }

    public onUpdate (terrain: Terrain, dtime: number) {
        if (this._undo != null) {
            this._updateWeight(terrain, dtime);
        }
    }

    public onUpdateBrushPosition (terrain: Terrain, pos: Vec3) {
        this._brush.update(pos);

        const blocks = terrain.getBlocks();
        for (const i of blocks) {
            const index = i.getIndex();

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
                i.setBrushMaterial(this._brush.material);
            }
            else {
                i.setBrushMaterial(null);
            }
        }
    }

    public onMouseDown () {
        if (this._currentLayer === -1) {
            return;
        }

        this._undo = new TerrainWeightUndoRedo();
    }

    public onMouseUp () {
        this._undo = null;
    }

    private _updateWeight (terrain: Terrain, dtime: number)  {
        const uWeigthComplexity = terrain.info.weightMapSize * terrain.info.blockCount[0];
        const vWeigthComplexity = terrain.info.weightMapSize * terrain.info.blockCount[1];
        if (uWeigthComplexity === 0 || vWeigthComplexity === 0) {
            return ;
        }

        let x1 = this._brush.position.x - this._brush.radius;
        let y1 = this._brush.position.z - this._brush.radius;
        let x2 = this._brush.position.x + this._brush.radius;
        let y2 = this._brush.position.z + this._brush.radius;

        x1 /= terrain.info.size.width;
        y1 /= terrain.info.size.height;
        x2 /= terrain.info.size.width;
        y2 /= terrain.info.size.height;

        x1 *= uWeigthComplexity - 1;
        y1 *= vWeigthComplexity - 1;
        x2 *= uWeigthComplexity - 1;
        y2 *= vWeigthComplexity - 1;

        x1 = Math.floor(x1);
        y1 = Math.floor(y1);
        x2 = Math.floor(x2);
        y2 = Math.floor(y2);

        if (x1 > uWeigthComplexity - 1 || x2 < 0) {
            return;
        }
        if (y1 > vWeigthComplexity - 1 || y2 < 0) {
            return;
        }

        x1 = clamp(x1, 0, uWeigthComplexity - 1);
        y1 = clamp(y1, 0, vWeigthComplexity - 1);
        x2 = clamp(x2, 0, uWeigthComplexity - 1);
        y2 = clamp(y2, 0, vWeigthComplexity - 1);

        const op = new TerrainWeightOperation();
        for (let y = y1; y <= y2; ++y) {
            for (let x = x1; x <= x2; ++x) {
                const w = terrain.getWeight(x, y);
                const bx = Math.floor(x / terrain.info.weightMapSize);
                const by = Math.floor(y / terrain.info.weightMapSize);
                const block = terrain.getBlock(bx, by);
                const layers = [block.getLayer(0), block.getLayer(1), block.getLayer(2), block.getLayer(3)];

                const xpos = x / (uWeigthComplexity - 1) * terrain.info.size.width;
                const ypos = y / (vWeigthComplexity - 1) * terrain.info.size.height;
                const delta = this._brush.getDelta(xpos, ypos) * dtime;

                if (delta === 0) {
                    continue;
                }

                if (layers[0] === this._currentLayer) {
                    w.x += delta;
                }
                else if (layers[1] === this._currentLayer) {
                    w.y += delta;
                }
                else if (layers[2] === this._currentLayer) {
                    w.z += delta;
                }
                else if (layers[3] === this._currentLayer) {
                    w.w += delta;
                }
                else {
                    if (layers[0] === -1) {
                        block.setLayer(0, this._currentLayer);
                        w.x += delta;
                    }
                    else if (layers[1] === -1) {
                        block.setLayer(1, this._currentLayer);
                        w.y += delta;
                    }
                    else if (layers[3] === -1) {
                        block.setLayer(2, this._currentLayer);
                        w.z += delta;
                    }
                    else if (layers[4] === -1) {
                        block.setLayer(3, this._currentLayer);
                        w.w += delta;
                    }
                    else {
                        continue;
                    }
                }

                const sum = w.x + w.y + w.z + w.w;
                if (sum > 0) {
                    w.multiplyScalar(1.0 / sum);
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
}
