/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable func-names */
/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { gfx, webgpuAdapter, glslalgWasmModule } from '../../../webgpu/instantiated';
import {
    Texture, CommandBuffer, DescriptorSet, Device, Framebuffer,
    InputAssembler, RenderPass, Swapchain, Sampler, Buffer, Shader,
} from '../override';
import { DeviceInfo, BufferTextureCopy, ShaderInfo, ShaderStageFlagBit, FramebufferInfo, RenderPassInfo, InputAssemblerInfo, ObjectType } from '../base/define';
import { murmurhash2_32_gc } from '../../utils';

const originDeviceInitializeFunc = Device.prototype.initialize;
Device.prototype.initialize = function (info: DeviceInfo) {
    const adapter = webgpuAdapter.adapter;
    const device = webgpuAdapter.device;
    gfx.preinitializedWebGPUDevice = device;
    device.lost.then((info) => {
        console.error('Device was lost.', info);
        throw new Error('Something bad happened');
    });
    console.log(adapter);

    originDeviceInitializeFunc.call(this, info);

    // const queueInfo = new QueueInfo(QueueType.GRAPHICS);
    // this._queue = new Queue();
    // this._queue.initialize(queueInfo);

    // const cmdBufferInfo = new CommandBufferInfo(this._queue, CommandBufferType.PRIMARY);
    // this._cmdBuff = new WebGPUCommandBuffer();
    // (this._cmdBuff as WebGPUCommandBuffer).device = this;
    // this._cmdBuff.initialize(cmdBufferInfo);

    // this._caps.uboOffsetAlignment = 256;
    // this._caps.clipSpaceMinZ = 0;
    // this._caps.screenSpaceSignY = -1;
    // this._caps.clipSpaceSignY = 1;
    // WebGPUDeviceManager.setInstance(this);

    return true;
};

Device.prototype.flushCommands = function () {
};

Object.defineProperties(Device.prototype, {
    queue: {
        get () {
            return this.getQueue();
        },
    },
});

Object.defineProperties(Swapchain.prototype, {
    colorTexture: {
        get () {
            return this.getColorTexture();
        },
        set (val: any) {
            this.setColorTexture(val);
        },
    },
    depthStencilTexture: {
        get () {
            return this.getDepthStencilTexture();
        },
        set (val: any) {
            this.setDepthStencilTexture(val);
        },
    },
    surfaceTransform: {
        get () {
            return this.getTransform();
        },
    },
});

Object.defineProperties(Framebuffer.prototype, {
    renderPass: { writable: true },
    colorTextures: { writable: true },
    depthStencilTexture: { writable: true },
});

Object.defineProperties(RenderPass.prototype, {
    colorAttachments: { writable: true },
    depthStencilAttachment: { writable: true },
    subpasses: { writable: true },
    dependencies: { writable: true },
    hash: { writable: true },
});

Object.defineProperties(InputAssembler.prototype, {
    attributesHash: { writable: true },
    attributes: { writable: true },
});

Object.defineProperties(Shader.prototype, {
    typedID: { writable: true },
});

const oldCreateInputAssembler = Device.prototype.createInputAssembler;
Device.prototype.createInputAssembler = function (info: InputAssemblerInfo) {
    const ia = oldCreateInputAssembler.call(this, info);
    let res = 'attrs';
    for (let i = 0; i < info.attributes.length; ++i) {
        const at = info.attributes[i];
        res += `,${at.name},${at.format},${at.isNormalized},${at.stream},${at.isInstanced},${at.location}`;
    }
    ia.attributesHash = murmurhash2_32_gc(res, 666);
    ia.attributes = info.attributes;
    return ia;
};

const oldCreateFramebuffer = Device.prototype.createFramebuffer;
Device.prototype.createFramebuffer = function (info: FramebufferInfo) {
    const framebuffer = oldCreateFramebuffer.call(this, info);
    framebuffer.renderPass = info.renderPass;
    framebuffer.colorTextures = info.colorTextures;
    framebuffer.depthStencilTexture = info.depthStencilTexture;
    return framebuffer;
};

