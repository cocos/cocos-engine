import { js } from '../../core/utils/js';
import { UIMeshRenderer } from '../components';
import { UIRenderer } from './ui-renderer';

export class UIRendererManager {
    private _allRenderers: UIRenderer[] = [];
    private _dirtyRenderers: (UIRenderer | UIMeshRenderer)[] = [];
    private _dirtyVersion = 0;
    public addRenderer (uiRenderer: UIRenderer) {
        this._allRenderers.push(uiRenderer);
    }

    public removeRenderer (uiRenderer: UIRenderer) {
        js.array.fastRemove(this._allRenderers, uiRenderer);
    }

    public markDirtyRenderer (uiRenderer: UIRenderer | UIMeshRenderer) {
        if (uiRenderer._dirtyVersion !== this._dirtyVersion) {
            this._dirtyRenderers.push(uiRenderer);
            uiRenderer._dirtyVersion = this._dirtyVersion;
        }
    }

    public updateAllDirtyRenderers () {
        const length = this._dirtyRenderers.length;
        const dirtyRenderers = this._dirtyRenderers;
        for (let i = 0; i < length; i++) {
            dirtyRenderers[i].updateRenderer();
        }
        this._dirtyRenderers.length = 0;
        this._dirtyVersion++;
    }
}

export const uiRendererManager = new UIRendererManager();
