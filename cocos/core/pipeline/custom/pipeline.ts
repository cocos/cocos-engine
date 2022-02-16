import { Buffer, Format } from '../../gfx/index';

export abstract class Setter {
    // APIs
    public abstract setCBuffer(name: string, buffer: Buffer): void;
}

export abstract class Pipeline {
    // APIs
    public abstract addRenderTexture(name: string, format: Format, width: number, height: number): number;
}