const oldCreateRenderPass = Device.prototype.createRenderPass;
Device.prototype.createRenderPass = function (info: RenderPassInfo) {
    const renderPass = oldCreateRenderPass.call(this, info);
    renderPass.colorAttachments = info.colorAttachments;
    renderPass.depthStencilAttachment = info.depthStencilAttachment;
    renderPass.subpasses = info.subpasses;
    renderPass.dependencies = info.dependencies;

    let res = '';
    if (renderPass.subpasses.length) {
        for (let i = 0; i < renderPass.subpasses.length; ++i) {
            const subpass = renderPass.subpasses[i];
            if (subpass.inputs.length) {
                res += 'ia';
                for (let j = 0; j < subpass.inputs.length; ++j) {
                    const ia = renderPass.colorAttachments[subpass.inputs[j]];
                    res += `,${ia.format},${ia.sampleCount}`;
                }
            }
            if (subpass.colors.length) {
                res += 'ca';
                for (let j = 0; j < subpass.inputs.length; ++j) {
                    const ca = renderPass.colorAttachments[subpass.inputs[j]];
                    res += `,${ca.format},${ca.sampleCount}`;
                }
            }
            if (subpass.depthStencil >= 0) {
                const ds = renderPass.colorAttachments[subpass.depthStencil];
                res += `ds,${ds.format},${ds.sampleCount}`;
            }
        }
    } else {
        res += 'ca';
        for (let i = 0; i < renderPass.colorAttachments.length; ++i) {
            const ca = renderPass.colorAttachments[i];
            res += `,${ca.format},${ca.sampleCount}`;
        }
        const ds = renderPass.depthStencilAttachment;
        if (ds) {
            res += `ds,${ds.format},${ds.sampleCount}`;
        }
    }

    renderPass.hash = murmurhash2_32_gc(res, 666);
    return renderPass;
};

Object.defineProperty(Device.prototype, 'commandBuffer', {
    get () {
        return this.getCommandBuffer();
    },
});

const oldBegin = CommandBuffer.prototype.begin;
CommandBuffer.prototype.begin = function (renderpass?: typeof RenderPass, subpass?: number, framebuffer?: typeof Framebuffer) {
    if (renderpass === undefined) {
        if (subpass === undefined) {
            if (framebuffer === undefined) {
                return this.begin0();
            } else {
                return this.begin1(renderpass);
            }
        } else {
            return this.begin2(this, renderpass, subpass);
        }
    } else {
        return this.begin3(renderpass, subpass, framebuffer);
    }
};

const oldBindBuffer = DescriptorSet.prototype.bindBuffer;
DescriptorSet.prototype.bindBuffer = function (binding: number, buffer: typeof Buffer, index?: number) {
    if (index === undefined) {
        oldBindBuffer.call(this, binding, buffer, 0);
    } else {
        oldBindBuffer.call(this, binding, buffer, index);
    }
};

const oldBindSampler = DescriptorSet.prototype.bindSampler;
DescriptorSet.prototype.bindSampler = function (binding: number, sampler: typeof Sampler, index?: number) {
    if (index === undefined) {
        oldBindSampler.call(this, binding, sampler, 0);
    } else {
        oldBindSampler.call(this, binding, sampler, index);
    }
};

const oldBindTexture = DescriptorSet.prototype.bindTexture;
DescriptorSet.prototype.bindTexture = function (binding: number, texture: typeof Texture, index?: number) {
    if (index === undefined) {
        oldBindTexture.call(this, binding, texture, 0);
    } else {
        oldBindTexture.call(this, binding, texture, index);
    }
};

const oldGetBuffer = DescriptorSet.prototype.getBuffer;
DescriptorSet.prototype.getBuffer = function (binding: number, index?: number) {
    if (index === undefined) {
        return oldGetBuffer.call(this, binding, 0);
    } else {
        return oldGetBuffer.call(this, binding, index);
    }
};

const oldGetSampler = DescriptorSet.prototype.getSampler;
DescriptorSet.prototype.getSampler = function (binding: number, index?: number) {
    if (index === undefined) {
        return oldGetSampler.call(this, binding, 0);
    } else {
        return oldGetSampler.call(this, binding, index);
    }
};

