/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject, UBOForwardLight, SetIndex } from './define';
import { Light, LightType, SphereLight, SpotLight, DirectionalLight } from '../renderer';
import { getPhaseID } from './pass-phase';
import { PipelineStateManager } from './pipeline-state-manager';
import { DSPool, ShaderPool, PassHandle, PassView, PassPool, SubModelPool, SubModelView } from '../renderer/core/memory-pools';
import { Vec3 } from '../../core/math';
import { RenderView } from './render-view';
import { sphere, intersect } from '../geometry';
import { cullDirectionalLight, cullSphereLight, cullSpotLight } from './culling';
import { GFXDevice, GFXRenderPass, GFXBuffer, GFXDescriptorSet, IGFXDescriptorSetInfo,
    GFXShader, DESCRIPTOR_BUFFER_TYPE, GFXBufferUsageBit, GFXMemoryUsageBit } from '../gfx';

const _dsInfo: IGFXDescriptorSetInfo = { layout: null! };

function cloneDescriptorSet (device: GFXDevice, src: GFXDescriptorSet) {
    _dsInfo.layout = src.layout;
    const ds = device.createDescriptorSet(_dsInfo);
    const bindings = _dsInfo.layout.bindings;
    for (let i = 0; i < bindings.length; i++) {
        if (bindings[i].descriptorType & DESCRIPTOR_BUFFER_TYPE) {
            ds.bindBuffer(i, src.getBuffer(i));
        } else if (bindings[i].descriptorType & DESCRIPTOR_BUFFER_TYPE) {
            ds.bindSampler(i, src.getSampler(i));
            ds.bindTexture(i, src.getTexture(i));
        }
    }
    return ds;
}

interface ILightPSOCI {
    shader: GFXShader;
    descriptorSet: GFXDescriptorSet;
    hPass: PassHandle;
}

const _tempVec3 = new Vec3();
const _vec4Array = new Float32Array(4);
const _sphere = sphere.create(0, 0, 0, 1);

/**
 * @zh 叠加光照队列。
 */
export class RenderAdditiveLightQueue {

    private _sortedSubModelsArray: SubModel[][] = [];
    private _sortedPSOCIArray: ILightPSOCI[][] = [];

    private _validLights: Light[] = [];
    private _lightBuffers: GFXBuffer[] = [];
    private _lightIndexOffsets: number[] = [];
    private _lightIndices: number[] = [];
    private _uboLight: UBOForwardLight = new UBOForwardLight();

    private _device: GFXDevice;
    private _isHDR: boolean;
    private _fpScale: number;
    private _renderObjects: IRenderObject[];
    private _lightMeterScale: number = 10000.0;

    constructor (device: GFXDevice, isHDR: boolean, fpScale: number, renderObjects: IRenderObject[]) {
        this._device = device;
        this._isHDR = isHDR;
        this._fpScale = fpScale;
        this._renderObjects = renderObjects;
    }

