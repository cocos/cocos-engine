/* eslint-disable no-loop-func */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { boolean } from '../../data/decorators';
import {
    Format, ComparisonFunc, Address, Filter, TextureType,
    TextureUsageBit, TextureFlagBit, SampleCount, BufferUsageBit, MemoryUsageBit, BufferFlagBit, DescriptorType, ShaderStageFlagBit, BufferInfo, Attribute, InputAssemblerInfo, ShaderInfo, ShaderStage, UniformSamplerTexture, Type, TextureInfo, SamplerInfo, RenderPassInfo, FramebufferInfo,
    Rect, Color, ColorAttachment, LoadOp, StoreOp, TextureViewInfo,
} from '../base/define';
import { Device } from '../base/device';
import { Texture } from '../base/texture';
import { Buffer } from '../base/buffer';
import { nativeLib } from './webgpu-utils';
import { InputAssembler } from '../base/input-assembler';
import { Shader } from '../base/shader';
import { Pipeline } from '../../asset-manager/pipeline';
import { Material, murmurhash2_32_gc, PipelineStateManager } from '../..';
import { Framebuffer, PipelineState, RenderPass, Sampler } from '..';
import { SetIndex } from '../../pipeline/define';
import load from '../../asset-manager/load';

export function toWGPUNativeFormat (format: Format) {
    switch (format) {
        case Format.RGBA8:
            return nativeLib.Format.RGBA8;
        case Format.BGRA8:
            return nativeLib.Format.BGRA8;
        case Format.DEPTH:
            return nativeLib.Format.DEPTH;
        case Format.DEPTH_STENCIL:
            return nativeLib.Format.DEPTH_STENCIL;
        default:
            console.log('unsupport format');
    }
}

export function toWGPUNativeTextureType (type: TextureType) {
    switch (type) {
        case TextureType.TEX1D:
            return nativeLib.TextureType.TEX1D;
        case TextureType.TEX2D:
            return nativeLib.TextureType.TEX2D;
        case TextureType.TEX3D:
            return nativeLib.TextureType.TEX3D;
        case TextureType.CUBE:
            return nativeLib.TextureType.CUBE;
        case TextureType.TEX1D_ARRAY:
            return nativeLib.TextureType.TEX1D_ARRAY;
        case TextureType.TEX2D_ARRAY:
            return nativeLib.TextureType.TEX2D_ARRAY;
        default:
            console.log('unsupport texture type');
    }
}

export function toWGPUNativeTextureUsage (usage: TextureUsageBit) {
    let result = nativeLib.TextureUsage.NONE;
    if (usage === TextureUsageBit.NONE) {
        return result;
    }

    if (usage & TextureUsageBit.TRANSFER_SRC) {
        result |= nativeLib.TextureUsage.TRANSFER_SRC;
    }

    if (usage & TextureUsageBit.TRANSFER_DST) {
        result |= nativeLib.TextureUsage.TRANSFER_DST;
    }

    if (usage & TextureUsageBit.SAMPLED) {
        result |= nativeLib.TextureUsage.SAMPLED;
    }

    if (usage & TextureUsageBit.STORAGE) {
        result |= nativeLib.TextureUsage.STORAGE;
    }

    if (usage & TextureUsageBit.COLOR_ATTACHMENT) {
        result |= nativeLib.TextureUsage.COLOR_ATTACHMENT;
    }

    if (usage & TextureUsageBit.DEPTH_STENCIL_ATTACHMENT) {
        result |= nativeLib.TextureUsage.DEPTH_STENCIL_ATTACHMENT;
    }

    if (usage & TextureUsageBit.INPUT_ATTACHMENT) {
        result |= nativeLib.TextureUsage.INPUT_ATTACHMENT;
    }
    return result;
}

export function toWGPUTextureFlag (flag: TextureFlagBit) {
    switch (flag) {
        case TextureFlagBit.NONE:
            return nativeLib.TextureFlags.NONE;
        case TextureFlagBit.GEN_MIPMAP:
            return nativeLib.TextureFlags.GEN_MIPMAP;
        case TextureFlagBit.GENERAL_LAYOUT:
            return nativeLib.TextureFlags.GENERAL_LAYOUT;
        default:
            console.log('unsupport texture flag');
    }
}

export function toWGPUTextureSampleCount (sample: SampleCount) {
    switch (sample) {
        case SampleCount.ONE:
            return nativeLib.SampleCount.ONE;
        case SampleCount.MULTIPLE_PERFORMANCE:
            return nativeLib.SampleCount.MULTIPLE_PERFORMANCE;
        case SampleCount.MULTIPLE_BALANCE:
            return nativeLib.SampleCount.MULTIPLE_BALANCE;
        case SampleCount.MULTIPLE_QUALITY:
            return nativeLib.SampleCount.MULTIPLE_QUALITY;
        default:
            console.log('unsupport texture sample count');
    }
}

export function toWGPUNativeBufferUsage (usage: BufferUsageBit) {
    let result = nativeLib.BufferUsage.NONE;
    if (usage === BufferUsageBit.NONE) {
        return result;
    }

    if (usage & BufferUsageBit.TRANSFER_SRC) {
        result |= nativeLib.BufferUsage.TRANSFER_SRC;
    }

    if (usage & BufferUsageBit.TRANSFER_DST) {
        result |= nativeLib.BufferUsage.TRANSFER_DST;
    }

    if (usage & BufferUsageBit.INDEX) {
        result |= nativeLib.BufferUsage.INDEX;
    }

    if (usage & BufferUsageBit.VERTEX) {
        result |= nativeLib.BufferUsage.VERTEX;
    }

    if (usage & BufferUsageBit.UNIFORM) {
        result |= nativeLib.BufferUsage.UNIFORM;
    }

    if (usage & BufferUsageBit.STORAGE) {
        result |= nativeLib.BufferUsage.STORAGE;
    }

    if (usage & BufferUsageBit.INDIRECT) {
        result |= nativeLib.BufferUsage.INDIRECT;
    }
    return result;
}

