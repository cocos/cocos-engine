import { MeshRenderer } from '../3d/framework/mesh-renderer';
import { Mesh } from '../assets/mesh';
import { Mat4 } from '../math/mat4';
import { Node } from '../scene-graph/node';

function checkMaterialisSame (comp1: MeshRenderer, comp2: MeshRenderer): boolean {
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
     * Collect the Models under `staticModelRoot`,
     * merge all the meshes statically into one (while disabling each component),
     * and attach it to a new Model on `batchedRoot`.
     * The world transform of each model is guaranteed to be preserved.
     *
     * For a more fine-grained control over the process, use `Mesh.merge` directly.
     * @param staticModelRoot root of all the static models to be batched
     * @param batchedRoot the target output node
     */
    public static batchStaticModel (staticModelRoot: Node, batchedRoot: Node) {
        const models = staticModelRoot.getComponentsInChildren(MeshRenderer);
        if (models.length < 2) {
            console.error('the number of static models to batch is less than 2,it needn\'t batch.');
            return false;
        }
        for (let i = 1; i < models.length; i++) {
            if (!models[0].mesh!.validateMergingMesh(models[i].mesh!)) {
                console.error('the meshes of ' + models[0].node.name + ' and ' + models[i].node.name + ' can\'t be merged');
                return false;
            }
            if (!checkMaterialisSame(models[0], models[i])) {
                console.error('the materials of ' + models[0].node.name + ' and ' + models[i].node.name + ' can\'t be merged');
                return false;
            }
        }
        const batchedMesh = new Mesh();
        const worldMat = new Mat4();
        const rootWorldMatInv = new Mat4();
        staticModelRoot.getWorldMatrix(rootWorldMatInv);
        Mat4.invert(rootWorldMatInv, rootWorldMatInv);
        for (let i = 0; i < models.length; i++) {
            const comp = models[i];
            comp.node.getWorldMatrix(worldMat);
            Mat4.multiply(worldMat, rootWorldMatInv, worldMat);
            batchedMesh.merge(models[i].mesh!, worldMat);
            comp.enabled = false;
        }
        const batchedModel = batchedRoot.addComponent(MeshRenderer);
        batchedModel.mesh = batchedMesh;
        batchedModel.sharedMaterials = models[0].sharedMaterials;
        return true;
    }

    /**
     * Undoes everything `batchStaticModel` did.
     *
     * @param staticModelRoot root of all the static models to be batched
     * @param batchedRoot the target output node
     */
    public static unbatchStaticModel (staticModelRoot: Node, batchedRoot: Node) {
        const models = staticModelRoot.getComponentsInChildren(MeshRenderer);
        for (let i = 0; i < models.length; i++) {
            const comp = models[i];
            comp.enabled = true;
        }
        const batchedModel = batchedRoot.getComponent(MeshRenderer);
        if (batchedModel) { batchedModel.destroy(); }
        return true;
    }
}
