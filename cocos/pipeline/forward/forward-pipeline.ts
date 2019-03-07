import { Root } from '../../core/root';
import { Vec3 } from '../../core/value-types';
import { vec3, vec4 } from '../../core/vmath';
import { GFXBuffer } from '../../gfx/buffer';
import { GFXBindingType, GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXRenderPass } from '../../gfx/render-pass';
import { RenderPassStage, UBOForwardLights } from '../define';
import { ToneMapFlow } from '../ppfx/tonemap-flow';
import { RenderPipeline, IRenderPipelineInfo } from '../render-pipeline';
import { RenderView } from '../render-view';
import { ForwardFlow } from './forward-flow';
import { GFXFeature } from '../../gfx/device';

export enum ForwardFlowPriority {
    FORWARD = 0,
}

const _v3 = new Vec3();
const _vec4Array = new Float32Array(4);
const _idVec4Array = Float32Array.from([1, 1, 1, 0]);

export class ForwardPipeline extends RenderPipeline {

    protected _uboLights: UBOForwardLights = new UBOForwardLights();
    protected _lightsUBO: GFXBuffer | null = null;

    public get lightsUBO (): GFXBuffer {
        return this._lightsUBO!;
    }

    constructor (root: Root) {
        super(root);
    }

    public initialize (info: IRenderPipelineInfo): boolean {

        if (this._device.hasFeature(GFXFeature.FORMAT_R11G11B10F) ||
            this._device.hasFeature(GFXFeature.TEXTURE_HALF_FLOAT) ||
            this._device.hasFeature(GFXFeature.TEXTURE_FLOAT)) {
            this._isHDRSupported = true;
        }

        if (!this.createShadingTarget(info)) {
            return false;
        }

        if (!this.createQuadInputAssembler()) {
            return false;
        }

        if (!this.createUBOs()) {
            return false;
        }

        const mainWindow = this._root.mainWindow;
        let windowPass: GFXRenderPass | null = null;

        if (mainWindow) {
            windowPass = mainWindow.renderPass;
        }

        if (!windowPass) {
            console.error('RenderPass of main window is null.');
            return false;
        }

        this.addRenderPass(RenderPassStage.DEFAULT, windowPass);

        this._macros.USE_HDR = this._isHDR;

        // create flows
        this.createFlow(ForwardFlow, {
            name: 'ForwardFlow',
            priority: ForwardFlowPriority.FORWARD,
        });

        this.createFlow(ToneMapFlow, {
            name: 'ToneMapFlow',
            priority: 0,
        });

        return true;
    }

    public destroy () {
        this.destroyFlows();
        this.clearRenderPasses();
        this.destroyUBOs();
        this.destroyQuadInputAssembler();
        this.destroyShadingTarget();
    }

    protected createUBOs (): boolean {
        super.createUBOs();

        if (!this._builtinBindings.get(UBOForwardLights.BLOCK.name)) {
            const lightsUBO = this._root.device.createBuffer({
                usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                size: UBOForwardLights.SIZE,
            });

            if (!lightsUBO) {
                return false;
            }

            this._builtinBindings.set(UBOForwardLights.BLOCK.name, {
                type: GFXBindingType.UNIFORM_BUFFER,
                blockInfo: UBOForwardLights.BLOCK,
                buffer: lightsUBO,
            });
        }

        return true;
    }

    protected destroyUBOs () {
        super.destroyUBOs();

        const lightsUBO = this._builtinBindings.get(UBOForwardLights.BLOCK.name);
        if (lightsUBO) {
            lightsUBO.buffer!.destroy();
            this._builtinBindings.delete(UBOForwardLights.BLOCK.name);
        }
    }

    protected updateUBOs (view: RenderView) {
        super.updateUBOs(view);

        const scene = view.camera.scene;
        const sphereLits = scene.sphereLights;

        for (let i = 0; i < sphereLits.length; i++) {
            const light = sphereLits[i];
            if (light.enabled && light.node) {

                light.node.getWorldPosition(_v3);
                vec3.array(_vec4Array, _v3);
                this._uboLights.view.set(_vec4Array, UBOForwardLights.SPHERE_LIGHT_POS_OFFSET + i * 4);

                _vec4Array[0] = light.size;
                _vec4Array[1] = light.range;
                _vec4Array[2] = 0.0;
                this._uboLights.view.set(_vec4Array, UBOForwardLights.SPHERE_LIGHT_SIZE_RANGE_OFFSET + i * 4);

                vec3.array(_vec4Array, light.color);
                _vec4Array[0] = light.luminance;
                this._uboLights.view.set(_vec4Array, UBOForwardLights.SPHERE_LIGHT_COLOR_OFFSET + i * 4);
            } else {
                this._uboLights.view.set(_idVec4Array, UBOForwardLights.SPHERE_LIGHT_POS_OFFSET + i * 4);
                this._uboLights.view.set(_idVec4Array, UBOForwardLights.SPHERE_LIGHT_SIZE_RANGE_OFFSET + i * 4);
                this._uboLights.view.set(_idVec4Array, UBOForwardLights.SPHERE_LIGHT_COLOR_OFFSET + i * 4);
            }
        }

        const spotLits = scene.spotLights;
        for (let i = 0; i < spotLits.length; i++) {
            const light = spotLits[i];
            if (light.enabled && light.node) {

                light.node.getWorldPosition(_v3);
                vec3.array(_vec4Array, _v3);
                _vec4Array[3] = light.size;
                this._uboLights.view.set(_vec4Array, UBOForwardLights.SPOT_LIGHT_POS_SIZE_OFFSET + i * 4);

                vec3.array(_vec4Array, light.direction);
                _vec4Array[3] = light.range;
                this._uboLights.view.set(_vec4Array, UBOForwardLights.SPOT_LIGHT_DIR_RANGE_OFFSET + i * 4);

                vec3.array(_vec4Array, light.color);
                _vec4Array[0] = light.luminance;
                this._uboLights.view.set(_vec4Array, UBOForwardLights.SPOT_LIGHT_COLOR_OFFSET + i * 4);
            } else {
                this._uboLights.view.set(_idVec4Array, UBOForwardLights.SPOT_LIGHT_POS_SIZE_OFFSET + i * 4);
                this._uboLights.view.set(_idVec4Array, UBOForwardLights.SPOT_LIGHT_DIR_RANGE_OFFSET + i * 4);
                this._uboLights.view.set(_idVec4Array, UBOForwardLights.SPOT_LIGHT_COLOR_OFFSET + i * 4);
            }
        }

        // update ubos
        this._builtinBindings.get(UBOForwardLights.BLOCK.name)!.buffer!.update(this._uboLights.view);
    }
}