export function toWGPUNativeBufferMemUsage (memUsage: MemoryUsageBit) {
    let result = nativeLib.MemoryUsage.NONE;
    if (memUsage === MemoryUsageBit.NONE) {
        return result;
    }

    if (memUsage & MemoryUsageBit.DEVICE) {
        result |= nativeLib.MemoryUsage.DEVICE;
    }

    if (memUsage & MemoryUsageBit.HOST) {
        result |= nativeLib.MemoryUsage.HOST;
    }
    return result;
}

export function toWGPUNativeBufferFlag (flag: BufferFlagBit) {
    switch (flag) {
        case BufferFlagBit.NONE:
            return nativeLib.BufferFlags.NONE;
        default:
            console.log('unsupport buffer memory usage');
    }
}

export function toWGPUNativeDescriptorType (descType: DescriptorType) {
    switch (descType) {
        case DescriptorType.UNKNOWN:
            return nativeLib.DescriptorType.UNKNOWN;
        case DescriptorType.UNIFORM_BUFFER:
            return nativeLib.DescriptorType.UNIFORM_BUFFER;
        case DescriptorType.DYNAMIC_UNIFORM_BUFFER:
            return nativeLib.DescriptorType.DYNAMIC_UNIFORM_BUFFER;
        case DescriptorType.STORAGE_BUFFER:
            return nativeLib.DescriptorType.STORAGE_BUFFER;
        case DescriptorType.DYNAMIC_STORAGE_BUFFER:
            return nativeLib.DescriptorType.DYNAMIC_STORAGE_BUFFER;
        case DescriptorType.SAMPLER_TEXTURE:
            return nativeLib.DescriptorType.SAMPLER_TEXTURE;
        case DescriptorType.SAMPLER:
            return nativeLib.DescriptorType.SAMPLER;
        case DescriptorType.TEXTURE:
            return nativeLib.DescriptorType.TEXTURE;
        case DescriptorType.STORAGE_IMAGE:
            return nativeLib.DescriptorType.STORAGE_IMAGE;
        case DescriptorType.INPUT_ATTACHMENT:
            return nativeLib.DescriptorType.INPUT_ATTACHMENT;
        default:
            console.log('unsupport descriptor type');
    }
}

export function toWGPUNativeStageFlags (flags: ShaderStageFlagBit) {
    let result;
    if (flags === ShaderStageFlagBit.NONE) { return result; }

    if (flags & ShaderStageFlagBit.VERTEX || flags & ShaderStageFlagBit.ALL) {
        result |= nativeLib.ShaderStageFlags.VERTEX;
    }
    if (flags & ShaderStageFlagBit.CONTROL || flags & ShaderStageFlagBit.ALL) {
        result |= nativeLib.ShaderStageFlags.CONTROL;
    }
    if (flags & ShaderStageFlagBit.EVALUATION || flags & ShaderStageFlagBit.ALL) {
        result |= nativeLib.ShaderStageFlags.EVALUATION;
    }
    if (flags & ShaderStageFlagBit.GEOMETRY || flags & ShaderStageFlagBit.ALL) {
        result |= nativeLib.ShaderStageFlags.GEOMETRY;
    }
    if (flags & ShaderStageFlagBit.FRAGMENT || flags & ShaderStageFlagBit.ALL) {
        result |= nativeLib.ShaderStageFlags.FRAGMENT;
    }
    if (flags & ShaderStageFlagBit.COMPUTE || flags & ShaderStageFlagBit.ALL) {
        result |= nativeLib.ShaderStageFlags.COMPUTE;
    }

    return result;
}

export function toWGPUNativeFilter (filter: Filter) {
    switch (filter) {
        case Filter.NONE:
            return nativeLib.Filter.NONE;
        case Filter.POINT:
            return nativeLib.Filter.POINT;
        case Filter.LINEAR:
            return nativeLib.Filter.LINEAR;
        case Filter.ANISOTROPIC:
            return nativeLib.Filter.ANISOTROPIC;
        default:
            console.log('unsupport filter');
    }
}

export function toWGPUNativeAddressMode (address: Address) {
    switch (address) {
        case Address.WRAP:
            return nativeLib.Address.WRAP;
        case Address.MIRROR:
            return nativeLib.Address.MIRROR;
        case Address.CLAMP:
            return nativeLib.Address.CLAMP;
        case Address.BORDER:
            return nativeLib.Address.BORDER;
        default:
            console.log('unsupport address mode');
    }
}

export function toWGPUNativeCompareFunc (cmpFunc: ComparisonFunc) {
    switch (cmpFunc) {
        case ComparisonFunc.NEVER:
            return nativeLib.ComparisonFunc.NEVER;
        case ComparisonFunc.LESS:
            return nativeLib.ComparisonFunc.LESS;
        case ComparisonFunc.EQUAL:
            return nativeLib.ComparisonFunc.EQUAL;
        case ComparisonFunc.LESS_EQUAL:
            return nativeLib.ComparisonFunc.LESS_EQUAL;
        case ComparisonFunc.GREATER:
            return nativeLib.ComparisonFunc.GREATER;
        case ComparisonFunc.NOT_EQUAL:
            return nativeLib.ComparisonFunc.NOT_EQUAL;
        case ComparisonFunc.GREATER_EQUAL:
            return nativeLib.ComparisonFunc.GREATER_EQUAL;
        case ComparisonFunc.ALWAYS:
            return nativeLib.ComparisonFunc.ALWAYS;
        default:
            console.log('unsupport compare func');
    }
}

