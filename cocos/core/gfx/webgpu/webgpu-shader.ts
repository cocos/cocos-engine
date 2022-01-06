/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Shader } from '../base/shader';
import { Format, MemoryAccessBit, ShaderInfo, ShaderStageFlagBit, Type } from '../base/define';
import { glslalgWasmModule, nativeLib } from './webgpu-utils';
import { removeCombinedSamplerTexture, removeCombinedSamplerTexture0 } from './webgpu-commands';

export class WebGPUShader extends Shader {
    private _nativeShader;

    get nativeShader () {
        return this._nativeShader;
    }

    public initialize (info: ShaderInfo): boolean {
        this._name = info.name;
        this._stages = info.stages;
        this._attributes = info.attributes;
        this._blocks = info.blocks;
        this._samplers = info.samplers;

        const nativeDevice = nativeLib.nativeDevice;
        const shaderInfo = new nativeLib.SPVShaderInfoInstance();
        shaderInfo.setName(info.name);

        const shaderStageList = new nativeLib.SPVShaderStageList();
        for (let i = 0; i < info.stages.length; i++) {
            const shaderStage = new nativeLib.SPVShaderStageInstance();
            const stageName = ShaderStageFlagBit[info.stages[i].stage];
            shaderStage.setStage(nativeLib.ShaderStageFlags[stageName]);
            const source = removeCombinedSamplerTexture0(info.stages[i].source);

            const stageStr = info.stages[i].stage === ShaderStageFlagBit.VERTEX ? 'vertex'
                : info.stages[i].stage === ShaderStageFlagBit.FRAGMENT ? 'fragment' : 'compute';
            const sourceCode = `#version 450\n${source}`;
            const code = (glslalgWasmModule as any).glslang.compileGLSL(sourceCode, stageStr, true, '1.1');
            shaderStage.setSPVData(code);
            shaderStageList.push_back(shaderStage);
        }
        shaderInfo.setStages(shaderStageList);

        const attributeList = new nativeLib.AttributeList();
        for (let i = 0; i < info.attributes.length; i++) {
            const attribute = new nativeLib.AttributeInstance();
            attribute.name = info.attributes[i].name;

            const formatStr = Format[info.attributes[i].format];
            attribute.format = nativeLib.Format[formatStr];

            attribute.isNormalized = info.attributes[i].isNormalized;
            attribute.stream = info.attributes[i].stream;
            attribute.isInstanced = info.attributes[i].isInstanced;
            attribute.location = info.attributes[i].location;

            attributeList.push_back(attribute);
        }
        shaderInfo.setAttributes(attributeList);

        const uniformBlockList = new nativeLib.UniformBlockList();
        for (let i = 0; i < info.blocks.length; i++) {
            const block = new nativeLib.UniformBlockInstance();
            block.set = info.blocks[i].set;
            block.binding = info.blocks[i].binding;
            block.name = info.blocks[i].name;
            for (let j = 0; j < info.blocks[i].members.length; j++) {
                const uniformInfo = info.blocks[i].members[j];
                const uniform = new nativeLib.UniformInstance();
                uniform.name = uniformInfo.name;

                const typeStr = Type[uniformInfo.type];
                uniform.type = nativeLib.Type[typeStr];
                block.members.push_back(uniform);
            }
            block.count = info.blocks[i].count;
            uniformBlockList.push_back(block);
        }
        shaderInfo.setBlocks(uniformBlockList);

        const uniformStorageBufferList = new nativeLib.UniformStorageBufferList();
        for (let i = 0; i < info.buffers.length; i++) {
            const buffer = new nativeLib.UniformStorageBufferInstance();
            buffer.set = info.buffers[i].set;
            buffer.binding = info.buffers[i].binding;
            buffer.name = info.buffers[i].name;
            buffer.count = info.buffers[i].count;

            const memAccName = MemoryAccessBit[info.buffers[i].memoryAccess];
            buffer.memoryAccess = nativeLib.MemoryAccess[memAccName];
            uniformStorageBufferList.push_back(buffer);
        }
        shaderInfo.setBuffers(uniformStorageBufferList);

        const uniformSamplerTextureList = new nativeLib.UniformSamplerTextureList();
        for (let i = 0; i < info.samplerTextures.length; i++) {
            const uniformSamplerTexture = new nativeLib.UniformSamplerTextureInstance();
            uniformSamplerTexture.set = info.samplerTextures[i].set;
            uniformSamplerTexture.binding = info.samplerTextures[i].binding;
            uniformSamplerTexture.name = info.samplerTextures[i].name;
            uniformSamplerTexture.count = info.samplerTextures[i].count;

            const typeStr = Type[info.samplerTextures[i].type];
            uniformSamplerTexture.type = nativeLib.Type[typeStr];
            uniformSamplerTextureList.push_back(uniformSamplerTexture);
        }
        shaderInfo.setSamplerTextures(uniformSamplerTextureList);

        const uniformSamplerList = new nativeLib.UniformSamplerList();
        for (let i = 0; i < info.samplers.length; i++) {
            const uniformSampler = new nativeLib.UniformSamplerInstance();
            uniformSampler.set = info.samplers[i].set;
            uniformSampler.binding = info.samplers[i].binding;
            uniformSampler.name = info.samplers[i].name;
            uniformSampler.count = info.samplers[i].count;

            uniformSamplerList.push_back(uniformSampler);
        }
        shaderInfo.setSamplers(uniformSamplerList);

        const uniformTextureList = new nativeLib.UniformTextureList();
        for (let i = 0; i < info.textures.length; i++) {
            const uniformTexture = new nativeLib.UniformTextureInstance();
            uniformTexture.set = info.textures[i].set;
            uniformTexture.binding = info.textures[i].binding;
            uniformTexture.name = info.textures[i].name;
            uniformTexture.count = info.textures[i].count;

            const typeStr = Type[info.textures[i].type];
            uniformTexture.type = nativeLib.Type[typeStr];
            uniformTextureList.push_back(uniformTexture);
        }
        shaderInfo.setTextures(uniformTextureList);

        const uniformStorageImageList = new nativeLib.UniformStorageImageList();
        for (let i = 0; i < info.images.length; i++) {
            const uniformStorageImage = new nativeLib.UniformStorageImageInstance();
            uniformStorageImage.set = info.images[i].set;
            uniformStorageImage.binding = info.images[i].binding;
            uniformStorageImage.name = info.images[i].name;
            uniformStorageImage.count = info.images[i].count;

            const typeStr = Type[info.images[i].type];
            uniformStorageImage.type = nativeLib.Type[typeStr];
            const memAccStr = MemoryAccessBit[info.images[i].memoryAccess];
            uniformStorageImage.memoryAccess = nativeLib.MemoryAccess[memAccStr];

            uniformStorageImageList.push_back(uniformStorageImage);
        }
        shaderInfo.setImages(uniformStorageImageList);

        const uniformInputAttachmentList = new nativeLib.UniformInputAttachmentList();
        for (let i = 0; i < info.subpassInputs.length; i++) {
            const uniformInputAttachment = new nativeLib.UniformInputAttachmentInstance();
            uniformInputAttachment.set = info.subpassInputs[i].set;
            uniformInputAttachment.binding = info.subpassInputs[i].binding;
            uniformInputAttachment.name = info.subpassInputs[i].name;
            uniformInputAttachment.count = info.subpassInputs[i].count;

            uniformInputAttachmentList.push_back(uniformInputAttachment);
        }
        shaderInfo.setSubpasses(uniformInputAttachmentList);
        this._nativeShader = nativeDevice.createShader(shaderInfo);
        return true;
    }

    public destroy () {
        this._nativeShader.destroy();
        this._nativeShader.delete();
    }
}
