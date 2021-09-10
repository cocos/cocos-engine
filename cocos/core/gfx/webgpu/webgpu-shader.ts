import { Shader } from '../base/shader';
import { WebGPUDevice } from './webgpu-device';
import { Format, MemoryAccessBit, ShaderInfo, ShaderStageFlagBit, Type } from '../base/define';
import { wgpuWasmModule } from './webgpu-utils';

export class WebGPUShader extends Shader {
    private _nativeShader;

    public initialize (info: ShaderInfo): boolean {
        this._name = info.name;
        this._stages = info.stages;
        this._attributes = info.attributes;
        this._blocks = info.blocks;
        this._samplers = info.samplers;

        const nativeDevice = wgpuWasmModule.nativeDevice;
        const shaderInfo = new wgpuWasmModule.ShaderInfoInstance();
        shaderInfo.name = info.name;

        const shaderStageList = new wgpuWasmModule.ShaderStageList();
        for (let i = 0; i < info.stages.length; i++) {
            const shaderStage = new wgpuWasmModule.ShaderStageInstance();
            const stageName = ShaderStageFlagBit[info.stages[i].stage];
            shaderStage.stage = wgpuWasmModule.ShaderStageFlags[stageName];
            shaderStage.source = info.stages[i].source;
            shaderStageList.push_back(shaderStage);
        }
        shaderInfo.stages = shaderStageList;

        const attributeList = new wgpuWasmModule.AttributeList();
        for (let i = 0; i < info.attributes.length; i++) {
            const attribute = new wgpuWasmModule.AttributeInstance();
            attribute.name = info.attributes[i].name;

            const formatStr = Format[info.attributes[i].format];
            attribute.format = wgpuWasmModule.Format[formatStr];

            attribute.isNormalized = info.attributes[i].isNormalized;
            attribute.stream = info.attributes[i].stream;
            attribute.isInstanced = info.attributes[i].isInstanced;
            attribute.location = info.attributes[i].location;

            attributeList.push_back(attribute);
        }
        shaderInfo.attributes = attributeList;

        const uniformBlockList = new wgpuWasmModule.UniformBlockList();
        for (let i = 0; i < info.blocks.length; i++) {
            const block = new wgpuWasmModule.UniformBlockInstance();
            block.set = info.blocks[i].set;
            block.binding = info.blocks[i].binding;
            block.name = info.blocks[i].name;
            for (let j = 0; j < info.blocks[i].members.length; j++) {
                const uniformInfo = info.blocks[i].members[j];
                const uniform = new wgpuWasmModule.UniformInstance();
                uniform.name = uniformInfo.name;

                const typeStr = Type[uniformInfo.type];
                uniform.type = wgpuWasmModule.Type[typeStr];
                block.members.push_back(uniform);
            }
            block.count = info.blocks[i].count;
            uniformBlockList.push_back(block);
        }
        shaderInfo.blocks = uniformBlockList;

        const uniformStorageBufferList = new wgpuWasmModule.UniformStorageBufferList();
        for (let i = 0; i < info.buffers.length; i++) {
            const buffer = new wgpuWasmModule.UniformStorageBufferInstance();
            buffer.set = info.buffers[i].set;
            buffer.binding = info.buffers[i].binding;
            buffer.name = info.buffers[i].name;
            buffer.count = info.buffers[i].count;

            const memAccName = MemoryAccessBit[info.buffers[i].memoryAccess];
            buffer.memoryAccess = wgpuWasmModule.MemoryAccess[memAccName];
            uniformStorageBufferList.push_back(buffer);
        }
        shaderInfo.buffers = uniformStorageBufferList;

        const uniformSamplerTextureList = new wgpuWasmModule.UniformSamplerTextureList();
        for (let i = 0; i < info.samplerTextures.length; i++) {
            const uniformSamplerTexture = new wgpuWasmModule.UniformSamplerTextureInstance();
            uniformSamplerTexture.set = info.samplerTextures[i].set;
            uniformSamplerTexture.binding = info.samplerTextures[i].binding;
            uniformSamplerTexture.name = info.samplerTextures[i].name;
            uniformSamplerTexture.count = info.samplerTextures[i].count;

            const typeStr = Type[info.samplerTextures[i].type];
            uniformSamplerTexture.type = wgpuWasmModule.Type[typeStr];
            uniformSamplerTextureList.push_back(uniformSamplerTexture);
        }
        shaderInfo.samplerTextures = uniformSamplerTextureList;

        const uniformSamplerList = new wgpuWasmModule.UniformSamplerList();
        for (let i = 0; i < info.samplers.length; i++) {
            const uniformSampler = new wgpuWasmModule.UniformSamplerInstance();
            uniformSampler.set = info.samplers[i].set;
            uniformSampler.binding = info.samplers[i].binding;
            uniformSampler.name = info.samplers[i].name;
            uniformSampler.count = info.samplers[i].count;

            uniformSamplerList.push_back(uniformSampler);
        }
        shaderInfo.samplers = uniformSamplerList;

        const uniformTextureList = new wgpuWasmModule.UniformTextureList();
        for (let i = 0; i < info.textures.length; i++) {
            const uniformTexture = new wgpuWasmModule.UniformTextureInstance();
            uniformTexture.set = info.textures[i].set;
            uniformTexture.binding = info.textures[i].binding;
            uniformTexture.name = info.textures[i].name;
            uniformTexture.count = info.textures[i].count;

            const typeStr = Type[info.textures[i].type];
            uniformTexture.type = wgpuWasmModule.Type[typeStr];
            uniformTextureList.push_back(uniformTexture);
        }
        shaderInfo.textures = uniformTextureList;

        const uniformStorageImageList = new wgpuWasmModule.UniformStorageImageList();
        for (let i = 0; i < info.images.length; i++) {
            const uniformStorageImage = new wgpuWasmModule.UniformStorageImageInstance();
            uniformStorageImage.set = info.images[i].set;
            uniformStorageImage.binding = info.images[i].binding;
            uniformStorageImage.name = info.images[i].name;
            uniformStorageImage.count = info.images[i].count;

            const typeStr = Type[info.images[i].type];
            uniformStorageImage.type = wgpuWasmModule.Type[typeStr];
            const memAccStr = MemoryAccessBit[info.images[i].memoryAccess];
            uniformStorageImage.memoryAccess = wgpuWasmModule.MemoryAccess[memAccStr];

            uniformStorageImageList.push_back(uniformStorageImage);
        }
        shaderInfo.images = uniformStorageImageList;

        const uniformInputAttachmentList = new wgpuWasmModule.UniformInputAttachmentList();
        for (let i = 0; i < info.subpassInputs.length; i++) {
            const uniformInputAttachment = new wgpuWasmModule.UniformInputAttachmentInstance();
            uniformInputAttachment.set = info.subpassInputs[i].set;
            uniformInputAttachment.binding = info.subpassInputs[i].binding;
            uniformInputAttachment.name = info.subpassInputs[i].name;
            uniformInputAttachment.count = info.subpassInputs[i].count;

            uniformInputAttachmentList.push_back(uniformInputAttachment);
        }
        shaderInfo.subpassInputs = uniformInputAttachmentList;

        this._nativeShader = nativeDevice.createShader(shaderInfo);
        return true;
    }

    public destroy () {
        this._nativeShader.destroy();
        this._nativeShader.delete();
    }
}