export const mipMapVert = `
in vec2 a_position;
in vec2 a_uv;
out vec2 uv;
void main() {
    gl_Position = a_position;
}
`;

export const mipmapFrag = `
in vec2 uv;
layout(set = 0, binding = 0) uniform sampler2D srcTex;
layout(location = 0) out vec4 fragColor;
void main () {
    fragColor = texture(srcTex, uv);
}
`;

export class MipmapPipelineCache {
    declare private _token: never;
    public static mipmapTexCache: Map<number, Texture> = new Map();
    constructor (
        public vertBuffer: Buffer = null!,
        public indicesBuffer: Buffer = null!,
        public inputAssembler: InputAssembler = null!,
        public shader: Shader = null!,
        public pipelineState: PipelineState = null!,
        public material: Material = null!,
        public renderPass: RenderPass = null!,
        public sampler: Sampler = null!,
        // public frameBuffer: Framebuffer = null!,
    ) { }
}

const mipmapCache = new MipmapPipelineCache();

export function genMipmap (device: Device, srcTex: Texture): Texture {
    const quadVert = new Float32Array([-1.0, -1.0, 0.0, 0.0, 1.0, -1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 0.0, 1.0]);
    const vertStride = Float32Array.BYTES_PER_ELEMENT * 4;
    const vertSize = quadVert.byteLength;
    if (!mipmapCache.vertBuffer) {
        mipmapCache.vertBuffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE, vertSize, vertStride,
        ));
        mipmapCache.vertBuffer.update(quadVert);

        const quadIndex = new Uint16Array([0, 1, 2, 0, 2, 3]);
        const indexStride = Uint16Array.BYTES_PER_ELEMENT;
        const indexSize = quadIndex.byteLength;
        mipmapCache.indicesBuffer = device.createBuffer(new BufferInfo(
            BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE, indexSize, indexStride,
        ));
        mipmapCache.indicesBuffer.update(quadIndex);

        const attributes: Attribute[] = [
            new Attribute('a_position', Format.RG32F),
            new Attribute('a_texCoord', Format.RG32F),
        ];
        const IAInfo = new InputAssemblerInfo(attributes, [mipmapCache.vertBuffer], (mipmapCache.indicesBuffer));
        mipmapCache.inputAssembler = device.createInputAssembler(IAInfo);

        mipmapCache.material = new Material();
        mipmapCache.material.initialize({ effectName: 'genmipmap' });

        const rpInfo = new RenderPassInfo([new ColorAttachment(Format.RGBA8, SampleCount.ONE, LoadOp.CLEAR, StoreOp.STORE)]);
        mipmapCache.renderPass = device.createRenderPass(rpInfo);
    }

    const pass = mipmapCache.material.passes[0];
    mipmapCache.shader = pass.getShaderVariant()!;

    const mainTexBinding = pass.getBinding('mainTexture');
    const samplerInfo = new SamplerInfo(
        Filter.LINEAR,
        Filter.LINEAR,
        Filter.LINEAR,
        Address.WRAP,
        Address.WRAP,
        Address.WRAP,
    );
    mipmapCache.sampler = device.getSampler(samplerInfo);

    pass.bindSampler(mainTexBinding, mipmapCache.sampler);
    pass.bindTexture(mainTexBinding, srcTex);

    const lodInfo = new TextureInfo(
        TextureType.TEX2D,
        TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.TRANSFER_SRC | TextureUsageBit.SAMPLED,
        Format.RGBA8,
        srcTex.width / 2,
        srcTex.height / 2,
    );

    const hashStr = `${lodInfo.type}-${lodInfo.format}-${lodInfo.width}-${lodInfo.height}`;
    const hash = murmurhash2_32_gc(hashStr, 999);
    let lodTex;

    if (!MipmapPipelineCache.mipmapTexCache.has(hash)) {
        lodTex = device.createTexture(lodInfo);
        MipmapPipelineCache.mipmapTexCache.set(hash, lodTex);
    } else {
        lodTex = MipmapPipelineCache.mipmapTexCache.get(hash);
    }

    // lodInfo.width = srcTex.width / 4;
    // lodInfo.height = srcTex.height / 4;
    // const lod1Tex = device.createTexture(lodInfo);

    // lodInfo.width = srcTex.width / 8;
    // lodInfo.height = srcTex.height / 8;
    // const lod2Tex = device.createTexture(lodInfo);

    // lodInfo.width = srcTex.width / 16;
    // lodInfo.height = srcTex.height / 16;
    // const lod3Tex = device.createTexture(lodInfo);

    // const lod0binding = pass.getBinding('mainTexture');
    // const lod1binding = pass.getBinding('LODTex1');
    // const lod2binding = pass.getBinding('LODTex2');
    // const lod3binding = pass.getBinding('LODTex3');

    // pass.bindTexture(lod0binding, lod0Tex);
    // pass.bindTexture(lod1binding, lod1Tex);
    // pass.bindTexture(lod2binding, lod2Tex);
    // pass.bindTexture(lod3binding, lod3Tex);

    pass.descriptorSet.update();

    const fbInfo = new FramebufferInfo(mipmapCache.renderPass, [lodTex]);
    const frameBuffer = device.createFramebuffer(fbInfo);

    const clearColor = new Color();
    const renderArea = new Rect(0, 0, srcTex.width, srcTex.height);
    const cmdBuff = device.commandBuffer;
    // cmdBuff.begin();
    cmdBuff.beginRenderPass(
        mipmapCache.renderPass,
        frameBuffer,
        renderArea,
        [clearColor],
        1,
        0,
    );
    const pso = PipelineStateManager.getOrCreatePipelineState(
        device,
        pass,
        mipmapCache.shader,
        mipmapCache.renderPass,
        mipmapCache.inputAssembler,
    );
    cmdBuff.bindPipelineState(pso);
    cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
    cmdBuff.bindInputAssembler(mipmapCache.inputAssembler);
    cmdBuff.draw(mipmapCache.inputAssembler);
    cmdBuff.endRenderPass();
    // cmdBuff.end();
    device.flushCommands([cmdBuff]);
    device.queue.submit([cmdBuff]);

    frameBuffer.destroy();

    return lodTex;
}

