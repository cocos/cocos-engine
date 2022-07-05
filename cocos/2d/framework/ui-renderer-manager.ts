import { js } from '../../core/utils/js';
import { UIMeshRenderer } from '../components';
import { UIRenderer } from './ui-renderer';

export class UIRendererManager {
    private _allRenderers: UIRenderer[] = [];
    private _dirtyRenderers: (UIRenderer | UIMeshRenderer)[] = [];
    public addRenderer (uiRenderer: UIRenderer) {
        this._allRenderers.push(uiRenderer);
    }

    public removeRenderer (uiRenderer: UIRenderer) {
        js.array.fastRemove(this._allRenderers, uiRenderer);
    }

    public markDirtyRenderer (uiRenderer: UIRenderer | UIMeshRenderer) {
        this._dirtyRenderers.push(uiRenderer);
    }

    public updateAllDirtyRenderers () {
        const length = this._dirtyRenderers.length;
        const dirtyRenderers = this._dirtyRenderers;
        for (let i = 0; i < length; i++) {
            dirtyRenderers[i].updateRenderData();
        }
        this._dirtyRenderers.length = 0;
    }
}

export const uiRendererManager = new UIRendererManager();
