import { replaceProperty, removeProperty } from "../../utils";
import { RenderScene } from "./render-scene";

replaceProperty(RenderScene.prototype, 'RenderScene.prototype', [
    {
        'name': 'raycastUI',
        'newName': 'raycastAllCanvas'
    },
    {
        'name': 'raycastUI2D',
        'newName': 'raycastAllCanvas'
    },
    {
        'name': 'raycast',
        'newName': 'raycastAllModels'
    },
    {
        'name': 'raycastModels',
        'newName': 'raycastAllModels'
    },
    {
        'name': 'raycastModel',
        'newName': 'raycastSingleModel'
    },
]);

removeProperty(RenderScene.prototype, 'RenderScene.prototype', [
    {
        'name': 'raycastUI2DNode'
    },
    {
        'name': 'raycastUINode',
    }
]);