export function removeCombinedSamplerTexture (shaderSource: string) {
    // sampler and texture
    const samplerTexturArr = shaderSource.match(/(.*?)\(set = \d+, binding = \d+\) uniform(.*?)sampler\w* \w+;/g);
    const count = samplerTexturArr?.length ? samplerTexturArr?.length : 0;
    let code = shaderSource;

    const referredFuncSet = new Set<[fnName: string, samplerType: string]>();
    const samplerTypeSet = new Set<string>();
    samplerTexturArr?.every((str) => {
        const textureName = str.match(/(?<=uniform(.*?)sampler\w* )(\w+)(?=;)/g)!.toString();
        let samplerStr = str.replace(textureName, `${textureName}Sampler`);
        let samplerFunc = samplerStr.match(/(?<=uniform(.*?))sampler(\w*)/g)!.toString();
        samplerFunc = samplerFunc.replace('sampler', '');
        samplerStr = samplerStr.replace(/(?<=uniform(.*?))(sampler\w*)/g, 'sampler');

        // layout (set = a, binding = b) uniform sampler2D cctex;
        // to:
        // layout (set = a, binding = b) uniform sampler cctexSampler;
        // layout (set = a, binding = b + maxTextureNum) uniform texture2D cctex;
        const samplerReg = /(?<=binding = )(\d+)(?=\))/g;
        const samplerBindingStr = str.match(samplerReg)!.toString();
        const samplerBinding = Number(samplerBindingStr) + 16;
        samplerStr = samplerStr.replace(samplerReg, samplerBinding.toString());

        const textureStr = str.replace(/(?<=uniform(.*?))(sampler)(?=\w*)/g, 'texture');
        code = code.replace(str, `${samplerStr}\n${textureStr}`);

        if (!samplerTypeSet.has(samplerFunc)) {
            samplerTypeSet.add(samplerFunc);
            // gathering referred func
            const referredFuncStr = `([\\w]+)[\\s]*\\(sampler${samplerFunc}[^\\)]+\\)[\\s]*{`;
            const referredFuncRe = new RegExp(referredFuncStr, 'g');
            let reArr = referredFuncRe.exec(code);
            while (reArr) {
                referredFuncSet.add([reArr[1], samplerFunc]);
                reArr = referredFuncRe.exec(code);
            }
        }

        // cctex in main() called directly
        // .*?texture\(
        const regStr = `texture\\(\\b(${textureName})\\b`;
        const re = new RegExp(regStr);
        let reArr = re.exec(code);
        while (reArr) {
            code = code.replace(re, `texture(sampler${samplerFunc}(${textureName},${textureName}Sampler)`);
            reArr = re.exec(code);
        }
        return true;
    });

    // function
    referredFuncSet.forEach((pair) => {
        // 1. fn definition
        const fnDefReStr = `${pair[0]}[\\s]*\\(sampler${pair[1]}[^}]+}`;
        const fnDefRe = new RegExp(fnDefReStr);
        let fnArr = fnDefRe.exec(code);
        while (fnArr) {
            const samplerType = `sampler${pair[1]}`;
            const textureRe = (new RegExp(`.*?${samplerType}[\\s]+([\\S]+),`)).exec(fnArr[0])!;
            const textureName = textureRe[1];
            const paramReStr = `${samplerType}[\\s]+${textureName}`;
            let funcDef = fnArr[0].replace(new RegExp(paramReStr), `texture${pair[1]} ${textureName}, sampler ${textureName}Sampler`);

            // 2. texture(...) inside, builtin funcs
            const textureOpArr = ['texture', 'textureSize', 'texelFetch', 'textureLod'];
            for (let i = 0; i < textureOpArr.length; i++) {
                const texFuncReStr = `(${textureOpArr[i]})\\(${textureName},`;
                const texFuncRe = new RegExp(texFuncReStr, 'g');
                funcDef = funcDef.replace(texFuncRe, `$1(${samplerType}(${textureName}, ${textureName}Sampler),`);
            }
            code = code.replace(fnDefRe, funcDef);

            fnArr = fnDefRe.exec(code);
        }

        // 3. fn called
        // getVec3DisplacementFromTexture\(([\S]+),[^\)]+
        const calledReStr = `(?<!vec.)${pair[0]}\\(([\\S]+),[\\s]*[^\\)]+`;
        const calledRe = new RegExp(calledReStr, 'g');
        let calledArr = calledRe.exec(code);
        while (calledArr) {
            if (!calledArr[0].includes(`${calledArr[1]}, ${calledArr[1]}Sampler`)) {
                const calledStr = calledArr[0].replace(calledArr[1], `${calledArr[1]}, ${calledArr[1]}Sampler`);
                code = code.replace(calledArr[0], calledStr);
            }
            calledArr = calledRe.exec(code);
        }
    });
    // code = code.replace(/(?<!vec4 )(CCSampleTexture\(.+\))/g, 'CCSampleTexture(cc_spriteTextureSampler, cc_spriteTexture, uv0)');
    return code;
}

