import { ModelComponent } from '../3d/framework/model-component';
import { Mesh } from '../assets/mesh';
import { Mat4 } from '../math/mat4';
import { Node } from '../scene-graph/node';

function checkMaterialisSame (comp1: ModelComponent, comp2: ModelComponent): boolean {
    const matNum = comp1.sharedMaterials.length;
    if (matNum !== comp2.sharedMaterials.length) {
        return false;
    }
    for (let i = 0; i < matNum; i++) {
        if (comp1.getRenderMaterial(i) !== comp2.getRenderMaterial(i)) {
            return false;
        }
    }
    return true;
}

export class BatchingUtility {
    /**
     * Collect all the models under `staticModelRoot`,
     * merge them statically into one,
     * attach it to a new ModelComponent on `batchedRoot`,
     * and disable the `staticModelRoot` node.
     * The world transform of each model is guaranteed to be preserved.
     *
     * For a more fine-grained controll over the process, use `Mesh.merge` directly.
     * @param staticModelRoot root of all the static models to be batched
     * @param batchedRoot the target output node
     */
    public static batchStaticModel (staticModelRoot: Node, batchedRoot: Node) {
        const modelComponents = staticModelRoot.getComponentsInChildren(ModelComponent);
        if (modelComponents.length < 2) {
            console.error('the number of static models to batch is less than 2,it needn\'t batch.');
            return false;
        }
        for (let i = 1; i < modelComponents.length; i++) {
            if (!modelComponents[0].mesh!.validateMergingMesh(modelComponents[i].mesh!)) {
                console.error('the meshes of ' + modelComponents[0].node.name + ' and ' + modelComponents[i].node.name + ' can\'t be merged');
                return false;
            }
            if (!checkMaterialisSame(modelComponents[0], modelComponents[i])) {
                console.error('the materials of ' + modelComponents[0].node.name + ' and ' + modelComponents[i].node.name + ' can\'t be merged');
                return false;
            }
        }
        const batchedMesh = new Mesh();
        const worldMat = new Mat4();
        const rootWorldMatInv = new Mat4();
        staticModelRoot.getWorldMatrix(rootWorldMatInv);
        Mat4.invert(rootWorldMatInv, rootWorldMatInv);
        for (let i = 0; i < modelComponents.length; i++) {
            modelComponents[i].node.getWorldMatrix(worldMat);
            Mat4.multiply(worldMat, rootWorldMatInv, worldMat);
            batchedMesh.merge(modelComponents[i].mesh!, worldMat);
        }
        const batchedModelComponent = batchedRoot.addComponent(ModelComponent)!;
        batchedModelComponent.mesh = batchedMesh;
        batchedModelComponent.sharedMaterials = modelComponents[0].sharedMaterials;
        staticModelRoot.active = false;
        return true;
    }
}
