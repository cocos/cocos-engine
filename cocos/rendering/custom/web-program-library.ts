/* eslint-disable max-len */
import { EffectAsset } from '../../asset/assets';
import { Attribute, Device, ShaderInfo, Uniform, UniformBlock, UniformInputAttachment, UniformSampler, UniformSamplerTexture, UniformStorageBuffer, UniformStorageImage, UniformTexture } from '../../gfx';
import { getActiveAttributes, getShaderInstanceName, prepareDefines } from '../../render-scene/core/program-utils';
import { getDeviceShaderVersion, getVariantKey, MacroRecord } from '../../render-scene';
import { IProgramInfo } from '../../render-scene/core/program-lib';
import { LayoutGraphData, LayoutGraphDataValue, PipelineLayoutData } from './layout-graph';
import { ProgramLibrary, ProgramProxy } from './private';
import { DescriptorTypeOrder } from './types';
import { ProgramGroup, ProgramHost, ProgramInfo, ProgramLibraryData } from './web-types';

const INVALID_ID = 0xFFFFFFFF;
const _descriptorSetIndex = [3, 2, 1, 0];

function getBitCount (cnt: number) {
    return Math.ceil(Math.log2(Math.max(cnt, 2)));
}

function makeProgramInfo (effectName: string, shader: EffectAsset.IShaderInfo): IProgramInfo {
    const programInfo = { ...shader } as IProgramInfo;
    programInfo.effectName = effectName;

    // calculate option mask offset
    let offset = 0;
    for (const def of programInfo.defines) {
        let cnt = 1;
        if (def.type === 'number') {
            const range = def.range!;
            cnt = getBitCount(range[1] - range[0] + 1); // inclusive on both ends
            def._map = (value: number) => value - range[0];
        } else if (def.type === 'string') {
            cnt = getBitCount(def.options!.length);
            def._map = (value: any) => Math.max(0, def.options!.findIndex((s) => s === value));
        } else if (def.type === 'boolean') {
            def._map = (value: any) => (value ? 1 : 0);
        }
        def._offset = offset;
        offset += cnt;
    }
    if (offset > 31) {
        programInfo.uber = true;
    }
    // generate constant macros
    programInfo.constantMacros = '';
    for (const key in shader.builtins.statistics) {
        programInfo.constantMacros += `#define ${key} ${shader.builtins.statistics[key]}\n`;
    }
    return programInfo;
}

function getCustomPassID (lg: LayoutGraphData, name: string | undefined): number {
    return lg.locateChild(lg.nullVertex(), name || 'default');
}

function getCustomPhaseID (lg: LayoutGraphData, passID: number, name: string | number | undefined): number {
    if (name === undefined) {
        return lg.locateChild(passID, 'default');
    }
    if (typeof (name) === 'number') {
        return lg.locateChild(passID, name.toString());
    }
    return lg.locateChild(passID, name);
}

function makeShaderInfo (layouts: PipelineLayoutData, srcShaderInfo: EffectAsset.IShaderInfo): ShaderInfo {
    const shaderInfo = new ShaderInfo();
    for (const [rate, data] of layouts.descriptorSets) {
        const set = _descriptorSetIndex[rate];
        const layout = data.descriptorSetLayoutData;
        const descriptorInfo = srcShaderInfo.descriptors[rate];

        for (const descriptorBlock of layout.descriptorBlocks) {
            const visibility = descriptorBlock.visibility;
            let binding = descriptorBlock.offset;

            switch (descriptorBlock.type) {
            case DescriptorTypeOrder.UNIFORM_BUFFER:
                for (const ub of descriptorInfo.blocks) {
                    if (ub.stageFlags !== visibility) {
                        continue;
                    }
                    shaderInfo.blocks.push(
                        new UniformBlock(set, binding, ub.name,
                            ub.members.map((m) => new Uniform(m.name, m.type, m.count)),
                            1), // count is always 1 for UniformBlock
                    );
                    ++binding;
                }
                break;
            case DescriptorTypeOrder.DYNAMIC_UNIFORM_BUFFER:
                // not implemented yet
                break;
            case DescriptorTypeOrder.SAMPLER_TEXTURE:
                for (const tex of descriptorInfo.samplerTextures) {
                    if (tex.stageFlags !== visibility) {
                        continue;
                    }
                    shaderInfo.samplerTextures.push(new UniformSamplerTexture(
                        set, binding, tex.name, tex.type, tex.count,
                    ));
                    ++binding;
                }
                break;
            case DescriptorTypeOrder.SAMPLER:
                for (const sampler of descriptorInfo.samplers) {
                    if (sampler.stageFlags !== visibility) {
                        continue;
                    }
                    shaderInfo.samplers.push(new UniformSampler(
                        set, binding, sampler.name, sampler.count,
                    ));
                    ++binding;
                }
                break;
            case DescriptorTypeOrder.TEXTURE:
                for (const texture of descriptorInfo.textures) {
                    if (texture.stageFlags !== visibility) {
                        continue;
                    }
                    shaderInfo.textures.push(new UniformTexture(
                        set, binding, texture.name, texture.type, texture.count,
                    ));
                    ++binding;
                }
                break;
            case DescriptorTypeOrder.STORAGE_BUFFER:
                for (const buffer of descriptorInfo.buffers) {
                    if (buffer.stageFlags !== visibility) {
                        continue;
                    }
                    shaderInfo.buffers.push(new UniformStorageBuffer(
                        set, binding, buffer.name, 1, buffer.memoryAccess,
                    )); // effect compiler guarantees buffer count = 1
                    ++binding;
                }
                break;
            case DescriptorTypeOrder.DYNAMIC_STORAGE_BUFFER:
                // not implemented yet
                break;
            case DescriptorTypeOrder.STORAGE_IMAGE:
                for (const image of descriptorInfo.images) {
                    if (image.stageFlags !== visibility) {
                        continue;
                    }
                    shaderInfo.images.push(new UniformStorageImage(
                        set, binding, image.name, image.type, image.count, image.memoryAccess,
                    ));
                    ++binding;
                }
                break;
            case DescriptorTypeOrder.INPUT_ATTACHMENT:
                for (const subpassInput of descriptorInfo.subpassInputs) {
                    if (subpassInput.stageFlags !== visibility) {
                        continue;
                    }
                    shaderInfo.subpassInputs.push(new UniformInputAttachment(
                        set, subpassInput.binding, subpassInput.name, subpassInput.count,
                    ));
                    ++binding;
                }
                break;
            default:
            }
        }
    }
    return shaderInfo;
}

