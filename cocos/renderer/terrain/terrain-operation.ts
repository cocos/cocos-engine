import { Rect, Vec2, Vec4 } from '../../core/math';
import { Terrain, TerrainBlock } from './terrain';

export class TerrainHeightData {
    public x: number = 0;
    public y: number = 0;
    public value: number = 0;
}

export class TerrainHeightOperation {
    public static addChangeList (changelist: TerrainBlock[], block: TerrainBlock) {
        for (const i of changelist) {
            if (i === block) {
                return;
            }
        }

        changelist.push(block);
    }

    public data: TerrainHeightData[] = new Array<TerrainHeightData>();

    public push (x: number, y: number, value: number) {
        for (const i of this.data) {
            if (i.x === x && i.y === y) {
                return ;
            }
        }

        const point = new TerrainHeightData();
        point.x = x;
        point.y = y;
        point.value = value;
        this.data.push(point);
    }

    public apply (terrain: Terrain) {
        // update data
        for (const i of this.data) {
            terrain.setHeight(i.x, i.y, i.value);
        }

        // update normal
        for (const i of this.data) {
            const n = terrain._calcuNormal(i.x, i.y);

            terrain._setNormal(i.x, i.y, n);
        }

        // update block
        const changelist = new Array<TerrainBlock>();

        for (const i of terrain.getBlocks()) {
            const rect = i.getRect();

            for (const j of this.data) {
                if (!rect.contains(new Vec2(j.x, j.y))) {
                    continue;
                }

                TerrainHeightOperation.addChangeList(changelist, i);
            }
        }

        for (const i of changelist) {
            i._updateHeight();
        }
    }
}

//
export class TerrainHeightUndoRedo extends TerrainHeightOperation {
}

//
export class TerrainWeightData {
    public x: number = 0;
    public y: number = 0;
    public value: Vec4 = new Vec4();
}

export class TerrainWeightOperation {
    public static addChangeList (changelist: TerrainBlock[], block: TerrainBlock) {
        for (const i of changelist) {
            if (i === block) {
                return;
            }
        }

        changelist.push(block);
    }

    public data: TerrainWeightData[] = new Array<TerrainWeightData>();

    public push (x: number, y: number, value: Vec4) {
        for (const i of this.data) {
            if (i.x === x && i.y === y) {
                return ;
            }
        }

        const point = new TerrainWeightData();
        point.x = x;
        point.y = y;
        point.value = value;
        this.data.push(point);
    }

    public apply (terrain: Terrain) {
        // update data
        for (const i of this.data) {
            terrain.setWeight(i.x, i.y, i.value);
        }

        // update block
        const changelist = new Array<TerrainBlock>();

        for (const block of terrain.getBlocks()) {
            const rect = new Rect();
            rect.x = block.getIndex()[0] * terrain.info.weightMapSize;
            rect.y = block.getIndex()[1] * terrain.info.weightMapSize;
            rect.width = terrain.info.weightMapSize;
            rect.height = terrain.info.weightMapSize;

            for (const p of this.data) {
                if (!rect.contains(new Vec2(p.x, p.y))) {
                    continue;
                }

                TerrainWeightOperation.addChangeList(changelist, block);
            }
        }

        for (const i of changelist) {
            i._updateWeightMap();
        }
    }
}

export class TerrainBlockLayerData {
    public block: TerrainBlock;
    public layers: number[];

    constructor (block: TerrainBlock, layers: number[]) {
        this.block = block;
        this.layers = layers;
    }
}

export class TerrainWeightUndoRedo extends TerrainWeightOperation {
    public blockLayers: TerrainBlockLayerData[] = new Array<TerrainBlockLayerData>();

    public pushBlock (block: TerrainBlock, layers: number[]) {
        for (const i of this.blockLayers) {
            if (i.block === block) {
                return;
            }
        }

        this.blockLayers.push(new TerrainBlockLayerData(block, layers));
    }

    public apply (terrain: Terrain) {
        super.apply(terrain);

        for (const i of this.blockLayers) {
            const block = i.block;
            const layers = i.layers;

            block.setLayer(0, layers[0]);
            block.setLayer(1, layers[1]);
            block.setLayer(2, layers[2]);
            block.setLayer(3, layers[3]);
        }
    }
}
