export enum ERaycastMode {
    ANY,
    ALL,
    CLOSEST,
}

export interface IRayMeshResult {
    distance: number;
    subMeshIndex: number;
    vertexIndex0: number;
    vertexIndex1: number;
    vertexIndex2: number;
}

export interface IRayMeshOptions {
    distance?: number;
    doubleSided?: boolean;
    mode?: ERaycastMode;
    result?: IRayMeshResult[];
}