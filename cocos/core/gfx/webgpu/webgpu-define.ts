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
    Texture, CommandBuffer, DescriptorSet, Device, Framebuffer, DescriptorSetLayout,
    InputAssembler, RenderPass, Swapchain, Sampler, Buffer, Shader, PipelineLayout,
    PipelineState, Queue,
} from '../override';
import {
    DeviceInfo, BufferTextureCopy, ShaderInfo, ShaderStageFlagBit, FramebufferInfo, RenderPassInfo,
    InputAssemblerInfo, ObjectType, PipelineLayoutInfo, QueueInfo, TextureViewInfo, TextureInfo, DrawInfo, TextureType, Format, TextureUsageBit,
} from '../base/define';
import { murmurhash2_32_gc } from '../../utils';
import { PipelineStateInfo } from '../base/pipeline-state';

// const point2DObj: [number, number] = [1, 3];

enum TestEnum {
    ZERO,
    ONE,
    TWO,
    THREE,
}

const printPoint = gfx.printPoint;
const prTest2 = new gfx.PtTest();
prTest2.value = 22;

const ptTest0 = { value: 10, next: undefined };
const ptTest = { value: 10, next: ptTest0 };
const pt2D = { x: 1, y: 2, z: 3, w: 4, type: TestEnum.ZERO, usage: TestEnum.ONE, flag: TestEnum.TWO, prop: TestEnum.THREE, test: prTest2 };
const ptTeeee = { value: 5, pt: pt2D };
// printPoint(ptTeeee);
const printPtTest = gfx.printPtTest;

// const Point2D_2 = { x: 1, y: 2, type: 0, usage: 1 };
// // expect 1, 2, 0, 1
// printPoint(Point2D);

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

    prTest2.device = this;
    printPtTest(prTest2);

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

Object.defineProperties(Swapchain.prototype, {
    colorTexture: {
        get () {
            return this.getColorTexture();
        },
    },
    depthStencilTexture: {
        get () {
            return this.getDepthStencilTexture();
        },
    },
    surfaceTransform: {
        get () {
            return this.getTransform();
        },
    },
});

Object.defineProperties(Queue.prototype, {
    type: { writable: true },
});
const oldCreateQueue = Device.prototype.createQueue;
Device.prototype.createQueue = function (info: QueueInfo) {
    const queue = oldCreateQueue.call(this, info);
    queue.type = info.type;
    return queue;
};

Object.defineProperties(Texture.prototype, {
    type: {
        get () {
            return this.getType();
        },
    },
    usage: {
        get () {
            return this.getUsage();
        },
    },
    format: {
        get () {
            return this.getFormat();
        },
    },
    samples: {
        get () {
            return this.getSamples();
        },
    },
    flags: {
        get () {
            return this.getFlags();
        },
    },
});

Object.defineProperties(Buffer.prototype, {
    usage: {
        get () {
            return this.getUsage();
        },
    },
    memUsage: {
        get () {
            return this.getMemUsage();
        },
    },
    flags: {
        get () {
            return this.getFlags();
        },
    },
});

