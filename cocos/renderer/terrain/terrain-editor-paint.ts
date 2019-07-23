import { TerrainEditor_Mode } from './terrain-editor-mode'
import { Terrain, TERRAIN_BLOCK_TILE_COMPLEXITY } from './terrain'
import { Vec3, Rect } from '../../core/value-types';
import { clamp } from '../../core/vmath';
import { TerrainBrush, TerrainCircleBrush } from './terrain-brush';
import { TerrainWeightOperation, TerrainWeightUndoRedo } from './terrain-operation';

export class TerrainEditor_Paint extends TerrainEditor_Mode
{
    _brush: TerrainBrush = new TerrainCircleBrush;
    _undo: TerrainWeightUndoRedo|null = null;
    _currentLayer: number = -1;

    onUpdate(terrain: Terrain, dtime: number) {
        if (this._undo != null) {
            this._updateWeight(terrain, dtime);
        }
    }

    onUpdateBrushPosition(terrain: Terrain, pos: Vec3) {
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

    _updateWeight(terrain: Terrain, dtime: number)
    {
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
					w.multiply(1.0 / sum);
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