const oldGetTexture = DescriptorSet.prototype.getTexture;
DescriptorSet.prototype.getTexture = function (binding: number, index?: number) {
    if (index === undefined) {
        return oldGetTexture.call(this, binding, 0);
    } else {
        return oldGetTexture.call(this, binding, index);
    }
};

const oldUpdateBuffer = Buffer.prototype.update;
Buffer.prototype.update = function (data: BufferSource, size?: number) {
    if (size === undefined) {
        oldUpdateBuffer.call(this, data, data.byteLength);
    } else {
        oldUpdateBuffer.call(this, data, size);
    }
};

const oldCmdUpdateBuffer = CommandBuffer.prototype.updateBuffer;
CommandBuffer.prototype.updateBuffer = function (buffer: typeof Buffer, data: BufferSource, size?: number) {
    if (size === undefined) {
        oldCmdUpdateBuffer.call(this, buffer, data, data.byteLength);
    } else {
        oldCmdUpdateBuffer.call(this, buffer, data, size);
    }
};

const oldBindDescriptorSet = CommandBuffer.prototype.bindDescriptorSet;
CommandBuffer.prototype.bindDescriptorSet = function (set: number, descriptorSet: typeof DescriptorSet, dynamicOffsets?: Readonly<number[]>) {
    if (dynamicOffsets === undefined) {
        oldBindDescriptorSet.call(this, set, descriptorSet, []);
    } else {
        oldBindDescriptorSet.call(this, set, descriptorSet, dynamicOffsets);
    }
};

Device.prototype.copyTexImagesToTexture = function (texImages: TexImageSource[], texture: typeof Texture, regions: BufferTextureCopy[]) {
    const buffers: Uint8Array[] = [];
    for (let i = 0; i < regions.length; i++) {
        if ('getContext' in texImages[i]) {
            const canvasElem = texImages[i] as HTMLCanvasElement;
            const imageData = canvasElem.getContext('2d')?.getImageData(0, 0, texImages[i].width, texImages[i].height);
            const buff = imageData!.data.buffer;
            let data;
            let rawBuffer;
            if ('buffer' in buff) {
                // es-lint as any
                data = new Uint8Array((buff as any).buffer, (buff as any).byteOffset, (buff as any).byteLength);
            } else {
                rawBuffer = buff;
                data = new Uint8Array(rawBuffer);
            }
            buffers[i] = data;
        } else if (texImages[i] instanceof HTMLImageElement) {
            const img = texImages[i] as HTMLImageElement;
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            const imageData = ctx?.getImageData(0, 0, img.width, img.height);
            const buff = imageData!.data.buffer;
            let data;
            let rawBuffer;
            if ('buffer' in buff) {
                // es-lint as any
                data = new Uint8Array((buff as any).buffer, (buff as any).byteOffset, (buff as any).byteLength);
            } else {
                rawBuffer = buff;
                data = new Uint8Array(rawBuffer);
            }
            buffers[i] = data;
        } else {
            console.log('imageBmp copy not impled!');
        }
    }

    // const bufferTextureCopyList = new gfx.BufferTextureCopyList();
    // for (let i = 0; i < regions.length; i++) {
    //     const bufferTextureCopy = new gfx.BufferTextureCopy();
    //     bufferTextureCopy.buffOffset = regions[i].buffOffset;
    //     bufferTextureCopy.buffStride = regions[i].buffStride;
    //     bufferTextureCopy.buffTexHeight = regions[i].buffTexHeight;
    //     bufferTextureCopy.texOffset.x = regions[i].texOffset.x;
    //     bufferTextureCopy.texOffset.y = regions[i].texOffset.y;
    //     bufferTextureCopy.texOffset.z = regions[i].texOffset.z;
    //     bufferTextureCopy.texExtent.width = regions[i].texExtent.width;
    //     bufferTextureCopy.texExtent.height = regions[i].texExtent.height;
    //     bufferTextureCopy.texExtent.depth = regions[i].texExtent.depth;
    //     bufferTextureCopy.texSubres.mipLevel = regions[i].texSubres.mipLevel;
    //     bufferTextureCopy.texSubres.baseArrayLayer = regions[i].texSubres.baseArrayLayer;
    //     bufferTextureCopy.texSubres.layerCount = regions[i].texSubres.layerCount;
    //     bufferTextureCopyList.push_back(regions[i]);
    // }

    this.copyBuffersToTexture(buffers, texture, regions);
};

