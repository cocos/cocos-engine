#include "ReflectionComp.h"
#include "../Define.h"

namespace cc {

ReflectionComp::~ReflectionComp() {
    CC_SAFE_DESTROY(_clearPass);
    CC_SAFE_DESTROY(_clearFramebuffer);

    CC_SAFE_DESTROY(_compShader);
    CC_SAFE_DESTROY(_compDescriptorSetLayout);
    CC_SAFE_DESTROY(_compPipelineLayout);
    CC_SAFE_DESTROY(_compPipelineState);
    CC_SAFE_DESTROY(_compDescriptorSet);

    CC_SAFE_DESTROY(_compDenoiseShader);
    CC_SAFE_DESTROY(_compDenoiseDescriptorSetLayout);
    CC_SAFE_DESTROY(_compDenoisePipelineLayout);
    CC_SAFE_DESTROY(_compDenoisePipelineState);
    CC_SAFE_DESTROY(_compDenoiseDescriptorSet);

    CC_SAFE_DESTROY(_localDescriptorSetLayout);

    CC_SAFE_DESTROY(_compConstantsBuffer);
    CC_SAFE_DESTROY(_lightingTex);
    CC_SAFE_DESTROY(_worldPositionTex);
    CC_SAFE_DESTROY(_sampler);
    CC_SAFE_DESTROY(_reflectionTex);

    CC_SAFE_DESTROY(_denoiseTex);

    delete _barrierPre;

    for (auto *barrier : _barrierBeforeDenoise) {
        delete barrier;
    }

    for (auto *barrier : _barrierAfterDenoise) {
        delete barrier;
    }
}

namespace {
struct ConstantBuffer {
    Mat4 matViewProj;
    Vec2 texSize;
};
} // namespace

void ReflectionComp::init(gfx::Device *dev, gfx::Texture *lightTex, gfx::Texture *worldPositionTex, gfx::Texture *denoiseTex, const Mat4 &matViewProj,
                          uint groupSizeX, uint groupSizeY) {
    _initialized      = true;
    _device           = dev;
    _lightingTex      = lightTex;
    _matViewProj      = matViewProj;
    _worldPositionTex = worldPositionTex;
    _groupSizeX       = groupSizeX;
    _groupSizeY       = groupSizeY;
    _denoiseTex       = denoiseTex;

    gfx::TextureInfo reflectionRtInfo = {
        _denoiseTex->getType(),
        gfx::TextureUsage::STORAGE | gfx::TextureUsage::TRANSFER_SRC | gfx::TextureUsageBit::SAMPLED | gfx::TextureUsageBit::TRANSFER_DST | gfx::TextureUsageBit::COLOR_ATTACHMENT,
        _denoiseTex->getFormat(),
        _denoiseTex->getWidth(),
        _denoiseTex->getHeight(),
        gfx::TextureFlagBit::IMMUTABLE};
    _reflectionTex = _device->createTexture(reflectionRtInfo);

    gfx::SamplerInfo samplerInfo;
    samplerInfo.minFilter = gfx::Filter::POINT;
    samplerInfo.magFilter = gfx::Filter::POINT;
    _sampler              = _device->createSampler(samplerInfo);

    if (!_device->hasFeature(gfx::Feature::COMPUTE_SHADER)) return;

    uint maxInvocations = _device->getCapabilities().maxComputeWorkGroupInvocations;
    CCASSERT(_groupSizeX * _groupSizeY <= maxInvocations, "maxInvocations is too small");
    CC_LOG_INFO(" work group size: %dx%d", _groupSizeX, _groupSizeY);

    gfx::DescriptorSetLayoutInfo layoutInfo = {pipeline::localDescriptorSetLayout.bindings};
    _localDescriptorSetLayout               = _device->createDescriptorSetLayout(layoutInfo);

    gfx::ColorAttachment cAttch = {
        _reflectionTex->getFormat(),
        gfx::SampleCount::X1,
        gfx::LoadOp::CLEAR,
        gfx::StoreOp::STORE,
        {gfx::AccessType::NONE},
        {gfx::AccessType::COMPUTE_SHADER_WRITE},
    };

    gfx::RenderPassInfo clearPassInfo;
    clearPassInfo.colorAttachments.push_back(cAttch);
    _clearPass = _device->createRenderPass(clearPassInfo);

    gfx::FramebufferInfo clearFramebufferInfo;
    clearFramebufferInfo.renderPass = _clearPass;
    clearFramebufferInfo.colorTextures.push_back(_reflectionTex);
    _clearFramebuffer = _device->createFramebuffer(clearFramebufferInfo);

    gfx::GlobalBarrierInfo infoPre = {
        {
            gfx::AccessType::COLOR_ATTACHMENT_WRITE,
        },
        {
            gfx::AccessType::COMPUTE_SHADER_READ_TEXTURE,
        }};

    gfx::TextureBarrierInfo infoBeforeDenoise = {
        {
            gfx::AccessType::COMPUTE_SHADER_WRITE,
        },
        {
            gfx::AccessType::COMPUTE_SHADER_READ_TEXTURE,
        }};

    gfx::TextureBarrierInfo infoBeforeDenoise2 = {
        {
            gfx::AccessType::NONE,
        },
        {
            gfx::AccessType::COMPUTE_SHADER_WRITE,
        }};

    gfx::TextureBarrierInfo infoAfterDenoise = {
        {
            gfx::AccessType::COMPUTE_SHADER_WRITE,
        },
        {
            gfx::AccessType::FRAGMENT_SHADER_READ_TEXTURE,
        }};

    _barrierPre = _device->createGlobalBarrier(infoPre);
    _barrierBeforeDenoise.push_back(_device->createTextureBarrier(infoBeforeDenoise));
    _barrierBeforeDenoise.push_back(_device->createTextureBarrier(infoBeforeDenoise2));
    _barrierAfterDenoise.push_back(_device->createTextureBarrier(infoAfterDenoise));

    uint globalWidth  = this->getReflectionTex()->getWidth();
    uint globalHeight = this->getReflectionTex()->getHeight();
    uint groupWidth   = this->getGroupSizeX();
    uint groupHeight  = this->getGroupSizeY();

    _dispatchInfo        = {(globalWidth - 1) / groupWidth + 1, (globalHeight - 1) / groupHeight + 1, 1};
    _denoiseDispatchInfo = {((globalWidth - 1) / 2) / groupWidth + 1, ((globalHeight - 1) / 2) / groupHeight + 1, 1};

    initReflectionRes();
    initDenoiseRes();
}

void ReflectionComp::initReflectionRes() {
    _compConstantsBuffer = _device->createBuffer({gfx::BufferUsage::UNIFORM,
                                                  gfx::MemoryUsage::DEVICE | gfx::MemoryUsage::HOST,
                                                  (sizeof(Mat4) + sizeof(Vec2) + 15) / 16 * 16});

    ConstantBuffer constants;
    constants.texSize     = {float(_reflectionTex->getWidth()), float(_reflectionTex->getHeight())};
    constants.matViewProj = _matViewProj;

    if (_compConstantsBuffer) _compConstantsBuffer->update(&constants, sizeof(constants));

    ShaderSources<ComputeShaderSource> sources;
    sources.glsl4 = StringUtil::format(
        R"(
        layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;

        layout(set = 0, binding = 0) uniform Constants {  mat4 matViewProj; vec2 texSize; };
        layout(set = 0, binding = 1) uniform sampler2D lightingTex;
        layout(set = 0, binding = 2) uniform sampler2D worldPositionTex;
        layout(set = 0, binding = 3, rgba8) writeonly uniform lowp image2D reflectionTex;

        layout(set = 1, binding = 0, std140) uniform CCLocal
        {
            mat4 cc_matWorld;
            mat4 cc_matWorldIT;
            vec4 cc_lightingMapUVParam;
        };

        void main() {
            float _HorizontalPlaneHeightWS = 0.01;
            _HorizontalPlaneHeightWS = (cc_matWorld * vec4(0,0,0,1)).y;
            vec2 uv = vec2(gl_GlobalInvocationID.xy) / texSize;
            vec3 posWS = texture(worldPositionTex, uv).xyz;
            if(posWS.y <= _HorizontalPlaneHeightWS) return;

            vec3 reflectedPosWS = posWS;
            reflectedPosWS.y = reflectedPosWS.y - _HorizontalPlaneHeightWS;
            reflectedPosWS.y = reflectedPosWS.y * -1.0;
            reflectedPosWS.y = reflectedPosWS.y + _HorizontalPlaneHeightWS;


            vec4 reflectedPosCS = matViewProj * vec4(reflectedPosWS, 1);
            vec2 reflectedPosNDCxy = reflectedPosCS.xy / reflectedPosCS.w;//posCS -> posNDC
            vec2 reflectedScreenUV = reflectedPosNDCxy * 0.5 + 0.5; //posNDC

            vec2 earlyExitTest = abs(reflectedScreenUV - 0.5);
            if (earlyExitTest.x >= 0.5 || earlyExitTest.y >= 0.5) return;

            vec4 inputPixelSceneColor = texture(lightingTex, uv);
            imageStore(reflectionTex, ivec2(reflectedScreenUV * texSize), inputPixelSceneColor);
        })",
        _groupSizeX, _groupSizeY);
    sources.glsl3 = StringUtil::format(
        R"(
        layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;

        layout(std140) uniform Constants {  mat4 matViewProj; vec2 texSize; };
        uniform sampler2D lightingTex;
        uniform sampler2D worldPositionTex;
        layout(rgba8) writeonly uniform lowp image2D reflectionTex;

        layout(std140) uniform CCLocal
        {
            mat4 cc_matWorld;
            mat4 cc_matWorldIT;
            vec4 cc_lightingMapUVParam;
        };

        void main() {
            float _HorizontalPlaneHeightWS = 0.01;
            _HorizontalPlaneHeightWS = (cc_matWorld * vec4(0,0,0,1)).y;
            vec2 uv = vec2(gl_GlobalInvocationID.xy) / texSize;
            vec3 posWS = texture(worldPositionTex, uv).xyz;
            if(posWS.y <= _HorizontalPlaneHeightWS) return;

            vec3 reflectedPosWS = posWS;
            reflectedPosWS.y = reflectedPosWS.y - _HorizontalPlaneHeightWS;
            reflectedPosWS.y = reflectedPosWS.y * -1.0;
            reflectedPosWS.y = reflectedPosWS.y + _HorizontalPlaneHeightWS;


            vec4 reflectedPosCS = matViewProj * vec4(reflectedPosWS, 1);
            vec2 reflectedPosNDCxy = reflectedPosCS.xy / reflectedPosCS.w;//posCS -> posNDC
            vec2 reflectedScreenUV = reflectedPosNDCxy * 0.5 + 0.5; //posNDC

            vec2 earlyExitTest = abs(reflectedScreenUV - 0.5);
            if (earlyExitTest.x >= 0.5 || earlyExitTest.y >= 0.5) return;

            vec4 inputPixelSceneColor = texture(lightingTex, uv);
            imageStore(reflectionTex, ivec2(reflectedScreenUV * texSize), inputPixelSceneColor);
        })",
        _groupSizeX, _groupSizeY);
    // no compute support in GLES2

    gfx::ShaderInfo shaderInfo;
    shaderInfo.name   = "Compute ";
    shaderInfo.stages = {{gfx::ShaderStageFlagBit::COMPUTE, getAppropriateShaderSource(sources)}};
    shaderInfo.blocks = {
        {0, 0, "Constants", {{"matViewProj", gfx::Type::MAT4, 1}, {"texSize", gfx::Type::FLOAT2, 1}}, 1},
        {1, 0, "CCLocal", {{"cc_matWorld", gfx::Type::MAT4, 1}, {"cc_matWorldIT", gfx::Type::MAT4, 1}, {"cc_lightingMapUVParam", gfx::Type::FLOAT4, 1}}, 1}};
    shaderInfo.samplerTextures = {
        {0, 1, "lightingTex", gfx::Type::SAMPLER2D, 1},
        {0, 2, "worldPositionTex", gfx::Type::SAMPLER2D, 1}};
    shaderInfo.images = {
        {0, 3, "reflectionTex", gfx::Type::IMAGE2D, 1, gfx::MemoryAccessBit::WRITE_ONLY}};
    _compShader = _device->createShader(shaderInfo);

    gfx::DescriptorSetLayoutInfo dslInfo;
    dslInfo.bindings.push_back({0, gfx::DescriptorType::UNIFORM_BUFFER, 1, gfx::ShaderStageFlagBit::COMPUTE});
    dslInfo.bindings.push_back({1, gfx::DescriptorType::SAMPLER_TEXTURE, 1, gfx::ShaderStageFlagBit::COMPUTE});
    dslInfo.bindings.push_back({2, gfx::DescriptorType::SAMPLER_TEXTURE, 1, gfx::ShaderStageFlagBit::COMPUTE});
    dslInfo.bindings.push_back({3, gfx::DescriptorType::STORAGE_IMAGE, 1, gfx::ShaderStageFlagBit::COMPUTE});

    gfx::DescriptorSetLayout *compDescriptorSetLayout = _device->createDescriptorSetLayout(dslInfo);
    _compDescriptorSet                                = _device->createDescriptorSet({compDescriptorSetLayout});
    _compDescriptorSet->bindBuffer(0, _compConstantsBuffer);
    _compDescriptorSet->bindTexture(1, _lightingTex);
    _compDescriptorSet->bindSampler(1, _sampler);
    _compDescriptorSet->bindTexture(2, _worldPositionTex);
    _compDescriptorSet->bindSampler(2, _sampler);
    _compDescriptorSet->bindTexture(3, _reflectionTex);
    _compDescriptorSet->update();

    gfx::PipelineLayout *compPipelineLayout = _device->createPipelineLayout({{compDescriptorSetLayout, _localDescriptorSetLayout}});

    gfx::PipelineStateInfo pipelineInfo;
    pipelineInfo.shader         = _compShader;
    pipelineInfo.pipelineLayout = compPipelineLayout;
    pipelineInfo.bindPoint      = gfx::PipelineBindPoint::COMPUTE;

    _compPipelineState = _device->createPipelineState(pipelineInfo);
}

