/* eslint-disable @typescript-eslint/indent */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { UIRenderable } from '../../../2d';
import {
    Format, ComparisonFunc, Address, Filter, TextureType,
    TextureUsageBit, TextureFlagBit, SampleCount, BufferUsageBit, MemoryUsageBit, BufferFlagBit, DescriptorType, ShaderStageFlagBit,
} from '../base/define';
import { wgpuWasmModule } from './webgpu-utils';

export function toNativeBit<T> (flags: number): T | undefined {
    let result;
    let i = 0;
    while (flags << 1) {
        result |= T[i];
        i++;
    }
    return result;
}

export function toWGPUNativeFormat (format: Format): wgpuWasmModule.Format | undefined {
    switch (format) {
        case Format.RGBA8:
            return wgpuWasmModule.Format.RGBA8;
        case Format.BGRA8:
            return wgpuWasmModule.Format.BGRA8;
        case Format.DEPTH:
            return wgpuWasmModule.Format.DEPTH;
        case Format.DEPTH_STENCIL:
            return wgpuWasmModule.Format.DEPTH_STENCIL;
        default:
            console.log('unsupport format');
    }
}

export function toWGPUNativeTextureType (type: TextureType): wgpuWasmModule.TextureType | undefined {
    switch (type) {
        case TextureType.TEX1D:
            return wgpuWasmModule.TextureType.TEX1D;
        case TextureType.TEX2D:
            return wgpuWasmModule.TextureType.TEX2D;
        case TextureType.TEX3D:
            return wgpuWasmModule.TextureType.TEX3D;
        case TextureType.CUBE:
            return wgpuWasmModule.TextureType.CUBE;
        case TextureType.TEX1D_ARRAY:
            return wgpuWasmModule.TextureType.TEX1D_ARRAY;
        case TextureType.TEX2D_ARRAY:
            return wgpuWasmModule.TextureType.TEX2D_ARRAY;
        default:
            console.log('unsupport texture type');
    }
}

export function toWGPUNativeTextureUsage (usage: TextureUsageBit) {
    let result = wgpuWasmModule.TextureUsage.NONE;
    if (usage === TextureUsageBit.NONE) {
        return result;
    }

    if (usage & TextureUsageBit.TRANSFER_SRC) {
        result |= wgpuWasmModule.TextureUsage.TRANSFER_SRC;
    }

    if (usage & TextureUsageBit.TRANSFER_DST) {
        result |= wgpuWasmModule.TextureUsage.TRANSFER_DST;
    }

    if (usage & TextureUsageBit.SAMPLED) {
        result |= wgpuWasmModule.TextureUsage.SAMPLED;
    }

    if (usage & TextureUsageBit.STORAGE) {
        result |= wgpuWasmModule.TextureUsage.STORAGE;
    }

    if (usage & TextureUsageBit.COLOR_ATTACHMENT) {
        result |= wgpuWasmModule.TextureUsage.COLOR_ATTACHMENT;
    }

    if (usage & TextureUsageBit.DEPTH_STENCIL_ATTACHMENT) {
        result |= wgpuWasmModule.TextureUsage.DEPTH_STENCIL_ATTACHMENT;
    }

    if (usage & TextureUsageBit.INPUT_ATTACHMENT) {
        result |= wgpuWasmModule.TextureUsage.INPUT_ATTACHMENT;
    }
    return result;
}

export function toWGPUTextureFlag (flag: TextureFlagBit): wgpuWasmModule.TextureFlags | undefined {
    switch (flag) {
        case TextureFlagBit.NONE:
            return wgpuWasmModule.TextureFlags.NONE;
        case TextureFlagBit.GEN_MIPMAP:
            return wgpuWasmModule.TextureFlags.GEN_MIPMAP;
        case TextureFlagBit.RESIZABLE:
            return wgpuWasmModule.TextureFlags.RESIZABLE;
        case TextureFlagBit.GENERAL_LAYOUT:
            return wgpuWasmModule.TextureFlags.GENERAL_LAYOUT;
        default:
            console.log('unsupport texture flag');
    }
}

export function toWGPUTextureSampleCount (sample: SampleCount): wgpuWasmModule.SampleCount | undefined {
    switch (sample) {
        case SampleCount.ONE:
            return wgpuWasmModule.SampleCount.ONE;
        case SampleCount.MULTIPLE_PERFORMANCE:
            return wgpuWasmModule.SampleCount.MULTIPLE_PERFORMANCE;
        case SampleCount.MULTIPLE_BALANCE:
            return wgpuWasmModule.SampleCount.MULTIPLE_BALANCE;
        case SampleCount.MULTIPLE_QUALITY:
            return wgpuWasmModule.SampleCount.MULTIPLE_QUALITY;
        default:
            console.log('unsupport texture sample count');
    }
}