export function seperateCombinedSamplerTexture (shaderSource: string) {
    // sampler and texture
    const samplerTexturArr = shaderSource.match(/(.*?)\(set = \d+, binding = \d+\) uniform(.*?)sampler\w* \w+;/g);
    const count = samplerTexturArr?.length ? samplerTexturArr?.length : 0;
    let code = shaderSource;

    const referredFuncMap = new Map<string, [fnName: string, samplerType: string, samplerName: string]>();
    const samplerSet = new Set<string>();
    samplerTexturArr?.every((str) => {
        let textureName = str.match(/(?<=uniform(.*?)sampler\w* )(\w+)(?=;)/g)!.toString();
        let samplerStr = str.replace(textureName, `${textureName}Sampler`);
        let samplerFunc = samplerStr.match(/(?<=uniform(.*?))sampler(\w*)/g)!.toString();
        samplerFunc = samplerFunc.replace('sampler', '');
        if (samplerFunc === '') {
            textureName = textureName.replace('Sampler', '');
        } else {
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
            code = code.replace(str, `${textureStr}\n${samplerStr}`);
        }

        if (!samplerSet.has(`${textureName}Sampler`)) {
            samplerSet.add(`${textureName}Sampler`);
            // gathering referred func
            let referredFuncStr = `([\\w]+)[\\s]*\\([0-9a-zA-Z_\\s,]*?sampler${samplerFunc}[^\\)]+\\)[\\s]*{`;
            if (samplerFunc === '') {
                referredFuncStr = `([\\w]+)[\\s]*\\([0-9a-zA-Z_\\s,]*?sampler([\\S]+)[^\\)]+\\)[\\s]*{`;
            }
            const referredFuncRe = new RegExp(referredFuncStr, 'g');
            let reArr = referredFuncRe.exec(code);
            while (reArr) {
                // first to see if it's wrapped by #if 0 \n ... \n #ndif
                let smpFunc = samplerFunc;
                if (smpFunc === '') {
                    smpFunc = reArr[2];
                }
                const searchTarget = code.slice(0, reArr.index);
                const defValQueue: { str: string, b: boolean }[] = [];
                let searchIndex = 1;

                while (searchIndex > 0) {
                    const qLen = defValQueue.length;
                    const ifIndex = searchTarget.indexOf('#if', searchIndex);
                    let elseIndex = searchTarget.indexOf('#else', ifIndex);
                    let endIndex = searchTarget.indexOf('#endif', ifIndex);
                    let nextIfIndex = searchTarget.indexOf('#if', ifIndex + 1);

                    if (ifIndex === -1) break;
                    if (elseIndex === -1) elseIndex = Number.MAX_SAFE_INTEGER;
                    if (endIndex === -1) endIndex = Number.MAX_SAFE_INTEGER;
                    if (nextIfIndex === -1) nextIfIndex = Number.MAX_SAFE_INTEGER;

                    if (defValQueue.length > 0) {
                        if (elseIndex < ifIndex) {
                            defValQueue[defValQueue.length - 1].b = !defValQueue[defValQueue.length - 1].b;
                            searchIndex = elseIndex + 1;
                            continue;
                        }
                    }

                    const firstIdx = searchTarget.indexOf('#if', searchIndex);
                    if (firstIdx !== -1 && endIndex >= nextIfIndex) {
                        //#if[\s]+(!)?([\S]+)([\s+]?==[\s+]?[\S]+)
                        const ifdef = (new RegExp(`#if(def)?[\\s]+(!)?([\\S]+)([\\s+]?(==)?(!=)[\\s+]?([\\S]+))?`, 'gm')).exec(searchTarget.slice(firstIdx))!;
                        // #if CC_FOG == 1 ...
                        let evalRes = false;

                        if (ifdef[1]) {
                            evalRes = !!(new RegExp(`#define[\\s]+${ifdef[3]}`, 'gm')).exec(searchTarget);
                        } else {
                            const defVal = (new RegExp(`#define[\\s]+${ifdef[3]}[\\s]+([\\S]+).*`, 'gm')).exec(searchTarget)![1];
                            if (ifdef[4]) {
                                const conditionVal = ifdef[7];
                                evalRes = ifdef[5] ? defVal === conditionVal : defVal !== conditionVal;
                            } else if (ifdef[3]) {
                                evalRes = (defVal !== '0' && !ifdef[2]);
                            }
                        }

                        defValQueue[defValQueue.length] = { str: ifdef[3], b: evalRes };
                    }

                    const rawEndIndex = endIndex;
                    endIndex = searchTarget.indexOf('#endif', rawEndIndex + 1);
                    nextIfIndex = searchTarget.indexOf('#if', rawEndIndex + 1);
                    if (endIndex < nextIfIndex) {
                        if (defValQueue.length > 0) {
                            defValQueue.length -= 1;
                        }
                    }

                    searchIndex = firstIdx + 1;

                    // if (defValQueue.length > 0) {
                    //     if (endIndex < nextIfIndex) {
                    //         defValQueue.length -= 1;
                    //     }
                    // }
                }

                let defCheck = true;
                for (let i = 0; i < defValQueue.length; i++) {
                    if (!defValQueue[i].b) {
                        defCheck = false;
                        break;
                    }
                }

                const key = `${reArr[1]}_${smpFunc}_${textureName}Sampler`;
                if (!referredFuncMap.has(key) && defCheck) {
                    referredFuncMap.set(key, [reArr[1], smpFunc, `${textureName}Sampler`]);
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
        const codePieceStr = `${pair[0]}\\((.*?)${textureStr}[^\\n]+`;
        const codePieceRe = new RegExp(codePieceStr);
        let res = codePieceRe.exec(code);
        while (res) {
            let replaceStr = res[0].replace(`${pair[0]}(`, `${pair[0]}_${pair[2]}_specialized(`);
            replaceStr = replaceStr.replace(`${textureStr},`, '');
            code = code.replace(codePieceRe, replaceStr);
            res = codePieceRe.exec(code);
        }

        // 1. fn definition
        const fnDeclReStr = `[\\n|\\W][\\w]+[\\W]+${pair[0]}[\\s]*\\((.*?)sampler${pair[1]}[^{]+`;
        const fnDeclRe = new RegExp(fnDeclReStr);
        const fnDecl = fnDeclRe.exec(code);

        let redefFunc = '';
        if (!functionTemplates.has(pair[0])) {
            const funcBodyStart = code.slice(fnDecl!.index);

            const funcRedefine = (funcStr: string) => {
                const samplerType = `sampler${pair[1]}`;
                const textureRe = (new RegExp(`.*?${samplerType}[\\s]+([\\S]+)[,\\)]`)).exec(funcStr)!;
                const textureName = textureRe[1];
                const paramReStr = `${samplerType}[\\s]+${textureName}`;
                let funcDef = funcStr.replace(new RegExp(paramReStr), `texture${pair[1]} ${textureName}`);
                funcDef = funcDef.replace(pair[0], `${pair[0]}SAMPLER_SPEC`);
                // 2. texture(...) inside, builtin funcs
                const textureOpArr = ['texture', 'textureSize', 'texelFetch', 'textureLod'];
                for (let i = 0; i < textureOpArr.length; i++) {
                    const texFuncReStr = `(${textureOpArr[i]})\\(${textureName},`;
                    const texFuncRe = new RegExp(texFuncReStr, 'g');
                    funcDef = funcDef.replace(texFuncRe, `$1(${samplerType}(${textureName}TEXTURE_HOLDER, ${textureName}SAMPLER_HOLDER),`);
                }
                return funcDef;
            };

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
        } else {
            redefFunc = functionTemplates.get(pair[0])!;
        }

        const depsFuncs: string[] = [];

        const iterator = referredFuncMap.values();
        let val = iterator.next().value;
        while (val) {
            const funcDepReStr = `\\b(${val[0] as string})\\b`;
            if (redefFunc.search(funcDepReStr) !== -1) {
                depsFuncs[depsFuncs.length] = val[0];
            }
            val = iterator.next().value;
        }
        // for (let i = 0; i < referredFuncMap.values.length; ++i) {
        //     const funcDepReStr = `\\b(${referredFuncMap.values[i].fnName as string})\\b`;
        //     if (redefFunc.search(funcDepReStr) !== -1) {
        //         depsFuncs[depsFuncs.length] = referredFuncMap.values[i].fnName;
        //     }
        // }
        functionDeps.set(pair[0], depsFuncs);

        const specializedFuncs = new Map<string, string>();
        const specialize = (funcs: string[]) => {
            funcs.every((str) => {
                if (!specializedFuncs.has(`${pair[0]}_${pair[2]}_specialized`)) {
                    const samplerReStr = `(\\w+)SAMPLER_HOLDER`;
                    const textureName = pair[2].slice(0, pair[2].length - 7); // xxxxSampler
                    const textureStr = `(\\w+)TEXTURE_HOLDER`;
                    let funcTemplate = functionTemplates.get(str);
                    funcTemplate = funcTemplate!.replace(new RegExp(samplerReStr, 'g'), pair[2]);
                    funcTemplate = funcTemplate.replace(new RegExp(textureStr, 'g'), textureName);
                    funcTemplate = funcTemplate.replace(new RegExp('SAMPLER_SPEC', 'g'), `_${pair[2]}_specialized`);
                    funcTemplate = funcTemplate.replace(new RegExp(`texture${pair[1]}\\s+\\w+,`, 'g'), '');
                    // funcTemplate = funcTemplate.replace('SAMPLER_SPEC', `_${pair[2]}_specialized`);

                    for (let i = 0; i < depsFuncs.length; ++i) {
                        const depFuncStr = `${depsFuncs[i]}([\\W]?)*\\([^,)]+(,)?`;
                        funcTemplate = funcTemplate.replace(new RegExp(depFuncStr, 'g'), `${depsFuncs[i]}_${pair[2]}_specialized(`);
                    }

                    let declStr = fnDecl![0].replace(pair[0], `${str}_${pair[2]}_specialized`);
                    declStr = declStr.replace(new RegExp(`sampler${pair[1]}[^,)]+(,)?`, 'g'), ``);
                    declStr += `;`;
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
        funcDecls += '\nvec3 SRGBToLinear (vec3 gamma);\n';
        let idx = code.indexOf('precision');
        idx = code.indexOf(';', idx);
        idx += 1;
        code = `${code.slice(0, idx)}\n${funcDecls}\n${code.slice(idx)}`;
        code = code.replace(samplerDef![0], `${samplerDef![0]}\n${funcImpls}`);
    });

    return code;
}

const createShader = Device.prototype.createShader;
Device.prototype.createShader = function (shaderInfo: ShaderInfo) {
    for (let i = 0; i < shaderInfo.stages.length; ++i) {
        shaderInfo.stages[i].source = seperateCombinedSamplerTexture(shaderInfo.stages[i].source);
        const stageStr = shaderInfo.stages[i].stage === ShaderStageFlagBit.VERTEX ? 'vertex'
            : shaderInfo.stages[i].stage === ShaderStageFlagBit.FRAGMENT ? 'fragment' : 'compute';
        const sourceCode = `#version 450\n${shaderInfo.stages[i].source}`;
        const code = glslalgWasmModule.glslang.compileGLSL(sourceCode, stageStr, true, '1.1');
        shaderInfo.stages[i].spvData = code;
    }

    const shader = this.createShaderNative(shaderInfo);
    shader.typedID = ObjectType.SHADER;
    return shader;
};
