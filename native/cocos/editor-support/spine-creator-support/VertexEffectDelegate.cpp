/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated January 1, 2020. Replaces all prior versions.
 *
 * Copyright (c) 2013-2020, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software
 * or otherwise create derivative works of the Spine Runtimes (collectively,
 * "Products"), provided that each user of the Products must obtain their own
 * Spine Editor license and redistribution of the Products in any form must
 * include this license and copyright notice.
 *
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/

#include "VertexEffectDelegate.h"
namespace spine {

VertexEffectDelegate::VertexEffectDelegate() {
}

VertexEffectDelegate::~VertexEffectDelegate() {
    clear();
}

void VertexEffectDelegate::clear() {
    if (_interpolation) {
        delete _interpolation;
        _interpolation = nullptr;
    }
    if (_vertexEffect) {
        delete _vertexEffect;
        _vertexEffect = nullptr;
    }
    _effectType = "none";
}

JitterVertexEffect *VertexEffectDelegate::initJitter(float jitterX, float jitterY) {
    clear();
    _vertexEffect = new JitterVertexEffect(jitterX, jitterY);
    _effectType = "jitter";
    return (JitterVertexEffect *)_vertexEffect;
}

SwirlVertexEffect *VertexEffectDelegate::initSwirlWithPow(float radius, int power) {
    clear();
    _interpolation = new PowInterpolation(power);
    _vertexEffect = new SwirlVertexEffect(radius, *_interpolation);
    _effectType = "swirl";
    return (SwirlVertexEffect *)_vertexEffect;
}

SwirlVertexEffect *VertexEffectDelegate::initSwirlWithPowOut(float radius, int power) {
    clear();
    _interpolation = new PowOutInterpolation(power);
    _vertexEffect = new SwirlVertexEffect(radius, *_interpolation);
    _effectType = "swirl";
    return (SwirlVertexEffect *)_vertexEffect;
}

JitterVertexEffect *VertexEffectDelegate::getJitterVertexEffect() {
    JitterVertexEffect *jitter = dynamic_cast<JitterVertexEffect *>(_vertexEffect);
    return jitter;
}

SwirlVertexEffect *VertexEffectDelegate::getSwirlVertexEffect() {
    SwirlVertexEffect *swirl = dynamic_cast<SwirlVertexEffect *>(_vertexEffect);
    return swirl;
}
} // namespace spine