    public sceneCulling (view: RenderView) {

        const validLights = this._validLights;
        const lightBuffers = this._lightBuffers;
        const lightIndexOffsets = this._lightIndexOffsets;
        const lightIndices = this._lightIndices;

        validLights.length = lightIndexOffsets.length = lightIndices.length = 0;
        const sphereLights = view.camera.scene!.sphereLights;

        for (let i = 0; i < sphereLights.length; i++) {
            const light = sphereLights[i];
            light.update();
            sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphere_frustum(_sphere, view.camera.frustum)) {
                validLights.push(light);
            }
        }
        const spotLights = view.camera.scene!.spotLights;
        for (let i = 0; i < spotLights.length; i++) {
            const light = spotLights[i];
            light.update();
            sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphere_frustum(_sphere, view.camera.frustum)) {
                validLights.push(light);
            }
        }

        if (validLights.length > lightBuffers.length) {
            for (let l = lightBuffers.length; l < validLights.length; ++l) {
                const lightBuffer: GFXBuffer = this._device.createBuffer({
                    usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
                    memUsage: GFXMemoryUsageBit.HOST | GFXMemoryUsageBit.DEVICE,
                    size: UBOForwardLight.SIZE,
                    stride: UBOForwardLight.SIZE,
                });
                lightBuffers.push(lightBuffer);
            }
        }

        this._sortedSubModelsArray.length = this._sortedPSOCIArray.length = validLights.length;
        for(let i = 0; i < validLights.length; ++i) {
            if (this._sortedPSOCIArray[i]) {
                this._sortedSubModelsArray[i].length = 0;
                this._sortedPSOCIArray[i].length = 0;
            } else {
                this._sortedSubModelsArray[i] = [];
                this._sortedPSOCIArray[i] = [];
            }
        }

        if (validLights.length > 0) {
            for (let i = 0; i < this._renderObjects.length; i++) {
                const model = this._renderObjects[i].model;

                lightIndexOffsets[i] = lightIndices.length;

                if (model.node) {
                    model.node.getWorldPosition(_tempVec3);
                } else {
                    _tempVec3.set(0.0, 0.0, 0.0);
                }
                for (let j = 0; j < validLights.length; j++) {
                    let isCulled = false;
                    switch (validLights[j].type) {
                        case LightType.DIRECTIONAL:
                            isCulled = cullDirectionalLight(validLights[j] as DirectionalLight, model);
                            break;
                        case LightType.SPHERE:
                            isCulled = cullSphereLight(validLights[j] as SphereLight, model);
                            break;
                        case LightType.SPOT:
                            isCulled = cullSpotLight(validLights[j] as SpotLight, model);
                            break;
                    }
                    if (!isCulled) {
                        lightIndices.push(j);
                    }
                }
            }
        }
    }

    public updateUBOs (view: RenderView) {
        const exposure = view.camera.exposure;
        // Fill UBOForwardLight, And update LightGFXBuffer[light_index]
        for(let l = 0; l < this._validLights.length; ++l) {
            this._uboLight.view.fill(0);
            const light = this._validLights[l];
            if (light) {
                switch (light.type) {
                    case LightType.SPHERE:
                        const sphereLit = light as SphereLight;
                        Vec3.toArray(_vec4Array, sphereLit.position);
                        _vec4Array[3] = 0;
                        this._uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_POS_OFFSET);

                        _vec4Array[0] = sphereLit.size;
                        _vec4Array[1] = sphereLit.range;
                        _vec4Array[2] = 0.0;
                        this._uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET);

                        Vec3.toArray(_vec4Array, light.color);
                        if (light.useColorTemperature) {
                            const tempRGB = light.colorTemperatureRGB;
                            _vec4Array[0] *= tempRGB.x;
                            _vec4Array[1] *= tempRGB.y;
                            _vec4Array[2] *= tempRGB.z;
                        }
                        if (this._isHDR) {
                            _vec4Array[3] = sphereLit.luminance * this._fpScale * this._lightMeterScale;
                        } else {
                            _vec4Array[3] = sphereLit.luminance * exposure * this._lightMeterScale;
                        }
                        this._uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_COLOR_OFFSET);
                    break;
                    case LightType.SPOT:
                        const spotLit = light as SpotLight;

                        Vec3.toArray(_vec4Array, spotLit.position);
                        _vec4Array[3] = 1;
                        this._uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_POS_OFFSET);

                        _vec4Array[0] = spotLit.size;
                        _vec4Array[1] = spotLit.range;
                        _vec4Array[2] = spotLit.spotAngle;
                        this._uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_SIZE_RANGE_ANGLE_OFFSET);

                        Vec3.toArray(_vec4Array, spotLit.direction);
                        this._uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_DIR_OFFSET);

                        Vec3.toArray(_vec4Array, light.color);
                        if (light.useColorTemperature) {
                            const tempRGB = light.colorTemperatureRGB;
                            _vec4Array[0] *= tempRGB.x;
                            _vec4Array[1] *= tempRGB.y;
                            _vec4Array[2] *= tempRGB.z;
                        }
                        if (this._isHDR) {
                            _vec4Array[3] = spotLit.luminance * this._fpScale * this._lightMeterScale;
                        } else {
                            _vec4Array[3] = spotLit.luminance * exposure * this._lightMeterScale;
                        }
                        this._uboLight.view.set(_vec4Array, UBOForwardLight.LIGHT_COLOR_OFFSET);
                    break;
                }
            }
            // update lightBuffer
            this._lightBuffers[l].update(this._uboLight.view);
        }
    }

    public add (roIdx: number, subModelIdx: number, passIdx: number) {
        const renderObj = this._renderObjects[roIdx];
        const subModel = renderObj.model.subModels[subModelIdx];
        const shader = ShaderPool.get(SubModelPool.get(subModel.handle, SubModelView.SHADER_0 + passIdx));
        const pass = subModel.passes[passIdx];
        const offsets = this._lightIndexOffsets;
        const begIdx = offsets[roIdx];
        const endIdx = roIdx + 1 < this._renderObjects.length ? offsets[roIdx + 1] : this._lightIndices.length;

        for (let i = begIdx; i < endIdx; i++) {
            const lightIdx = this._lightIndices[i];
            const lightBuffer = this._lightBuffers[lightIdx];
            const subModelList = this._sortedSubModelsArray[lightIdx];
            const psoCIList = this._sortedPSOCIArray[lightIdx];

            // TODO: cache & reuse
            const descriptorSet = cloneDescriptorSet(pass.device, subModel.descriptorSet);
            descriptorSet.bindBuffer(UBOForwardLight.BLOCK.binding, lightBuffer);
            descriptorSet.update();

            subModelList.push(subModel);
            psoCIList.push({ hPass: pass.handle, shader, descriptorSet });
        }
    }

    public recordCommandBuffer (device: GFXDevice, renderPass: GFXRenderPass, cmdBuff: GFXCommandBuffer) {
        for (let i = 0; i < this._sortedPSOCIArray.length; ++i) {
            for (let j = 0; j < this._sortedPSOCIArray[i].length; ++j) {
                const psoCI = this._sortedPSOCIArray[i][j];
                const ia = this._sortedSubModelsArray[i][j].inputAssembler!;
                const pso = PipelineStateManager.getOrCreatePipelineState(device, psoCI.hPass, psoCI.shader, renderPass, ia);
                cmdBuff.bindPipelineState(pso);
                cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, DSPool.get(PassPool.get(psoCI.hPass, PassView.DESCRIPTOR_SET)));
                cmdBuff.bindDescriptorSet(SetIndex.LOCAL, psoCI.descriptorSet);
                cmdBuff.bindInputAssembler(ia);
                cmdBuff.draw(ia);
            }
        }
    }
}
