import { TerrainBlock, Terrain } from './terrain'
import { Vec2, Vec4, Rect } from '../../core/value-types';

export class TerrainHeightData
{
    x: number = 0;
    y: number = 0;
    value: number = 0;
}

export class TerrainHeightOperation
{
    data: Array<TerrainHeightData> = new Array<TerrainHeightData>();

    static addChangeList(changelist: Array<TerrainBlock>, block: TerrainBlock) {
        for (let i = 0; i < changelist.length; ++i) {
            if (changelist[i] == block) {
                return;
            }
        }

        changelist.push(block);
    }

    push(x: number, y: number, value: number) {
        for (let i = 0; i < this.data.length; ++i) {
            if (this.data[i].x == x && this.data[i].y == y) {
                return ;
            }
        }

        let point = new TerrainHeightData;
        point.x = x;
        point.y = y;
        point.value = value;
        this.data.push(point);
    }

    apply(terrain: Terrain) {
        // update data
        for (let i = 0; i < this.data.length; ++i) {
            let p = this.data[i];

            terrain.setHeight(p.x, p.y, p.value);
        }

        // update normal
        for (let i = 0; i < this.data.length; ++i) {
            let p = this.data[i];
            let n = terrain._calcuNormal(p.x, p.y);

            terrain._setNormal(p.x, p.y, n);
        }

        // update block
        let changelist = new Array<TerrainBlock>();
        
        for (let i = 0; i < terrain.getBlocks().length; ++i) {
            let block = terrain.getBlocks()[i];
            let rect = block.getRect();

            for (let j = 0; j < this.data.length; ++j) {
                let p = this.data[j];
                if (!rect.contains(new Vec2(p.x, p.y)))
                    continue;
                
                TerrainHeightOperation.addChangeList(changelist, block);
            }
        }

        for (let i = 0; i < changelist.length; ++i) {
            changelist[i]._updateHeight();
        }
    }
}

//
export class TerrainHeightUndoRedo extends TerrainHeightOperation
{
}

//
export class TerrainWeightData
{
    x: number = 0;
    y: number = 0;
    value: Vec4 = new Vec4;
}

export class TerrainWeightOperation
{
    data: Array<TerrainWeightData> = new Array<TerrainWeightData>();

    static addChangeList(changelist: Array<TerrainBlock>, block: TerrainBlock) {
        for (let i = 0; i < changelist.length; ++i) {
            if (changelist[i] == block) {
                return;
            }
        }

        changelist.push(block);
    }

    push(x: number, y: number, value: Vec4) {
        for (let i = 0; i < this.data.length; ++i) {
            if (this.data[i].x == x && this.data[i].y == y) {
                return ;
            }
        }

        let point = new TerrainWeightData;
        point.x = x;
        point.y = y;
        point.value = value;
        this.data.push(point);
    }

    apply(terrain: Terrain) {
        // update data
        for (let i = 0; i < this.data.length; ++i) {
            let p = this.data[i];

            terrain.setWeight(p.x, p.y, p.value);
        }

        // update block
        let changelist = new Array<TerrainBlock>();
        
        for (let i = 0; i < terrain.getBlocks().length; ++i) {
            let block = terrain.getBlocks()[i];

            let rect = new Rect;
            rect.x = block.getIndex()[0] * terrain.info.weightMapSize;
            rect.y = block.getIndex()[1] * terrain.info.weightMapSize;
            rect.width = terrain.info.weightMapSize;
            rect.height = terrain.info.weightMapSize;

            for (let j = 0; j < this.data.length; ++j) {
                let p = this.data[j];
                if (!rect.contains(new Vec2(p.x, p.y)))
                    continue;
                
                TerrainWeightOperation.addChangeList(changelist, block);
            }
        }

        for (let i = 0; i < changelist.length; ++i) {
            changelist[i]._updateWeightMap();
        }
    }
}

export class TerrainBlockLayerData
{
    block: TerrainBlock;
    layers: number[]

    constructor(block: TerrainBlock, layers: number[])
    {
        this.block = block;
        this.layers = layers;
    }
}

export class TerrainWeightUndoRedo extends TerrainWeightOperation
{
    blockLayers: Array<TerrainBlockLayerData> = new Array<TerrainBlockLayerData>();

    pushBlock(block: TerrainBlock, layers: number[])
    {
        for (let i = 0; i < this.blockLayers.length; ++i) {
            if (this.blockLayers[i].block == block) {
                return;
            }
        }

        this.blockLayers.push(new TerrainBlockLayerData(block, layers));
    }

    apply(terrain: Terrain) {
        super.apply(terrain);

        for (let i = 0; i < this.blockLayers.length; ++i) {
            let block = this.blockLayers[i].block;
            let layers = this.blockLayers[i].layers;

            block.setLayer(0, layers[0]);
            block.setLayer(1, layers[1]);
            block.setLayer(2, layers[2]);
            block.setLayer(3, layers[3]);
        }
    }
}