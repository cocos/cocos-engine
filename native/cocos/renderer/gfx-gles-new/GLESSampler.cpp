#include "GLESSampler.h"
#include "GLESConversion.h"

namespace cc::gfx::gles {

static GLenum convertMinFilter(Filter minFilter, Filter mipFilter) {
    if (minFilter == Filter::LINEAR || minFilter == Filter::ANISOTROPIC) {
        if (mipFilter == Filter::LINEAR || mipFilter == Filter::ANISOTROPIC) {
            return GL_LINEAR_MIPMAP_LINEAR;
        } else if (mipFilter == Filter::POINT) {
            return GL_LINEAR_MIPMAP_NEAREST;
        } else {
            return GL_LINEAR;
        }
    } else {
        if (mipFilter == Filter::LINEAR || mipFilter == Filter::ANISOTROPIC) {
            return GL_NEAREST_MIPMAP_LINEAR;
        } else if (mipFilter == Filter::POINT) {
            return GL_NEAREST_MIPMAP_NEAREST;
        } else {
            return GL_NEAREST;
        }
    }
}

static GLenum convertMagFilter(Filter magFilter) {
    if (magFilter == Filter::LINEAR || magFilter == Filter::ANISOTROPIC) {
        return GL_LINEAR;
    } else {
        return GL_NEAREST;
    }
}

Sampler::Sampler(const SamplerInfo &info) : gfx::Sampler(info) {
    _typedID = generateObjectID<decltype(this)>();

    _gpuSampler = ccnew GPUSampler();
    _gpuSampler->minFilter = convertMinFilter(_info.minFilter, _info.mipFilter);
    _gpuSampler->magFilter = convertMagFilter(_info.magFilter);
    _gpuSampler->wrapS = getWrapMode(_info.addressU);
    _gpuSampler->wrapT = getWrapMode(_info.addressV);
    _gpuSampler->wrapR = getWrapMode(_info.addressW);
    _gpuSampler->initSampler();
}

GPUSampler::~GPUSampler() noexcept {
    if (samplerId != 0) {
        glDeleteSamplers(1, &samplerId);
    }
}

void GPUSampler::initSampler() {
    GL_CHECK(glGenSamplers(1, &samplerId));
    GL_CHECK(glSamplerParameteri(samplerId, GL_TEXTURE_MIN_FILTER, minFilter));
    GL_CHECK(glSamplerParameteri(samplerId, GL_TEXTURE_MAG_FILTER, magFilter));
    GL_CHECK(glSamplerParameteri(samplerId, GL_TEXTURE_WRAP_S, wrapS));
    GL_CHECK(glSamplerParameteri(samplerId, GL_TEXTURE_WRAP_T, wrapT));
    GL_CHECK(glSamplerParameteri(samplerId, GL_TEXTURE_WRAP_R, wrapR));
    GL_CHECK(glSamplerParameterf(samplerId, GL_TEXTURE_MIN_LOD, static_cast<GLfloat>(0.25))); // todo
    GL_CHECK(glSamplerParameterf(samplerId, GL_TEXTURE_MAX_LOD, static_cast<GLfloat>(13)));   // todo
}

} // namespace cc::gfx::gles