export function toWGPUNativeBufferUsage (usage: BufferUsageBit): wgpuWasmModule.BufferUsage | undefined {
    let result = wgpuWasmModule.BufferUsage.NONE;
    if (usage === BufferUsageBit.NONE) {
        return result;
    }

    if (usage & BufferUsageBit.TRANSFER_SRC) {
        result |= wgpuWasmModule.BufferUsage.TRANSFER_SRC;
    }

    if (usage & BufferUsageBit.TRANSFER_DST) {
        result |= wgpuWasmModule.BufferUsage.TRANSFER_DST;
    }

    if (usage & BufferUsageBit.INDEX) {
        result |= wgpuWasmModule.BufferUsage.INDEX;
    }

    if (usage & BufferUsageBit.VERTEX) {
        result |= wgpuWasmModule.BufferUsage.VERTEX;
    }

    if (usage & BufferUsageBit.UNIFORM) {
        result |= wgpuWasmModule.BufferUsage.UNIFORM;
    }

    if (usage & BufferUsageBit.STORAGE) {
        result |= wgpuWasmModule.BufferUsage.STORAGE;
    }

    if (usage & BufferUsageBit.INDIRECT) {
        result |= wgpuWasmModule.BufferUsage.INDIRECT;
    }
    return result;
}

export function toWGPUNativeBufferMemUsage (memUsage: MemoryUsageBit): wgpuWasmModule.MemoryUsage | undefined {
    let result = wgpuWasmModule.MemoryUsage.NONE;
    if (memUsage === MemoryUsageBit.NONE) {
        return result;
    }

    if (memUsage & MemoryUsageBit.DEVICE) {
        result |= wgpuWasmModule.MemoryUsage.DEVICE;
    }

    if (memUsage & MemoryUsageBit.HOST) {
        result |= wgpuWasmModule.MemoryUsage.HOST;
    }
    return result;
}

export function toWGPUNativeBufferFlag (flag: BufferFlagBit): wgpuWasmModule.BufferFlag | undefined {
    switch (flag) {
        case BufferFlagBit.NONE:
            return wgpuWasmModule.BufferFlags.NONE;
        default:
            console.log('unsupport buffer memory usage');
    }
}

export function toWGPUNativeDescriptorType (descType: DescriptorType): wgpuWasmModule.DescriptorType | undefined {
    switch (descType) {
        case DescriptorType.UNKNOWN:
            return wgpuWasmModule.DescriptorType.UNKNOWN;
        case DescriptorType.UNIFORM_BUFFER:
            return wgpuWasmModule.DescriptorType.UNIFORM_BUFFER;
        case DescriptorType.DYNAMIC_UNIFORM_BUFFER:
            return wgpuWasmModule.DescriptorType.DYNAMIC_UNIFORM_BUFFER;
        case DescriptorType.STORAGE_BUFFER:
            return wgpuWasmModule.DescriptorType.STORAGE_BUFFER;
        case DescriptorType.DYNAMIC_STORAGE_BUFFER:
            return wgpuWasmModule.DescriptorType.DYNAMIC_STORAGE_BUFFER;
        case DescriptorType.SAMPLER_TEXTURE:
            return wgpuWasmModule.DescriptorType.SAMPLER_TEXTURE;
        case DescriptorType.SAMPLER:
            return wgpuWasmModule.DescriptorType.SAMPLER;
        case DescriptorType.TEXTURE:
            return wgpuWasmModule.DescriptorType.TEXTURE;
        case DescriptorType.STORAGE_IMAGE:
            return wgpuWasmModule.DescriptorType.STORAGE_IMAGE;
        case DescriptorType.INPUT_ATTACHMENT:
            return wgpuWasmModule.DescriptorType.INPUT_ATTACHMENT;
        default:
            console.log('unsupport descriptor type');
    }
}

