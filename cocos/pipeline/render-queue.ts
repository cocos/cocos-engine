import { vec3 } from '../core/vmath';
import { GFXCommandBuffer } from '../gfx/command-buffer';
import { Pass } from '../renderer/core/pass';
import { Camera } from '../renderer/scene/camera';
import Model from '../renderer/scene/model';

const _pos: vec3 = vec3.create();
const _cameraPos: vec3 = vec3.create();

export class RenderItem {
    public hash: number;
    public model: Model;
    public pass: Pass;
    public cmdBuff: GFXCommandBuffer;

    constructor (hash: number, model: Model, pass: Pass, cmdBuff: GFXCommandBuffer) {
        this.hash = hash;
        this.model = model;
        this.pass = pass;
        this.cmdBuff = cmdBuff;
    }
}

export class RenderQueue {

    public get opaques (): RenderItem[] {
        return this._opaques;
    }

    public get transparents (): RenderItem[] {
        return this._transparents;
    }

    private _opaques: RenderItem[] = [];
    private _transparents: RenderItem[] = [];
    private _buffer: ArrayBuffer;
    private _f32View: Float32Array;
    private _ui32View: Uint32Array;

    constructor () {
        this._buffer = new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT);
        this._f32View = new Float32Array(this._buffer);
        this._ui32View = new Uint32Array(this._buffer);
    }

    public add (model: Model, camera: Camera) {

        model.node.getPosition(_pos);
        camera.node.getPosition(_cameraPos);
        this._f32View[0] = vec3.distance(_cameraPos, _pos);
        let x = this._ui32View[0];

        for (let i = 0; i < model.passes.length; ++i) {
            const pass = model.passes[i];
            const cmdBuff = model.commandBuffers[i];

            model.node.getWorldPosition();

            const pso = pass.pipelineState;

            const isTransparent = pso.blendState.targets[0].blend;

            if (!isTransparent) {
                // Opaque objects are sorted by depth front to back, then by shader id.
                const hash = (0 << 63) | (pso.shader.id << 13);

                this._opaques.push({hash, model, pass, cmdBuff});
            } else {
                // Transparent objects are sorted by depth back to front, then by by shader id.
                const hash = (1 << 63) | (pso.shader.id << 13);

                this._transparents.push({hash, model, pass, cmdBuff});
            }
        }
    }
}
