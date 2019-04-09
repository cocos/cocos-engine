// Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

import { Mesh, RenderingMesh } from '../../3d/assets/mesh';

export class MeshCombiner {
    public static mergeMesh (mesh: Mesh): Mesh {
        const combinedMesh = new Mesh();

        if (mesh.renderingMesh) {
            // const subMeshes = mesh.renderingMesh.subMeshes();
        }

        return combinedMesh;
    }
}
