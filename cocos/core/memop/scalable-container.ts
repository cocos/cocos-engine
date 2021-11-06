import { containerManager } from './container-manager';

export abstract class ScalableContainer {
    public _poolHandle = -1;
    constructor () {
        containerManager.addContainer(this);
    }

    abstract tryShrink (): void;

    destroy () {
        containerManager.removeContainer(this);
    }
}
