export enum ERaycastMode {    
    ALL,
    CLOSEST,
    ANY,
}

export interface IRaySubMeshResult {
    distance: number;
    vertexIndex0: number;
    vertexIndex1: number;
    vertexIndex2: number;
}

export interface IRaySubMeshOptions {
    /**
     * @zh
     * 检测模式：[0,1,2]=>[ALL,CLOSEST,ANY]
     */
    mode: ERaycastMode;
    /**
     * @zh
     * 检测的最大距离
     */
    distance: number;
    result?: IRaySubMeshResult[];
    doubleSided?: boolean;
    doNotZeroMin?: boolean;
}

export interface IRayMeshOptions extends IRaySubMeshOptions {
    subIndices?: number[];
}

export interface IRayModelOptions extends IRayMeshOptions {
    doNotTransformRay?: boolean;
}