Object.defineProperties(DescriptorSetLayout.prototype, {
    bindings: {
        get () {
            return this.getBindings();
        },
    },
    bindingIndices: {
        get () {
            return this.getBindingIndices();
        },
    },
    descriptorIndices: {
        get () {
            return this.getDescriptorIndices();
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
    vertexBuffers: { writable: true },
    indexBuffer: { writable: true },
    indirectBuffer: { writable: true },
});

Object.defineProperties(Shader.prototype, {
    typedID: { writable: true },
    name: { writable: true },
    attributes: { writable: true },
    blocks: { writable: true },
    samplers: { writable: true },
});

Object.defineProperties(PipelineLayout.prototype, {
    setLayouts: { writable: true },
});
const oldCreatePipelineLayout = Device.prototype.createPipelineLayout;
Device.prototype.createPipelineLayout = function (info: PipelineLayoutInfo) {
    const layout = oldCreatePipelineLayout.call(this, info);
    layout.setLayouts = info.setLayouts;
    return layout;
};

Object.defineProperties(PipelineState.prototype, {
    shader: { writable: true },
    pipelineLayout: { writable: true },
    primitive: { writable: true },
    rasterizerState: { writable: true },
    depthStencilState: { writable: true },
    blendState: { writable: true },
    inputState: { writable: true },
    dynamicStates: { writable: true },
    renderPass: { writable: true },
});
const oldCreatePipelineState = Device.prototype.createPipelineState;
Device.prototype.createPipelineState = function (info: PipelineStateInfo) {
    const pso = oldCreatePipelineState.call(this, info);
    pso.shader = info.shader;
    pso.pipelineLayout = info.pipelineLayout;
    pso.primitive = info.primitive;
    pso.rasterizerState = info.rasterizerState;
    pso.depthStencilState = info.depthStencilState;
    pso.blendState = info.blendState;
    pso.inputState = info.inputState;
    pso.dynamicStates = info.dynamicStates;
    pso.renderPass = info.renderPass;
    return pso;
};

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
    ia.vertexBuffers = info.vertexBuffers;
    ia.indexBuffer = info.indexBuffer;
    ia.indirectBuffer = info.indirectBuffer;
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

Object.defineProperties(Device.prototype, {
    commandBuffer: {
        get () {
            return this.getCommandBuffer();
        },
    },
    queue: {
        get () {
            return this.getQueue();
        },
    },

});

Object.defineProperties(CommandBuffer.prototype, {
    queue: {
        get () {
            return this.getQueue();
        },
    },
    type: {
        get () {
            return this.getType();
        },
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

const oldDraw = CommandBuffer.prototype.draw;
CommandBuffer.prototype.draw = function (info: DrawInfo | typeof InputAssembler) {
    if ('attributesHash' in info) {
        return this.drawByInfo(info.drawInfo);
    } else {
        const gfxDrawInfo = new gfx.DrawInfo(
            info.vertexCount,
            info.firstVertex,
            info.indexCount,
            info.firstIndex,
            info.vertexOffset,
            info.instanceCount,
            info.firstInstance,
        );
        return this.drawByInfo(gfxDrawInfo);
    }
};

Object.defineProperty(DescriptorSet.prototype, 'layout', {
    get () {
        return this.getLayout();
    },
});

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
    const updateSize = size === undefined ? data.byteLength : size;
    if ('buffer' in data) {
        oldUpdateBuffer.call(this, new Uint8Array(data.buffer, data.byteOffset, data.byteLength), updateSize);
    } else {
        oldUpdateBuffer.call(this, new Uint8Array(data), updateSize);
    }
};

const oldCmdUpdateBuffer = CommandBuffer.prototype.updateBuffer;
CommandBuffer.prototype.updateBuffer = function (buffer: typeof Buffer, data: BufferSource, size?: number) {
    const updateSize = size === undefined ? data.byteLength : size;

    if ('buffer' in data) {
        oldCmdUpdateBuffer.call(this, buffer, new Uint8Array(data.buffer, data.byteOffset, data.byteLength), updateSize);
    } else {
        oldCmdUpdateBuffer.call(this, buffer, new Uint8Array(data), updateSize);
    }
};

const oldBindDescriptorSet = CommandBuffer.prototype.bindDescriptorSet;
CommandBuffer.prototype.bindDescriptorSet = function (set: number, descriptorSet: typeof DescriptorSet, dynamicOffsets?: Readonly<number[]>) {
    if (dynamicOffsets === undefined) {
        oldBindDescriptorSet.call(this, set, descriptorSet, []);
    } else if ('buffer' in dynamicOffsets) {
        oldBindDescriptorSet.call(this, set, descriptorSet, new Uint32Array((dynamicOffsets as any).buffer, (dynamicOffsets as any).byteOffset, (dynamicOffsets as any).byteLength));
    } else {
        oldBindDescriptorSet.call(this, set, descriptorSet, new Uint32Array(dynamicOffsets));
    }
};

const oldCmdCopyBuffersToTexture = CommandBuffer.prototype.copyBuffersToTexture;
CommandBuffer.prototype.copyBuffersToTexture = function (buffers: Readonly<ArrayBufferView[]>, texture: typeof Texture, regions: Readonly<BufferTextureCopy[]>) {
    const ucharBuffers: Uint8Array[] = [];
    for (let i = 0; i < buffers.length; ++i) {
        const buffer = buffers[i];
        if ('buffer' in buffer) {
            ucharBuffers.push(new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength));
        } else {
            ucharBuffers.push(new Uint8Array(buffer as any));
        }
    }
    oldCmdCopyBuffersToTexture.call(this, ucharBuffers, texture, regions);
};

const oldDeviceCopyBuffersToTexture = Device.prototype.copyBuffersToTexture;
Device.prototype.copyBuffersToTexture = function (buffers: Readonly<ArrayBufferView[]>, texture: typeof Texture, regions: Readonly<BufferTextureCopy[]>) {
    const ucharBuffers: Uint8Array[] = [];
    for (let i = 0; i < buffers.length; ++i) {
        const buffer = buffers[i];
        if ('buffer' in buffer) {
            ucharBuffers.push(new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength));
        } else {
            ucharBuffers.push(new Uint8Array(buffer as any));
        }
    }
    oldDeviceCopyBuffersToTexture.call(this, ucharBuffers, texture, regions);
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

    oldDeviceCopyBuffersToTexture.call(this, buffers, texture, regions);
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
                const defValQueue: { str: string, b: boolean, condition: RegExpExecArray }[] = [];
                let searchIndex = 1;

                while (searchIndex > 0) {
                    let ifIndex = searchTarget.indexOf('#if', searchIndex);
                    let elseIndex = searchTarget.indexOf('#else', searchIndex);
                    let endIndex = searchTarget.indexOf('#endif', searchIndex);

                    if (ifIndex === -1 && elseIndex === -1 && endIndex === -1) {
                        break;
                    }

                    if (ifIndex === -1) ifIndex = Number.MAX_SAFE_INTEGER;
                    if (elseIndex === -1) elseIndex = Number.MAX_SAFE_INTEGER;
                    if (endIndex === -1) endIndex = Number.MAX_SAFE_INTEGER;

                    // next start with '#' is #if(def)
                    if (ifIndex < elseIndex && ifIndex < endIndex) {
                        const ifdef = (new RegExp(`#if(def)?[\\s]+(!)?([\\S]+)([\\s+]?(==)?(!=)[\\s+]?([\\S]+))?`, 'gm')).exec(searchTarget.slice(ifIndex))!;
                        defValQueue[defValQueue.length] = { str: ifdef[3], b: true, condition: ifdef };
                        searchIndex = ifIndex + 1;
                        continue;
                    }

                    if (elseIndex < endIndex && elseIndex < ifIndex) {
                        defValQueue[defValQueue.length - 1].b = false;
                        searchIndex = elseIndex + 1;
                        continue;
                    }

                    if (endIndex < elseIndex && endIndex < ifIndex) {
                        defValQueue.pop();
                        searchIndex = endIndex + 1;
                        continue;
                    }
                }

                let defCheck = true;
                for (let i = 0; i < defValQueue.length; i++) {
                    const ifdef = defValQueue[i].condition;
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

                    if (defValQueue[i].b !== evalRes) {
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
    let forwardDecls = '';
    // function
    referredFuncMap.forEach((pair) => {
        //pre: if existed, replace
        //getVec3DisplacementFromTexture\(cc_TangentDisplacements[^\\n]+
        const textureStr = pair[2].slice(0, -7);
        const codePieceStr = `${pair[0]}\\((.*?)${textureStr}[^\\n]+`;
        const codePieceRe = new RegExp(codePieceStr);
        let res = codePieceRe.exec(code);
        while (res) {
            let replaceStr = res[0].replace(`${pair[0]}(`, `${pair[0]}_${pair[1]}_${pair[2]}_specialized(`);
            replaceStr = replaceStr.replace(`${textureStr},`, '');
            code = code.replace(codePieceRe, replaceStr);
            res = codePieceRe.exec(code);
        }

        // 1. fn definition
        const fnDeclReStr = `[\\n|\\W][\\w]+[\\W]+${pair[0]}[\\s]*\\((.*?)sampler${pair[1]}[^{]+`;
        const fnDeclRe = new RegExp(fnDeclReStr);
        const fnDecl = fnDeclRe.exec(code);

        let redefFunc = '';
        if (!functionTemplates.has(`${pair[0]}_${pair[1]}`)) {
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

            functionTemplates.set(`${pair[0]}_${pair[1]}`, redefFunc);
        } else {
            redefFunc = functionTemplates.get(`${pair[0]}_${pair[1]}`)!;
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
        functionDeps.set(`${pair[0]}_${pair[1]}`, depsFuncs);

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
                    funcTemplate = funcTemplate.replace(new RegExp('SAMPLER_SPEC', 'g'), `_${pair[1]}_${pair[2]}_specialized`);
                    funcTemplate = funcTemplate.replace(new RegExp(`texture${pair[1]}\\s+\\w+,`, 'g'), '');
                    // funcTemplate = funcTemplate.replace('SAMPLER_SPEC', `_${pair[2]}_specialized`);

                    for (let i = 0; i < depsFuncs.length; ++i) {
                        const depFuncStr = `${depsFuncs[i]}([\\W]?)*\\([^,)]+(,)?`;
                        funcTemplate = funcTemplate.replace(new RegExp(depFuncStr, 'g'), `${depsFuncs[i]}_${pair[1]}_${pair[2]}_specialized(`);
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
        specialize([`${pair[0]}_${pair[1]}`]);
        //(?:.(?!layout))+cc_PositionDisplacementsSampler;
        const samplerDefReStr = `(?:.(?!layout))+${pair[2]};`;
        const samplerDef = (new RegExp(samplerDefReStr)).exec(code);

        let funcImpls = '';
        for (const [key, value] of specializedFuncs) {
            forwardDecls += `\n${key}\n`;
            funcImpls += `\n${value}\n`;
        }

        code = code.replace(samplerDef![0], `${samplerDef![0]}\n${funcImpls}`);
    });

    // some function appears before it's defined so forward declaration is needed
    forwardDecls += '\nvec3 SRGBToLinear (vec3 gamma);\nfloat getDisplacementWeight(int index);\n';

    const highpIdx = code.indexOf('precision highp');
    const mediumpIdx = code.indexOf('precision mediump');
    const lowpIdx = code.indexOf('precision lowp');

    ///////////////////////////////////////////////////////////
    // isNan, isInf has been removed in dawn:tint

    let functionDefs = '';
    const precisionKeyWord = 'highp';

    // const getPrecision = (idx: number) => {
    //     if (highpIdx !== -1 && highpIdx < idx) {
    //         precisionKeyWord = 'highp';
    //     } else if (mediumpIdx !== -1 && mediumpIdx < idx && highpIdx < mediumpIdx) {
    //         precisionKeyWord = 'mediump';
    //     } else if (lowpIdx !== -1 && lowpIdx < idx && mediumpIdx < lowpIdx && highpIdx < lowpIdx) {
    //         precisionKeyWord = 'lowp';
    //     }
    // };

    const isNanIndex = code.indexOf('isnan');
    if (isNanIndex !== -1) {
        // getPrecision(isNanIndex);
        functionDefs += `\n
        bool isNan(${precisionKeyWord} float val) {
            return (val < 0.0 || 0.0 < val || val == 0.0) ? false : true;
        }
        \n`;
        code = code.replace(/isnan\(/gi, 'isNan(');
    }

    const isInfIndex = code.indexOf('isinf');
    if (isInfIndex !== -1) {
        // getPrecision(isInfIndex);
        functionDefs += `\n
        bool isInf(${precisionKeyWord} float x) {
            return x == x * 2.0 && x != 0.0;
        }
        \n`;
        code = code.replace(/isinf\(/gi, 'isInf(');
    }

    ///////////////////////////////////////////////////////////

    let firstPrecisionIdx = code.indexOf('precision');
    firstPrecisionIdx = code.indexOf(';', firstPrecisionIdx);
    firstPrecisionIdx += 1;
    code = `${code.slice(0, firstPrecisionIdx)}\n${forwardDecls}\n${functionDefs}\n${code.slice(firstPrecisionIdx)}`;

    return code;
}

const createShader = Device.prototype.createShader;
Device.prototype.createShader = function (shaderInfo: ShaderInfo) {
    for (let i = 0; i < shaderInfo.stages.length; ++i) {
        shaderInfo.stages[i].source = seperateCombinedSamplerTexture(shaderInfo.stages[i].source);
        const stageStr = shaderInfo.stages[i].stage === ShaderStageFlagBit.VERTEX ? 'vertex'
            : shaderInfo.stages[i].stage === ShaderStageFlagBit.FRAGMENT ? 'fragment' : 'compute';
        const sourceCode = `#version 450\n${shaderInfo.stages[i].source}`;
        const code = glslalgWasmModule.glslang.compileGLSL(sourceCode, stageStr, true, '1.3');
        shaderInfo.stages[i].spvData = code;
    }

    const shader = this.createShaderNative(shaderInfo);
    shader.typedID = ObjectType.SHADER;
    shader.name = shaderInfo.name;
    shader.attributes = shaderInfo.attributes;
    shader.blocks = shaderInfo.blocks;
    shader.samplers = shaderInfo.samplers;
    return shader;
};
