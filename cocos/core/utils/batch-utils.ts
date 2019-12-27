import { ModelComponent } from '../3d/framework/model-component';
import { Mesh } from '../assets/mesh';
import { Mat4 } from '../math/mat4';
import { Node } from '../scene-graph/node';

function checkMaterialisSame (comp1: ModelComponent, comp2: ModelComponent): boolean {
    // @ts-ignore
    if (comp1._materials.length !== comp2._materials.length) {
        return false;
    }
    // @ts-ignore
    const matNum = comp1._materials.length;
    for (let i = 0; i < matNum; i++) {
        if (comp1.getRenderMaterial(i) !== comp2.getRenderMaterial(i)) {
            return false;
        }
    }
    return true;
}

export class BatchingUtility {
    /**
     * This method collect all models under staticModelRoot,and batch them into one mesh attached to batchedRoot.
     * Once the models batched,changes of transforms of these models are not valid,but changing the transform of batchedRoot is effective.
     * Because this method can cause large overhead in runtime,you shouldn't call it frequently.
     * @param staticModelRoot root of static models to batch
     * @param batchedRoot batched root node
     */
    public static batchStaticModel (staticModelRoot: Node, batchedRoot: Node): boolean {
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
        const batchedMesh: Mesh = new Mesh();
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
        // @ts-ignore
        batchedModelComponent.sharedMaterials = modelComponents[0]._materials;
        return true;
    }
}