export function toWGPUNativeStageFlags (flags: ShaderStageFlagBit) {
    let result;
    if (flags === ShaderStageFlagBit.NONE) { return result; }

    if (flags & ShaderStageFlagBit.VERTEX || flags & ShaderStageFlagBit.ALL) {
        result |= wgpuWasmModule.ShaderStageFlags.VERTEX;
    }
    if (flags & ShaderStageFlagBit.CONTROL || flags & ShaderStageFlagBit.ALL) {
        result |= wgpuWasmModule.ShaderStageFlags.CONTROL;
    }
    if (flags & ShaderStageFlagBit.EVALUATION || flags & ShaderStageFlagBit.ALL) {
        result |= wgpuWasmModule.ShaderStageFlags.EVALUATION;
    }
    if (flags & ShaderStageFlagBit.GEOMETRY || flags & ShaderStageFlagBit.ALL) {
        result |= wgpuWasmModule.ShaderStageFlags.GEOMETRY;
    }
    if (flags & ShaderStageFlagBit.FRAGMENT || flags & ShaderStageFlagBit.ALL) {
         result |= wgpuWasmModule.ShaderStageFlags.FRAGMENT;
    }
    if (flags & ShaderStageFlagBit.COMPUTE || flags & ShaderStageFlagBit.ALL) {
        result |= wgpuWasmModule.ShaderStageFlags.COMPUTE;
    }

    return result;
}

export function toWGPUNativeFilter (filter: Filter): wgpuWasmModule.Filter | undefined {
    switch (filter) {
        case Filter.NONE:
            return wgpuWasmModule.Filter.NONE;
        case Filter.POINT:
            return wgpuWasmModule.Filter.POINT;
        case Filter.LINEAR:
            return wgpuWasmModule.Filter.LINEAR;
        case Filter.ANISOTROPIC:
            return wgpuWasmModule.Filter.ANISOTROPIC;
        default:
            console.log('unsupport filter');
    }
}

export function toWGPUNativeAddressMode (address: Address): wgpuWasmModule.Address | undefined {
    switch (address) {
        case Address.WRAP:
            return wgpuWasmModule.Address.WRAP;
        case Address.MIRROR:
            return wgpuWasmModule.Address.MIRROR;
        case Address.CLAMP:
            return wgpuWasmModule.Address.CLAMP;
        case Address.BORDER:
            return wgpuWasmModule.Address.BORDER;
        default:
            console.log('unsupport address mode');
    }
}

export function toWGPUNativeCompareFunc (cmpFunc: ComparisonFunc): wgpuWasmModule.ComparisonFunc | undefined {
    switch (cmpFunc) {
        case ComparisonFunc.NEVER:
            return wgpuWasmModule.ComparisonFunc.NEVER;
        case ComparisonFunc.LESS:
            return wgpuWasmModule.ComparisonFunc.LESS;
        case ComparisonFunc.EQUAL:
            return wgpuWasmModule.ComparisonFunc.EQUAL;
        case ComparisonFunc.LESS_EQUAL:
            return wgpuWasmModule.ComparisonFunc.LESS_EQUAL;
        case ComparisonFunc.GREATER:
            return wgpuWasmModule.ComparisonFunc.GREATER;
        case ComparisonFunc.NOT_EQUAL:
            return wgpuWasmModule.ComparisonFunc.NOT_EQUAL;
        case ComparisonFunc.GREATER_EQUAL:
            return wgpuWasmModule.ComparisonFunc.GREATER_EQUAL;
        case ComparisonFunc.ALWAYS:
            return wgpuWasmModule.ComparisonFunc.ALWAYS;
        default:
            console.log('unsupport compare func');
    }
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
            const referredFuncStr = `([\\w]+)\\(sampler${samplerFunc}[^\\)]+\\).*{`;
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
        const fnDefReStr = `.*?${pair[0]}\\(sampler${pair[1]}[^}]+}`;
        const fnDefRe = new RegExp(fnDefReStr);
        let fnArr = fnDefRe.exec(code);
        while (fnArr) {
            const samplerType = `sampler${pair[1]}`;
            const textureRe = (new RegExp(`.*?${samplerType}[\\s]+([\\S]+),`)).exec(fnArr[0])!;
            const textureName = textureRe[1];
            const paramReStr = `${samplerType}[\\s]+${textureName}`;
            let funcDef = fnArr[0].replace(new RegExp(paramReStr), `texture${pair[1]} ${textureName}, sampler ${textureName}Sampler`);

            // 2. texture(...) inside, builtin funcs
            const textureOpArr = ['texture', 'textureSize', 'texelFetch'];
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
        const calledReStr = `(?<!vec.*?)${pair[0]}\\(([\\S]+),[\\s]*[^\\)]+`;
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
