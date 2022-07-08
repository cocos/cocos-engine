import { DEBUG } from 'internal:constants';
import { assert } from '../../core/platform/debug';
import { js } from '../../core/utils/js';
import { UIMeshRenderer } from '../components';
import { UIRenderer } from './ui-renderer';

export class UIRendererManager {
    private _allRenderers: (UIRenderer | UIMeshRenderer)[] = [];
    private _dirtyRenderers: (UIRenderer | UIMeshRenderer)[] = [];
    private _dirtyVersion = 0;
    public addRenderer (uiRenderer: UIRenderer | UIMeshRenderer) {
        if (uiRenderer._internalId === -1) {
            uiRenderer._internalId = this._allRenderers.length;
            this._allRenderers.push(uiRenderer);
        }
    }

    public removeRenderer (uiRenderer: UIRenderer | UIMeshRenderer) {
        if (uiRenderer._internalId !== -1) {
            if (DEBUG) {
                assert(this._allRenderers[uiRenderer._internalId] === uiRenderer);
            }
            const id = uiRenderer._internalId;
            this._allRenderers[this._allRenderers.length - 1]._internalId = id;
            js.array.fastRemoveAt(this._allRenderers, id);
            uiRenderer._internalId = -1;
            if (uiRenderer._dirtyVersion === this._dirtyVersion) {
                js.array.fastRemove(this._dirtyRenderers, uiRenderer);
                uiRenderer._dirtyVersion = -1;
            }
        }
    }

    public markDirtyRenderer (uiRenderer: UIRenderer | UIMeshRenderer) {
        if (uiRenderer._dirtyVersion !== this._dirtyVersion && uiRenderer._internalId !== -1) {
            this._dirtyRenderers.push(uiRenderer);
            uiRenderer._dirtyVersion = this._dirtyVersion;
        }
    }

    public updateAllDirtyRenderers () {
        const length = this._dirtyRenderers.length;
        const dirtyRenderers = this._dirtyRenderers;
        for (let i = 0; i < length; i++) {
            if (DEBUG) {
                assert(dirtyRenderers[i]._internalId !== -1);
            }
            dirtyRenderers[i].updateRenderer();
        }
        this._dirtyRenderers.length = 0;
        this._dirtyVersion++;
    }
}

export const uiRendererManager = new UIRendererManager();