export function removeCombinedSamplerTexture0 (shaderSource: string) {
    // sampler and texture
    const samplerTexturArr = shaderSource.match(/(.*?)\(set = \d+, binding = \d+\) uniform(.*?)sampler\w* \w+;/g);
    const count = samplerTexturArr?.length ? samplerTexturArr?.length : 0;
    let code = shaderSource;

    const referredFuncMap = new Map<string, [fnName: string, samplerType: string, samplerName: string]>();
    const samplerSet = new Set<string>();
    samplerTexturArr?.every((str) => {
        const textureName = str.match(/(?<=uniform(.*?)sampler\w* )(\w+)(?=;)/g)!.toString();
        let samplerStr = str.replace(textureName, `${textureName}Sampler`);
        let samplerFunc = samplerStr.match(/(?<=uniform(.*?))sampler(\w*)/g)!.toString();
        samplerFunc = samplerFunc.replace('sampler', '');
        samplerStr = samplerStr.replace(/(?<=uniform(.*?))(sampler\w*)/g, 'sampler');

        // layout (set = a, binding = b) uniform sampler2D cctex;
        // to:
        // layout (set = a, binding = b) uniform sampler cctexSampler;
        // layout (set = a, binding = b + maxTextureNum) uniform texture2D cctex;
        const samplerReg = /(?<=binding = )(\d+)(?=\))/g;
        const samplerBindingStr = str.match(samplerReg)!.toString();
        const samplerBinding = Number(samplerBindingStr) + 16;
        samplerStr = samplerStr.replace(samplerReg, samplerBinding.toString());

        const textureStr = str.replace(/(?<=uniform(.*?))(sampler)(?=\w*)/g, 'texture');
        code = code.replace(str, `${samplerStr}\n${textureStr}`);

        if (!samplerSet.has(`${textureName}Sampler`)) {
            samplerSet.add(`${textureName}Sampler`);
            // gathering referred func
            const referredFuncStr = `([\\w]+)[\\s]*\\(sampler${samplerFunc}[^\\)]+\\)[\\s]*{`;
            const referredFuncRe = new RegExp(referredFuncStr, 'g');
            let reArr = referredFuncRe.exec(code);
            while (reArr) {
                // first to see if it's wrapped by #if 0 \n ... \n #ndif

                const searchTarget = code.slice(0, reArr.index);
                const defValQueue: { str: string, b: boolean }[] = [];
                let searchIndex = 1;

                while (searchIndex > 0) {
                    let ifIndex = searchTarget.indexOf('#if', searchIndex);
                    let elseIndex = searchTarget.indexOf('#else', searchIndex);
                    let endIndex = searchTarget.indexOf('#endif', searchIndex);

                    if (ifIndex === -1) ifIndex = Number.MAX_SAFE_INTEGER;
                    if (elseIndex === -1) elseIndex = Number.MAX_SAFE_INTEGER;
                    if (endIndex === -1) endIndex = Number.MAX_SAFE_INTEGER;

                    if (endIndex < elseIndex && endIndex < ifIndex) {
                        defValQueue.length -= 1;
                    } else if (elseIndex < ifIndex) {
                        defValQueue[defValQueue.length - 1].b = !defValQueue[defValQueue.length - 1].b;
                        searchIndex = elseIndex + 1;
                        continue;
                    }

                    const firstIdx = searchTarget.indexOf('#if', searchIndex);
                    if (firstIdx !== -1) {
                        const ifdef = (new RegExp(`#if[\\s]+(!)?([\\S]+)`, 'gm')).exec(searchTarget.slice(firstIdx))!;
                        if (ifdef[1]) {
                            defValQueue[defValQueue.length] = { str: ifdef[2], b: false };
                        } else {
                            defValQueue[defValQueue.length] = { str: ifdef[2], b: true };
                        }
                    }
                    searchIndex = firstIdx + 1;
                }

                let defCheck = true;
                defValQueue.forEach((pair) => {
                    const defStr = (new RegExp(`#define[\\s]+${pair.str}[\\s]+([\\S]+).*`, 'gm')).exec(searchTarget)![1];
                    if ((defStr !== '0') !== pair.b) {
                        defCheck = false;
                    }
                });

                // const lastElseIndex = searchTarget.lastIndexOf('#else');
                // const lastElifIndex = searchTarget.lastIndexOf('#elif');
                // const lastEndifIndex = searchTarget.lastIndexOf('#endif');
                // const lastIfIndex = searchTarget.lastIndexOf('#if');
                // let defineNoneZero = true;
                // if (lastIfIndex > lastElseIndex && lastIfIndex > lastEndifIndex) {
                //     const ifdefStr = (new RegExp(`#if(?:(?!#if).)+$`, 'gs')).exec(searchTarget)![0];
                //     const varStr = (new RegExp(`#if[\\s]+([\\S]+)`, 'gs')).exec(ifdefStr)![1];
                //     const defStr = (new RegExp(`#define[\\s]+${varStr}[\\s]+([\\S]+).*`, 'gs')).exec(searchTarget)![1];
                //     defineNoneZero = defStr !== '0';
                // }
                const key = `${reArr[1]}_${samplerFunc}_${textureName}Sampler`;
                if (!referredFuncMap.has(key) && defCheck) {
                    referredFuncMap.set(key, [reArr[1], samplerFunc, `${textureName}Sampler`]);
                }
                reArr = referredFuncRe.exec(code);
            }
        }

        // cctex in main() called directly
        // .*?texture\(
        const regStr = `texture\\(\\b(${textureName})\\b`;
        const re = new RegExp(regStr);
        let reArr = re.exec(code);
        while (reArr) {
            code = code.replace(re, `texture(sampler${samplerFunc}(${textureName},${textureName}Sampler)`);
            reArr = re.exec(code);
        }
        return true;
    });

    const functionTemplates = new Map<string, string>();
    const functionDeps = new Map<string, string[]>();
    // function
    referredFuncMap.forEach((pair) => {
        //pre: if existed, replace
        //getVec3DisplacementFromTexture\(cc_TangentDisplacements[^\\n]+
        const textureStr = pair[2].slice(0, -7);
        const codePieceStr = `${pair[0]}\\(${textureStr}[^\\n]+`;
        const codePieceRe = new RegExp(codePieceStr);
        let res = codePieceRe.exec(code);
        while (res) {
            const replaceStr = res[0].replace(`${pair[0]}`, `${pair[0]}_${pair[2]}_specialized`);
            code = code.replace(codePieceRe, replaceStr);
            res = codePieceRe.exec(code);
        }

        // 1. fn definition
        const fnDeclReStr = `[\\n|\\W][\\w]+[\\W]+${pair[0]}[\\s]*\\(sampler${pair[1]}[^{]+`;
        const fnDeclRe = new RegExp(fnDeclReStr);
        const fnDecl = fnDeclRe.exec(code);

        const funcBodyStart = code.slice(fnDecl!.index + fnDecl!.length);

        const funcRedefine = (funcStr: string) => {
            const samplerType = `sampler${pair[1]}`;
            const textureRe = (new RegExp(`.*?${samplerType}[\\s]+([\\S]+),`)).exec(funcStr)!;
            const textureName = textureRe[1];
            const paramReStr = `${samplerType}[\\s]+${textureName}`;
            let funcDef = funcStr.replace(new RegExp(paramReStr), `texture${pair[1]} ${textureName}`);
            funcDef = funcDef.replace(pair[0], `${pair[0]}SAMPLER_SPEC`);
            // 2. texture(...) inside, builtin funcs
            const textureOpArr = ['texture', 'textureSize', 'texelFetch', 'textureLod'];
            for (let i = 0; i < textureOpArr.length; i++) {
                const texFuncReStr = `(${textureOpArr[i]})\\(${textureName},`;
                const texFuncRe = new RegExp(texFuncReStr, 'g');
                funcDef = funcDef.replace(texFuncRe, `$1(${samplerType}(${textureName}, ${textureName}SAMPLER_HOLDER),`);
            }
            return funcDef;
        };

        let redefFunc = '';
        const firstIfStatement = funcBodyStart.indexOf('#if');
        const firstElseStatement = funcBodyStart.indexOf('#e'); //#endif, #else, #elif maybe?
        if ((firstElseStatement !== -1 && firstIfStatement > firstElseStatement) || (firstElseStatement === -1 && firstElseStatement !== -1)) { // ooops, now func body starts in a #if statement.
            let startIndex = 0;
            let count = 1; // already in #if
            while (count > 0 && startIndex < funcBodyStart.length) {
                const nextSymbolIdx = funcBodyStart.indexOf('#', startIndex);
                const startSliceIdx = startIndex === 0 ? startIndex : startIndex - 1;
                if (funcBodyStart[nextSymbolIdx + 1] === 'i') { // #if
                    count++;
                    redefFunc += funcBodyStart.slice(startSliceIdx, nextSymbolIdx);
                } else if (funcBodyStart[nextSymbolIdx + 1] === 'e' && funcBodyStart[nextSymbolIdx + 2] === 'l') { //#elif, #else
                    if (count === 1) {
                        const tempFuncStr = funcBodyStart.slice(startSliceIdx, nextSymbolIdx - 1);
                        const funcDefStr = funcRedefine(tempFuncStr);
                        redefFunc += `\n${funcDefStr}`;
                    } else {
                        redefFunc += `\n${funcBodyStart.slice(startSliceIdx, nextSymbolIdx)}`;
                    }
                } else if (funcBodyStart[nextSymbolIdx + 1] === 'e' && funcBodyStart[nextSymbolIdx + 2] === 'n') { //#endif
                    count--;
                    if (count === 0) {
                        const tempFuncStr = funcBodyStart.slice(startSliceIdx, nextSymbolIdx - 1);
                        const funcDefStr = funcRedefine(tempFuncStr);
                        redefFunc += `\n${funcDefStr}`;
                    } else {
                        redefFunc += `\n${funcBodyStart.slice(startSliceIdx, nextSymbolIdx)}`;
                    }
                } else { // #define, dont care
                    redefFunc += funcBodyStart.slice(startSliceIdx, nextSymbolIdx);
                }
                startIndex = nextSymbolIdx + 1;
            }

            //`(?:.(?!layout))+${pair[2]};`
            const searchTarget = code.slice(0, fnDecl!.index);
            const res = (new RegExp(`#if.+[\\s]*$`)).exec(searchTarget);
            redefFunc = `${res![0]}${redefFunc}\n#endif`;
        } else {
            let count = 0;
            let matchBegin = false;
            let startIndex = 0;
            let endIndex = 0;
            for (let i = 0; i < funcBodyStart.length; ++i) {
                if (funcBodyStart[i] === '{') {
                    ++count;
                    if (!matchBegin) {
                        matchBegin = true;
                        startIndex = i;
                    }
                } else if (funcBodyStart[i] === '}') {
                    --count;
                }

                if (matchBegin && count === 0) {
                    endIndex = i;
                    break;
                }
            }
            const rawFunc = `${fnDecl![0]}${funcBodyStart.slice(startIndex, endIndex + 1)}`;
            redefFunc = funcRedefine(rawFunc);
        }

        functionTemplates.set(pair[0], redefFunc);

        const depsFuncs: string[] = [];

        for (let i = 0; i < referredFuncMap.values.length; ++i) {
            const funcDepReStr = `\\b(${referredFuncMap.values[i].fnName as string})\\b`;
            if (redefFunc.search(funcDepReStr) !== -1) {
                depsFuncs[depsFuncs.length] = referredFuncMap.values[i].fnName;
            }
        }
        functionDeps.set(pair[0], depsFuncs);

        const specializedFuncs = new Map<string, string>();
        const specialize = (funcs: string[]) => {
            funcs.every((str) => {
                if (!specializedFuncs.has(`${pair[0]}_${pair[2]}_specialized`)) {
                    const samplerReStr = `(\\w+)SAMPLER_HOLDER`;
                    let funcTemplate = functionTemplates.get(str);
                    funcTemplate = funcTemplate!.replace(new RegExp(samplerReStr, 'g'), pair[2]);
                    funcTemplate = funcTemplate.replace('SAMPLER_SPEC', `_${pair[2]}_specialized`);

                    for (let i = 0; i < referredFuncMap.values.length; ++i) {
                        const funcDepReStr = `\\b(${referredFuncMap.values[i].fnName as string})\\b`;
                        if (redefFunc.search(funcDepReStr) !== -1) {
                            depsFuncs[depsFuncs.length] = referredFuncMap.values[i].fnName;
                        }
                    }

                    let declStr = fnDecl![0].replace(pair[0], `${str}_${pair[2]}_specialized`);
                    declStr = declStr.replace(`sampler${pair[1]} `, `texture${pair[1]} `);
                    declStr += ';';
                    specializedFuncs.set(declStr, funcTemplate);
                } else {
                    return specialize(functionDeps.get(str)!);
                }
                return true;
            });
            return true;
        };
        specialize([pair[0]]);
        //(?:.(?!layout))+cc_PositionDisplacementsSampler;
        const samplerDefReStr = `(?:.(?!layout))+${pair[2]};`;
        const samplerDef = (new RegExp(samplerDefReStr)).exec(code);

        let funcDecls = '';
        let funcImpls = '';
        for (const [key, value] of specializedFuncs) {
            funcDecls += `\n${key}\n`;
            funcImpls += `\n${value}\n`;
        }

        code = code.replace(samplerDef![0], `${samplerDef![0]}\n${funcDecls}${funcImpls}`);
    });

    return code;
}

