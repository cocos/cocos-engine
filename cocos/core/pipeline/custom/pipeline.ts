import { Buffer, Format } from '../../gfx/index';
import { Mat4 } from '../../math';

export abstract class Setter {
    public abstract setMat4(name: string, mat: Mat4): void;
    public abstract setCBuffer(name: string, buffer: Buffer): void;
}

export abstract class Pipeline {
    public abstract addRenderTexture(name: string, format: Format, width: number, height: number): number;
}
