import { DEBUG } from 'internal:constants';
import { assert } from '../../core/platform/debug';
import { js } from '../../core/utils/js';
import { UIMeshRenderer } from '../components';
import { UIRenderer } from './ui-renderer';

export class UIRendererOpacityManager {
    private _allOpacityRenderers: (UIRenderer | UIMeshRenderer)[] = [];
    private _dirtyOpacityRenderers: (UIRenderer | UIMeshRenderer)[] = [];
    private _opacityDirtyVersion = 0;
    public addRenderer (uiRenderer: UIRenderer | UIMeshRenderer) {
        if (uiRenderer._opacityInternalId === -1) {
            uiRenderer._opacityInternalId = this._allOpacityRenderers.length;
            this._allOpacityRenderers.push(uiRenderer);
        }
    }

    public removeRenderer (uiRenderer: UIRenderer | UIMeshRenderer) {
        if (uiRenderer._opacityInternalId !== -1) {
            if (DEBUG) {
                assert(this._allOpacityRenderers[uiRenderer._opacityInternalId] === uiRenderer);
            }
            const id = uiRenderer._opacityInternalId;
            this._allOpacityRenderers[this._allOpacityRenderers.length - 1]._opacityInternalId = id;
            js.array.fastRemoveAt(this._allOpacityRenderers, id);
            uiRenderer._opacityInternalId = -1;
            if (uiRenderer._opacityDirtyVersion === this._opacityDirtyVersion) {
                js.array.fastRemove(this._dirtyOpacityRenderers, uiRenderer);
                uiRenderer._opacityDirtyVersion = -1;
            }
        }
    }

    public markDirtyRenderer (uiRenderer: UIRenderer | UIMeshRenderer) {
        if (uiRenderer._opacityDirtyVersion !== this._opacityDirtyVersion && uiRenderer._opacityInternalId !== -1) {
            this._dirtyOpacityRenderers.push(uiRenderer);
            uiRenderer._opacityDirtyVersion = this._opacityDirtyVersion;
        }
    }

    public updateAllDirtyOpacityRenderers () {
        const length = this._dirtyOpacityRenderers.length;
        const dirtyOpacityRenderers = this._dirtyOpacityRenderers;
        for (let i = 0; i < length; i++) {
            if (DEBUG) {
                assert(dirtyOpacityRenderers[i]._opacityInternalId !== -1);
            }
            dirtyOpacityRenderers[i].updateRendererOpacity();
        }
        this._dirtyOpacityRenderers.length = 0;
        this._opacityDirtyVersion++;
    }
}

export const uiRendererOpacityManager = new UIRendererOpacityManager();
