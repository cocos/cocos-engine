#include "GLESPipelineState.h"
#include "GLESConversion.h"
#include "GLESCore.h"

namespace cc::gfx::gles {

PipelineState::PipelineState() {
    _typedID = generateObjectID<decltype(this)>();
}

PipelineState::~PipelineState() {
    destroy();
}

void PipelineState::doInit(const PipelineStateInfo &info) {
    _pso = ccnew GPUPipelineState();
    _pso->shader          = static_cast<Shader *>(_shader)->getGPUShader();
    _pso->attributes      = _shader->getAttributes();
    _pso->blocks          = _shader->getBlocks();
    _pso->buffers         = _shader->getBuffers();
    _pso->samplerTextures = _shader->getSamplerTextures();
    _pso->images          = _shader->getImages();
    _pso->subpassInputs   = _shader->getSubpassInputs();

    _pso->layout = static_cast<PipelineLayout *>(_pipelineLayout)->getGPUPipelineLayout();
    _pso->initPipelineState(info);
}

void PipelineState::doDestroy() {
    _pso = nullptr;
}

void GPUPipelineState::initPipelineState(const PipelineStateInfo &info) {
    dynamicStats = info.dynamicStates;
    primitive = getPrimitive(info.primitive);

    setRasterizerState(info.rasterizerState);
    setDepthStencilState(info.depthStencilState);
    setBlendState(info.blendState);
    setShader(info.shader);
}

void GPUPipelineState::setRasterizerState(const gfx::RasterizerState &rs) {
    rasterizerState.cullingEn     = rs.cullMode != CullMode::NONE;
    rasterizerState.cullFace      = rs.cullMode == CullMode::FRONT ? GL_FRONT : GL_BACK;
    rasterizerState.frontFace     = rs.isFrontFaceCCW ? GL_CCW : GL_CW;
    rasterizerState.depthBias     = rs.depthBias;
    rasterizerState.depthBiasSlop = rs.depthBiasSlop;
    rasterizerState.lineWidth     = rs.lineWidth;
}

void GPUPipelineState::setDepthStencilState(const gfx::DepthStencilState &ds) {
    depthStencilState.depth.depthTest   = ds.depthTest;
    depthStencilState.depth.depthWrite  = ds.depthWrite;
    depthStencilState.depth.depthFunc   = getCompareFunc(ds.depthFunc);

    depthStencilState.stencilTest = ds.stencilTestBack || ds.stencilTestFront;

    // stencil front
    depthStencilState.front.func = getCompareFunc(ds.stencilFuncFront);
    depthStencilState.front.readMask  = ds.stencilReadMaskFront;
    depthStencilState.front.writemask = ds.stencilWriteMaskFront;
    depthStencilState.front.reference = ds.stencilRefFront;
    depthStencilState.front.failOp    = getStencilOP(ds.stencilFailOpFront);
    depthStencilState.front.zFailOp   = getStencilOP(ds.stencilZFailOpFront);
    depthStencilState.front.zPassOp   = getStencilOP(ds.stencilPassOpFront);

    // stencil back
    depthStencilState.back.func = getCompareFunc(ds.stencilFuncBack);
    depthStencilState.back.readMask  = ds.stencilReadMaskBack;
    depthStencilState.back.writemask = ds.stencilWriteMaskBack;
    depthStencilState.back.reference = ds.stencilRefBack;
    depthStencilState.back.failOp    = getStencilOP(ds.stencilFailOpBack);
    depthStencilState.back.zFailOp   = getStencilOP(ds.stencilZFailOpBack);
    depthStencilState.back.zPassOp   = getStencilOP(ds.stencilPassOpBack);
}

void GPUPipelineState::setBlendState(const gfx::BlendState &bs) {
    blendState.isA2C = bs.isA2C;
    blendState.color = bs.blendColor;

    // do not support different blend modes for each color attachment in a frame buffer.
    blendState.hasColor = !bs.targets.empty();
    if (blendState.hasColor) {
        const auto &target = bs.targets.front();
        blendState.target.blendEnable   = target.blend;
        blendState.target.writeMask     = static_cast<uint8_t>(target.blendColorMask);
        blendState.target.blendOp       = getBlendOP(target.blendEq);
        blendState.target.blendSrc      = getBlendFactor(target.blendSrc);
        blendState.target.blendDst      = getBlendFactor(target.blendDst);
        blendState.target.blendAlphaOp  = getBlendOP(target.blendAlphaEq);
        blendState.target.blendSrcAlpha = getBlendFactor(target.blendSrcAlpha);
        blendState.target.blendDstAlpha = getBlendFactor(target.blendDstAlpha);
    }
}

void GPUPipelineState::setShader(gfx::Shader *gfxShader) {
    if (gfxShader == nullptr) {
        CC_ABORT();
        return;
    }

    shader = static_cast<Shader *>(gfxShader)->getGPUShader();
    if (shader->program == 0) {
        shader->initShader();
        setBinding();
    }
}

void GPUPipelineState::setBinding() {
    uint32_t offset = 0;
    uint32_t blockOffset = 0;
    ccstd::vector<GLint> units;

    GL_CHECK(glUseProgram(shader->program));
    for (uint32_t set = 0, descriptorIndex = 0; set < layout->setLayouts.size(); ++set) {
        auto &setLayout = layout->setLayouts[set];
        const auto &bindings = setLayout->bindings;
        descriptors.resize(descriptorIndex + setLayout->descriptorCount);
        for (const auto &binding : bindings) {
            if (binding.type == DescriptorType::UNIFORM_BUFFER || binding.type == DescriptorType::DYNAMIC_UNIFORM_BUFFER) {
                auto iter = std::find_if(blocks.begin(), blocks.end(), [set, binding](const UniformBlock &block) {
                    return (block.set == set) && (block.binding == binding.binding);
                });
                if (iter != blocks.end()) {
                    GLuint blockIndex = glGetUniformBlockIndex(shader->program, iter->name.c_str());
                    for (uint32_t j = 0; j < binding.count && blockIndex != GL_INVALID_INDEX; ++j) {
                        auto &desc = descriptors[descriptorIndex + j];
                        desc.binding = blockOffset;
                        GL_CHECK(glUniformBlockBinding(shader->program, blockIndex + j, blockOffset));
                        ++blockOffset;
                    }
                }

            } else if (binding.type == DescriptorType::STORAGE_BUFFER || binding.type == DescriptorType::DYNAMIC_STORAGE_BUFFER) {
                auto iter = std::find_if(buffers.begin(), buffers.end(), [set, binding](const UniformStorageBuffer &buffer) {
                    return (buffer.set == set) && (buffer.binding == binding.binding);
                });
                if (iter != buffers.end()) {
                    GLuint bufferIndex = glGetProgramResourceIndex(shader->program, GL_SHADER_STORAGE_BLOCK, iter->name.c_str());
                    for (uint32_t j = 0; j < binding.count && bufferIndex != GL_INVALID_INDEX; ++j) {
                        auto &desc = descriptors[descriptorIndex + j];
                        GLint index = 0;
                        GLenum prop = GL_BUFFER_BINDING;
                        glGetProgramResourceiv(shader->program, GL_SHADER_STORAGE_BLOCK, bufferIndex + j, 1, &prop, 1, nullptr, &index);
                        desc.binding = index;
                    }
                }
            } else {
                auto iter = std::find_if(samplerTextures.begin(), samplerTextures.end(), [set, binding](const UniformSamplerTexture &texture) {
                    return (texture.set == set) && (texture.binding == binding.binding);
                });
                if (iter != samplerTextures.end()) {
                    GLuint loc = glGetUniformLocation(shader->program, iter->name.c_str());
                    for (uint32_t j = 0; j < binding.count && loc != GL_INVALID_INDEX; ++j) {
                        auto &desc = descriptors[descriptorIndex + j];
                        desc.unit = loc + j;
                        units.emplace_back(j);
                    }
                    if (!units.empty()) {
                        GL_CHECK(glUniform1iv(loc, static_cast<GLsizei>(units.size()), units.data()));
                        units.clear();
                    }
                }
            }
            descriptorIndex += binding.count;
        }

        descriptorOffsets.emplace_back(offset);
        offset += setLayout->descriptorCount;
    }
    GL_CHECK(glUseProgram(0));
}

} // namespace cc::gfx::gles