// export function removeCombinedSamplerTexture1 (shaderSource: string) {
//     // sampler and texture
//     const samplerTexturArr = shaderSource.match(/(.*?)\(set = \d+, binding = \d+\) uniform(.*?)sampler\w* \w+;/g);
//     const count = samplerTexturArr?.length ? samplerTexturArr?.length : 0;
//     let code = shaderSource;

//     const referredFuncSet = new Set<[fnName: string, samplerType: string]>();
//     const samplerTypeSet = new Set<string>();
//     samplerTexturArr?.every((str) => {
//         const textureName = str.match(/(?<=uniform(.*?)sampler\w* )(\w+)(?=;)/g)!.toString();
//         let samplerStr = str.replace(textureName, `${textureName}Sampler`);
//         let samplerFunc = samplerStr.match(/(?<=uniform(.*?))sampler(\w*)/g)!.toString();
//         samplerFunc = samplerFunc.replace('sampler', '');
//         samplerStr = samplerStr.replace(/(?<=uniform(.*?))(sampler\w*)/g, 'sampler');

//         // layout (set = a, binding = b) uniform sampler2D cctex;
//         // to:
//         // layout (set = a, binding = b) uniform sampler cctexSampler;
//         // layout (set = a, binding = b + maxTextureNum) uniform texture2D cctex;
//         const samplerReg = /(?<=binding = )(\d+)(?=\))/g;
//         const samplerBindingStr = str.match(samplerReg)!.toString();
//         const samplerBinding = Number(samplerBindingStr) + 16;
//         samplerStr = samplerStr.replace(samplerReg, samplerBinding.toString());

