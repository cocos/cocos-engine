export enum ERaycastMode {
    ANY,
    ALL,
    CLOSEST,
}

export interface IRaySubMeshResult {
    distance: number;
    vertexIndex0: number;
    vertexIndex1: number;
    vertexIndex2: number;
}

export interface IRaySubMeshOptions {
    distance?: number;
    doubleSided?: boolean;
    mode?: ERaycastMode;
    result?: IRaySubMeshResult[];
}