import { Terrain, TERRAIN_BLOCK_TILE_COMPLEXITY } from './terrain';

export enum eTerrainEditorMode {
    MANAGE,
    SCULPT,
    PAINT,
}

export class TerrainEditorMode {
    public onUpdate (terrain: Terrain, dtime: number) {
    }
}
