import { Root } from '../root';
import { GFXDevice } from '../gfx/device';
import { GFXCommandBuffer } from '../gfx/command-buffer';
import { IDefineMap } from '../renderer/core/pass-utils';
import { IInternalBindingInst } from './define';
import { RenderPipeline } from './render-pipeline';

export class RenderContext {
    public device!: GFXDevice;
    public globalBindings: Map<string, IInternalBindingInst> = new Map<string, IInternalBindingInst>();
    public commandBuffers: GFXCommandBuffer[] = [];
    public macros: IDefineMap = {};
    public initialize (pipeline: RenderPipeline) {
        return true
    }

    public activate (root: Root) {
        this.device = root.device;
    }

    public destroy () {
    };
};