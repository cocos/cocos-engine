import { RenderScene } from '../../renderer/scene';
import { SceneTask, SceneTransversal, SceneVisitor } from './pipeline';
import { TaskType } from './types';

export class WebSceneTask extends SceneTask {
    constructor (scene: RenderScene, visitor: SceneVisitor) {
        super();
        this._scene = scene;
        this._visitor = visitor;
    }
    public get taskType (): TaskType {
        return TaskType.SYNC;
    }
    public start (): void {
        // do scene transversal
    }
    public join (): void {
        // for web-pipeline, do nothing
    }
    public submit (): void {
        // do nothing
    }
    private _scene: RenderScene;
    private _visitor: SceneVisitor;
}

export class Web3DSceneTransversal extends SceneTransversal {
    constructor (scene: RenderScene) {
        super();
        this._scene = scene;
    }
    public transverse (visitor: SceneVisitor): SceneTask {
        return new WebSceneTask(this._scene, visitor);
    }
    private _scene: RenderScene;
}
