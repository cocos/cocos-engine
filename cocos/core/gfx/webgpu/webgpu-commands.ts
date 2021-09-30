/* eslint-disable @typescript-eslint/indent */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
    Format, ComparisonFunc, Address, Filter, TextureType,
    TextureUsageBit, TextureFlagBit, SampleCount, BufferUsageBit, MemoryUsageBit, BufferFlagBit, DescriptorType, ShaderStageFlagBit,
} from '../base/define';
import { nativeLib } from './webgpu-utils';

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
