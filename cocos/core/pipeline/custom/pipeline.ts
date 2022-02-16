import { Format } from '../../gfx/index';

export abstract class Pipeline {
    // APIs
    public abstract addRenderTexture(name: string, format: Format, width: number, height: number): number;
}
