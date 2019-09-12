import { replaceProperty } from "../../utils";
import { RenderScene } from "./render-scene";

replaceProperty(RenderScene.prototype, 'RenderScene.prototype', [
    {
        'name': 'raycastUI',
        'newName': 'raycastUI2D'
    },
    {
        'name': 'raycastUINode',
        'newName': 'raycastUI2DNode'
    },
    {
        'name': 'raycast',
        'newName': 'raycastModels'
    }
])