//         const textureStr = str.replace(/(?<=uniform(.*?))(sampler)(?=\w*)/g, 'texture');
//         code = code.replace(str, `${samplerStr}\n${textureStr}`);

//         if (!samplerTypeSet.has(samplerFunc)) {
//             samplerTypeSet.add(samplerFunc);
//             // gathering referred func
//             const referredFuncStr = `([\\w]+)[\\s]*\\(sampler${samplerFunc}[^\\)]+\\)[\\s]*{`;
//             const referredFuncRe = new RegExp(referredFuncStr, 'g');
//             let reArr = referredFuncRe.exec(code);
//             while (reArr) {
//                 referredFuncSet.add([reArr[1], samplerFunc]);
//                 reArr = referredFuncRe.exec(code);
//             }
//         }

//         // cctex in main() called directly
//         // .*?texture\(
//         const regStr = `texture\\(\\b(${textureName})\\b`;
//         const re = new RegExp(regStr);
//         let reArr = re.exec(code);
//         while (reArr) {
//             code = code.replace(re, `texture(sampler${samplerFunc}(${textureName},${textureName}Sampler)`);
//             reArr = re.exec(code);
//         }
//         return true;
//     });

//     // function
//     referredFuncSet.forEach((pair) => {
//         // 1. fn definition
//         const fnDefReStr = `[\\\n|\\W]([\\w]+)[\\W]+${pair[0]}[\\s]*\\(sampler${pair[1]}[^}]+}`;
//         const fnDefRe = new RegExp(fnDefReStr);
//         const fnArr = fnDefRe.exec(code);
//         let funcTemplate;
//         let funcReturnType;
//         // no overload in c :)
//         if (fnArr) {
//             funcReturnType = fnArr[1];
//             const samplerType = `sampler${pair[1]}`;
//             const textureRe = (new RegExp(`.*?${samplerType}[\\s]+([\\S]+),`)).exec(fnArr[0])!;
//             const textureName = textureRe[1];
//             //\\W*vec2\\W([^\\)]+)
//             const uvDefRe = (new RegExp(`.*?${samplerType}[\\s]+[\\S]+,\\W*\\w+\\W([^\\)]+)`)).exec(fnArr[0])!;
//             const uvName = uvDefRe[1];
//             const uvRe = `\\b${uvName}\\b`;
//             const paramReStr = `${samplerType}[\\s]+${textureName}`;
//             // eslint-disable-next-line max-len
//             const funcDef = fnArr[0].replace(new RegExp(paramReStr), `texture${pair[1]} ${textureName}_TEX_NAME_PLACEHOLDER, sampler ${textureName}Sampler_SAMPLER_PLACEHOLDER`);
//             funcTemplate = funcDef;
//             // 2. texture(...) inside, builtin funcs
//             const textureOpArr = ['texture', 'textureSize', 'texelFetch', 'textureLod'];
//             for (let i = 0; i < textureOpArr.length; i++) {
//                 const texFuncReStr = `(${textureOpArr[i]})\\(${textureName},`;
//                 const texFuncRe = new RegExp(texFuncReStr, 'g');
//                 funcTemplate = funcTemplate.replace(texFuncRe, `$1(${samplerType}(${textureName}_TEX_NAME_PLACEHOLDER, ${textureName}Sampler_SAMPLER_PLACEHOLDER),`);
//             }
//             funcTemplate = funcTemplate.replace(new RegExp(uvRe, 'g'), `${uvName}_UV_NAME_PLACEHOLDER`);

