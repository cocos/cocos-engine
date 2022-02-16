import { Buffer, Format } from '../../gfx/index';
import { Mat4 } from '../../math';
import { RasterView } from './render-graph';

export abstract class Setter {
    public abstract setMat4(name: string, mat: Mat4): void;
    public abstract setCBuffer(name: string, buffer: Buffer): void;
}

export abstract class RasterPass {
    public abstract addRasterView(name: string, view: RasterView): void;
}

export abstract class Pipeline {
    public abstract addRenderTexture(name: string, format: Format, width: number, height: number): number;
}
