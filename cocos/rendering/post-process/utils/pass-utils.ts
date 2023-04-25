import { EDITOR } from 'internal:constants';

import { AccessType, AttachmentType, ComputeView, QueueHint, RasterView, ResourceResidency, SceneFlags } from '../../custom/types';
import { ClearFlagBit, Color, Format, LoadOp, StoreOp, Viewport } from '../../../gfx';
import { Pipeline, RasterPassBuilder } from '../../custom/pipeline';
import { Camera } from '../../../render-scene/scene';
import { Material } from '../../../asset/assets';
import { passContext } from './pass-context';

class PassUtils {
    clearFlag: ClearFlagBit = ClearFlagBit.COLOR;
    clearColor = new Color()
    clearDepthColor = new Color()
    ppl: Pipeline| undefined
    camera: Camera| undefined
    material: Material| undefined
    pass: RasterPassBuilder| undefined
    rasterWidth = 0
    rasterHeight = 0
    layoutName = ''

    version () {
        if (!EDITOR) {
            passContext.passPathName += `_${this.pass!.name}_${this.layoutName}`;
            this.pass!.setVersion(passContext.passPathName, passContext.passVersion);
        }
        return this;
    }

    addRasterPass (width: number, height: number, layoutName: string, passName: string) {
        const pass = this.ppl!.addRasterPass(width, height, layoutName);
        pass.name = passName;
        this.pass = pass;
        this.rasterWidth = width;
        this.rasterHeight = height;
        this.layoutName = layoutName;
        return this;
    }
    setViewport (x, y, w, h) {
        this.pass!.setViewport(new Viewport(x, y, w, h));
        return this;
    }

    addRasterView (name: string, format: Format, offscreen = true, residency?: ResourceResidency): PassUtils {
        const ppl = this.ppl;
        const camera = this.camera;
        const pass = this.pass;
        if (!ppl || !camera || !pass) {
            return this;
        }

        if (!ppl.containsResource(name)) {
            if (format === Format.DEPTH_STENCIL) {
                ppl.addDepthStencil(name, format, this.rasterWidth, this.rasterHeight, ResourceResidency.MANAGED);
            } else if (offscreen) {
                ppl.addRenderTarget(name, format, this.rasterWidth, this.rasterHeight, residency || ResourceResidency.MANAGED);
            } else {
                ppl.addRenderTexture(name, format, this.rasterWidth, this.rasterHeight, camera.window);
            }
        }

        if (format !== Format.DEPTH_STENCIL) {
            if (!offscreen) {
                ppl.updateRenderWindow(name, camera.window);
            } else {
                ppl.updateRenderTarget(name, this.rasterWidth, this.rasterHeight);
            }
        } else {
            ppl.updateDepthStencil(name, this.rasterWidth, this.rasterHeight);
        }

        const clearColor = new Color();
        let view: RasterView;
        if (format === Format.DEPTH_STENCIL) {
            clearColor.copy(this.clearDepthColor);

            const clearFlag = this.clearFlag & ClearFlagBit.DEPTH_STENCIL;
            let clearOp = LoadOp.CLEAR;
            if (clearFlag === ClearFlagBit.NONE) {
                clearOp = LoadOp.LOAD;
            }

            view = new RasterView('_',
                AccessType.WRITE, AttachmentType.DEPTH_STENCIL,
                clearOp, StoreOp.STORE,
                clearFlag,
                clearColor);
        } else {
            clearColor.copy(this.clearColor);

            const clearFlag = this.clearFlag & ClearFlagBit.COLOR;
            let clearOp = LoadOp.CLEAR;
            if (clearFlag === ClearFlagBit.NONE) {
                clearOp = LoadOp.LOAD;
            }

            view = new RasterView('_',
                AccessType.WRITE, AttachmentType.RENDER_TARGET,
                clearOp,
                StoreOp.STORE,
                clearFlag,
                clearColor);
        }
        pass.addRasterView(name, view);
        return this;
    }
    setPassInput (inputName: string, shaderName: string) {
        if (this.ppl!.containsResource(inputName)) {
            const computeView = new ComputeView();
            computeView.name = shaderName;
            this.pass!.addComputeView(inputName, computeView);
        }
        return this;
    }

    blitScreen (passIdx = 0) {
        this.pass!.addQueue(QueueHint.RENDER_TRANSPARENT).addCameraQuad(
            this.camera!, this.material!, passIdx,
            SceneFlags.NONE,
        );
        return this;
    }
}

export const passUtils = new PassUtils();