//             const funcNameLineReStr = `(?:\\\\n|\\W).*\\(texture${pair[1]}[^\\)]+\\)[\\s]*{`;
//             const funcNameLineRe = new RegExp(funcNameLineReStr, 'g');
//             funcTemplate = funcTemplate.replace(funcNameLineRe, `\n${funcReturnType as string} RET_VAR_PLACEHOLDER;\n`);
//             const lastBracket = `(?:.(?!}))+$`;
//             const lastBracketRe = new RegExp(lastBracket, 'g');
//             funcTemplate = funcTemplate.replace(lastBracketRe, '');
//             const returnKeyword = `[\\\\n|\\W]return[\\W]`;
//             const returnKeywordRe = new RegExp(returnKeyword, 'g');
//             funcTemplate = funcTemplate.replace(returnKeywordRe, `\nRET_VAR_PLACEHOLDER = `);

//             // 3. fn called
//             // getVec3DisplacementFromTexture\(([\S]+),[^\)]+
//             // (?:.(?!\\n))+CCSampleWithAlphaSeparated\(([\S]+),[\s]*[^\\n]*
//             const calledReStr = `(?:.(?!\\\\n))+${pair[0]}\\(([\\S]+),[\\s]*([^\\)]+)[^;]+;`;
//             const calledRe = new RegExp(calledReStr, 'g');
//             let calledArr = calledRe.exec(code);
//             while (calledArr) {
//                 if (!calledArr[0].includes(`${calledArr[1]}, ${calledArr[1]}Sampler`)) {
//                     const calledStr = calledArr[0].replace(calledArr[1], `${calledArr[1]}, ${calledArr[1]}Sampler`);
//                     const returnVar = `${pair[0]}_${calledArr[1]}_${calledArr[2]}`;
//                     const placeholderMap = new Map<string, string>([
//                         ['RET_VAR_PLACEHOLDER', returnVar],
//                         [`${textureName}_TEX_NAME_PLACEHOLDER`, `${calledArr[1]}`],
//                         [`${textureName}Sampler_SAMPLER_PLACEHOLDER`, `${calledArr[1]}Sampler`],
//                         [`${uvName}_UV_NAME_PLACEHOLDER`, `${calledArr[2]}`],
//                     ]);
//                     const placeholderReStr = `(?:RET_VAR_PLACEHOLDER|${textureName}_TEX_NAME_PLACEHOLDER|${textureName}Sampler_SAMPLER_PLACEHOLDER|${uvName}_UV_NAME_PLACEHOLDER)`;
//                     const placeHolderRe = new RegExp(placeholderReStr, 'g');
//                     const specFunc = funcTemplate.replace(placeHolderRe, (matched) => placeholderMap.get(matched));

//                     // o *= CCSampleWithAlphaSeparated(cc_spriteTexture, uv0);  => o *= retVar;
//                     const targetExpr = `${pair[0]}[^;]+`;
//                     const targetExprRe = new RegExp(targetExpr, 'g');
//                     const retExpr = calledArr[0].replace(targetExprRe, returnVar);

//                     const str = (specFunc as string) + retExpr;

//                     code = code.replace(calledArr[0], str);
//                 }
//                 calledArr = calledRe.exec(code);
//             }

//             //code = code.replace(fnDefRe, funcDef);
//             //fnArr = fnDefRe.exec(code);
//         }

//         // 3. fn called
//         // getVec3DisplacementFromTexture\(([\S]+),[^\)]+
//         // const calledReStr = `(?<!vec.)${pair[0]}\\(([\\S]+),[\\s]*[^\\)]+`;
//         // const calledRe = new RegExp(calledReStr, 'g');
//         // let calledArr = calledRe.exec(code);
//         // while (calledArr) {
//         //     if (!calledArr[0].includes(`${calledArr[1]}, ${calledArr[1]}Sampler`)) {
//         //         const calledStr = calledArr[0].replace(calledArr[1], `${calledArr[1]}, ${calledArr[1]}Sampler`);
//         //         code = code.replace(calledArr[0], calledStr);
//         //     }
//         //     calledArr = calledRe.exec(code);
//         // }
//     });
//     // code = code.replace(/(?<!vec4 )(CCSampleTexture\(.+\))/g, 'CCSampleTexture(cc_spriteTextureSampler, cc_spriteTexture, uv0)');
//     return code;
// }

export class WebGPUDeviceManager {
    static get instance () {
        return WebGPUDeviceManager._instance;
    }
    static setInstance (instance) {
        WebGPUDeviceManager._instance = instance;
    }
    private static _instance: any | null = null;
}
