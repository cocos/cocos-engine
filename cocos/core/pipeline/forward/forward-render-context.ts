import { RenderContext } from '../render-context';
import { Light } from '../../renderer';
import { GFXBuffer } from '../../gfx/buffer';

export class ForwardRenderContext extends RenderContext{
    /**
     * @en The lights participating the render process
     * @zh 参与渲染的灯光。
     */
    public validLights: Light[] = [];

    /**
     * @en The buffer array of lights
     * @zh 灯光 buffer 数组。
     */
    public lightBuffers: GFXBuffer[] = [];

    /**
     * @en The index buffer offset of lights
     * @zh 灯光索引缓存偏移量数组。
     */
    public lightIndexOffsets: number[] = [];

    /**
     * @en The indices of lights
     * @zh 灯光索引数组。
     */
    public lightIndices: number[] = [];
};