class WebProgramProxy implements ProgramProxy {
    constructor (host: ProgramHost) {
        this.host = host;
    }
    get name (): string {
        return this.host.program.name;
    }
    host: ProgramHost;
}

export class WebProgramLibrary extends ProgramLibraryData implements ProgramLibrary {
    constructor (lg: LayoutGraphData) {
        super(lg);
        for (const v of lg.vertices()) {
            if (lg.holds(LayoutGraphDataValue.RenderPhase, v)) {
                this.phases.set(v, new ProgramGroup());
            }
        }
    }
    addEffect (effect: EffectAsset): void {
        const lg = this.layoutGraph;
        for (const tech of effect.techniques) {
            for (const pass of tech.passes) {
                const programName = pass.program;
                // pass
                const passID = getCustomPassID(this.layoutGraph, pass.pass);
                if (passID === INVALID_ID) {
                    console.error(`Invalid render pass, program: ${programName}`);
                    continue;
                }
                // phase
                const phaseID = getCustomPhaseID(this.layoutGraph, passID, pass.phase);
                if (phaseID === INVALID_ID) {
                    console.error(`Invalid render phase, program: ${programName}`);
                    continue;
                }
                const layouts = lg.getLayout(phaseID);

                // programs
                const group = this.phases.get(phaseID);
                if (group === undefined) {
                    console.error(`Invalid render phase, program: ${programName}`);
                    continue;
                }
                const phasePrograms = group.programInfos;

                // source shader info
                let srcShaderInfo: EffectAsset.IShaderInfo | null = null;
                for (const shaderInfo of effect.shaders) {
                    if (shaderInfo.name === programName) {
                        srcShaderInfo = shaderInfo;
                        break;
                    }
                }
                if (!srcShaderInfo) {
                    console.error(`program: ${programName} not found`);
                    continue;
                }
                if (srcShaderInfo.descriptors === undefined) {
                    console.error(`No descriptors in shader: ${programName}, please reimport ALL effects`);
                    continue;
                }

                // build program
                const programInfo = makeProgramInfo(effect.name, srcShaderInfo);
                const shaderInfo = makeShaderInfo(layouts, srcShaderInfo);
                const info = new ProgramInfo(programInfo, shaderInfo);
                for (let i = 0; i < programInfo.attributes.length; i++) {
                    const attr = programInfo.attributes[i];
                    info.attributes.push(new Attribute(
                        attr.name, attr.format, attr.isNormalized, 0, attr.isInstanced, attr.location,
                    ));
                }
                phasePrograms.set(srcShaderInfo.name, info);
            }
        }
    }
    getProgramVariant (device: Device, phaseID: number, name: string, defines: MacroRecord, key: string | null = null): ProgramProxy | null {
        // get phase
        const group = this.phases.get(phaseID);
        if (group === undefined) {
            console.error(`Invalid render phase, program: ${name}`);
            return null;
        }
        // get info
        const info = group.programInfos.get(name);
        if (info === undefined) {
            console.error(`Invalid program, program: ${name}`);
            return null;
        }
        const programInfo = info.programInfo;
        if (key === null) {
            key = getVariantKey(programInfo, defines);
        }

        // try get program
        const programHosts = group.programHosts;
        const programHost = programHosts.get(key);
        if (programHost !== undefined) {
            return new WebProgramProxy(programHost);
        }

        // prepare variant
        const macroArray = prepareDefines(defines, programInfo.defines);
        const prefix = this.constantMacros + programInfo.constantMacros
        + macroArray.reduce((acc, cur) => `${acc}#define ${cur.name} ${cur.value}\n`, '');

        let src = programInfo.glsl3;
        const deviceShaderVersion = getDeviceShaderVersion(device);
        if (deviceShaderVersion) {
            src = programInfo[deviceShaderVersion];
        } else {
            console.error('Invalid GFX API!');
        }

        // prepare shader info
        const shaderInfo = info.shaderInfo;
        shaderInfo.stages[0].source = prefix + src.vert;
        shaderInfo.stages[1].source = prefix + src.frag;
        shaderInfo.attributes = getActiveAttributes(programInfo, info.attributes, defines);
        shaderInfo.name = getShaderInstanceName(name, macroArray);

        // create shader
        const shader = device.createShader(shaderInfo);

        // create program host and register
        const host = new ProgramHost(shader);
        programHosts.set(key, host);

        // create
        return new WebProgramProxy(host);
    }
    constantMacros = '';
}
