export interface ITerrainAsset {
    _uuid: string;
    tileSize: number;
    getVertexCountI: () => number;
    getVertexCountJ: () => number;
    getHeight: (i: number, j: number) => number;
}
