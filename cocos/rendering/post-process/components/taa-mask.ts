import { RenderTexture } from '../../../asset/assets';
import { warn } from '../../../core';
import { property } from '../../../core/data/class-decorator';
import { ccclass, menu } from '../../../core/data/decorators';
import { game } from '../../../game';
import { Camera } from '../../../misc';
import { Component } from '../../../scene-graph';

@ccclass('TAAMask')
@menu('PostProcess/TAAMask')
export class TAAMask extends Component {
    @property(Camera)
    maskCamera: Camera | undefined;

    _mask: RenderTexture | undefined;

    get mask (): RenderTexture | undefined {
        if (!this.maskCamera || !this.maskCamera.enabledInHierarchy) {
            return undefined;
        }
        if (!this.enabledInHierarchy) {
            return undefined;
        }

        return this._mask;
    }

    start (): void {
        if (!this.maskCamera) {
            warn('Can not find a Camera for TAAMask');
            return;
        }

        const tex = new RenderTexture();
        tex.reset({
            width: game.canvas!.width,
            height: game.canvas!.height,
        });

        this._mask = tex;
        this.maskCamera.targetTexture = tex;
    }
}
