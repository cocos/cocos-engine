/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated July 28, 2023. Replaces all prior versions.
 *
 * Copyright (c) 2013-2023, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software or
 * otherwise create derivative works of the Spine Runtimes (collectively,
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
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THE
 * SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/
#ifndef Spine_SkeletonRenderer_h
#define Spine_SkeletonRenderer_h

#include <spine/BlockAllocator.h>
#include <spine/BlendMode.h>
#include <spine/SkeletonClipping.h>

namespace spine {
    class Skeleton;

    struct SP_API RenderCommand {
        float *positions;
        float *uvs;
        uint32_t *colors;
        uint32_t *darkColors;
        int32_t numVertices;
        uint16_t *indices;
        int32_t numIndices;
        BlendMode blendMode;
        void *texture;
        RenderCommand *next;
    };

    class SP_API SkeletonRenderer: public SpineObject {
    public:
        explicit SkeletonRenderer();

        ~SkeletonRenderer();

        RenderCommand *render(Skeleton &skeleton);
    private:
        BlockAllocator _allocator;
        Vector<float> _worldVertices;
        Vector<unsigned short> _quadIndices;
        SkeletonClipping _clipping;
        Vector<RenderCommand *> _renderCommands;
    };
}

#endif