void ReflectionComp::initDenoiseRes() {
    ShaderSources<ComputeShaderSource> sources;
    sources.glsl4 = StringUtil::format(
        R"(
        layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
        layout(set = 0, binding = 0) uniform sampler2D reflectionTex;
        layout(set = 1, binding = 12, rgba8) writeonly uniform lowp image2D denoiseTex;

        void main() {
            ivec2 id = ivec2(gl_GlobalInvocationID.xy) * 2;

            vec4 center = texelFetch(reflectionTex, id + ivec2(0, 0), 0);
            vec4 right = texelFetch(reflectionTex, id + ivec2(0, 1), 0);
            vec4 bottom = texelFetch(reflectionTex, id + ivec2(1, 0), 0);
            vec4 bottomRight = texelFetch(reflectionTex, id + ivec2(1, 1), 0);

            vec4 best = center;
            best = right.a > best.a + 0.1 ? right : best;
            best = bottom.a > best.a + 0.1 ? bottom : best;
            best = bottomRight.a > best.a + 0.1 ? bottomRight : best;

            imageStore(denoiseTex, id + ivec2(0, 0), best.a > center.a + 0.1 ? best : center);
            imageStore(denoiseTex, id + ivec2(0, 1), best.a > right.a + 0.1 ? best : right);
            imageStore(denoiseTex, id + ivec2(1, 0), best.a > bottom.a + 0.1 ? best : bottom);
            imageStore(denoiseTex, id + ivec2(1, 1), best.a > bottomRight.a + 0.1 ? best : bottomRight);

        })",
        _groupSizeX, _groupSizeY);
    sources.glsl3 = StringUtil::format(
        R"(
        layout(local_size_x = 8, local_size_y = 8, local_size_z = 1) in;
        uniform sampler2D reflectionTex;
        layout(rgba8) writeonly uniform lowp image2D denoiseTex;

        void main() {
            ivec2 id = ivec2(gl_GlobalInvocationID.xy) * 2;

            vec4 center = texelFetch(reflectionTex, id + ivec2(0, 0), 0);
            vec4 right = texelFetch(reflectionTex, id + ivec2(0, 1), 0);
            vec4 bottom = texelFetch(reflectionTex, id + ivec2(1, 0), 0);
            vec4 bottomRight = texelFetch(reflectionTex, id + ivec2(1, 1), 0);

            vec4 best = center;
            best = right.a > best.a + 0.1 ? right : best;
            best = bottom.a > best.a + 0.1 ? bottom : best;
            best = bottomRight.a > best.a + 0.1 ? bottomRight : best;

            imageStore(denoiseTex, id + ivec2(0, 0), best.a > center.a + 0.1 ? best : center);
            imageStore(denoiseTex, id + ivec2(0, 1), best.a > right.a + 0.1 ? best : right);
            imageStore(denoiseTex, id + ivec2(1, 0), best.a > bottom.a + 0.1 ? best : bottom);
            imageStore(denoiseTex, id + ivec2(1, 1), best.a > bottomRight.a + 0.1 ? best : bottomRight);

        })",
        _groupSizeX, _groupSizeY);
    // no compute support in GLES2

    gfx::ShaderInfo shaderInfo;
    shaderInfo.name            = "Compute ";
    shaderInfo.stages          = {{gfx::ShaderStageFlagBit::COMPUTE, getAppropriateShaderSource(sources)}};
    shaderInfo.blocks          = {};
    shaderInfo.samplerTextures = {
        {0, 0, "reflectionTex", gfx::Type::SAMPLER2D, 1}};
    shaderInfo.images = {
        {1, 12, "denoiseTex", gfx::Type::IMAGE2D, 1, gfx::MemoryAccessBit::WRITE_ONLY}};
    _compDenoiseShader = _device->createShader(shaderInfo);

    gfx::DescriptorSetLayoutInfo dslInfo;
    dslInfo.bindings.push_back({0, gfx::DescriptorType::SAMPLER_TEXTURE, 1, gfx::ShaderStageFlagBit::COMPUTE});
    dslInfo.bindings.push_back({1, gfx::DescriptorType::STORAGE_IMAGE, 1, gfx::ShaderStageFlagBit::COMPUTE});
    _compDenoiseDescriptorSetLayout = _device->createDescriptorSetLayout(dslInfo);
    _compDenoisePipelineLayout      = _device->createPipelineLayout({{_compDenoiseDescriptorSetLayout, _localDescriptorSetLayout}});

    _compDenoiseDescriptorSet = _device->createDescriptorSet({_compDenoiseDescriptorSetLayout});
    _compDenoiseDescriptorSet->bindTexture(0, _reflectionTex);
    _compDenoiseDescriptorSet->bindSampler(0, _sampler);
    _compDenoiseDescriptorSet->update();

    gfx::PipelineStateInfo pipelineInfo;
    pipelineInfo.shader         = _compDenoiseShader;
    pipelineInfo.pipelineLayout = _compDenoisePipelineLayout;
    pipelineInfo.bindPoint      = gfx::PipelineBindPoint::COMPUTE;

    _compDenoisePipelineState = _device->createPipelineState(pipelineInfo);
}

template <typename T>
T &ReflectionComp::getAppropriateShaderSource(ShaderSources<T> &sources) {
    switch (_device->getGfxAPI()) {
        case gfx::API::GLES2:
            return sources.glsl1;
        case gfx::API::GLES3:
            return sources.glsl3;
        case gfx::API::METAL:
        case gfx::API::VULKAN:
            return sources.glsl4;
        default: break;
    }
    return sources.glsl4;
}

} // namespace cc
